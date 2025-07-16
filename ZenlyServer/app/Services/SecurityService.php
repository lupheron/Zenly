<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SecurityService
{
    // Security rules for each controller
    private $securityRules = [
        'Posts' => [
            'create' => ['max_per_minute' => 3, 'max_per_hour' => 50, 'block_duration' => 60, 'table' => 'posts'],
            'update' => ['max_per_minute' => 5, 'max_per_hour' => 100, 'block_duration' => 30, 'table' => 'posts'],
            'delete' => ['max_per_minute' => 2, 'max_per_hour' => 20, 'block_duration' => 120, 'table' => 'posts']
        ],
        'PostComments' => [
            'create' => ['max_per_minute' => 5, 'max_per_hour' => 100, 'block_duration' => 30, 'table' => 'post_comments']
        ],
        'Comments' => [
            'create' => ['max_per_minute' => 5, 'max_per_hour' => 100, 'block_duration' => 30, 'table' => 'comments']
        ],
        'Rating' => [
            'create' => ['max_per_minute' => 10, 'max_per_hour' => 200, 'block_duration' => 15, 'table' => 'rating']
        ],
        'Gallery' => [
            'create' => ['max_per_minute' => 5, 'max_per_hour' => 50, 'block_duration' => 30, 'table' => 'gallery'],
            'delete' => ['max_per_minute' => 3, 'max_per_hour' => 30, 'block_duration' => 15, 'table' => 'gallery']
        ],
        'Features' => [
            'create' => ['max_per_minute' => 10, 'max_per_hour' => 100, 'block_duration' => 15, 'table' => 'features'],
            'delete' => ['max_per_minute' => 5, 'max_per_hour' => 50, 'block_duration' => 15, 'table' => 'features']
        ],
        'Users' => [
            'create' => ['max_per_minute' => 2, 'max_per_hour' => 10, 'block_duration' => 120, 'table' => 'users'],
            'update' => ['max_per_minute' => 3, 'max_per_hour' => 20, 'block_duration' => 60, 'table' => 'users'],
            'delete' => ['max_per_minute' => 1, 'max_per_hour' => 5, 'block_duration' => 180, 'table' => 'users']
        ],
        'PostViews' => [
            'increaseInterest' => ['max_per_minute' => 30, 'max_per_hour' => 500, 'block_duration' => 10, 'table' => 'post_views']
        ]
    ];

    public function checkUserActivity($userId, $controllerName, $action, $requestData = [])
    {
        // Check if user is already blocked
        if ($this->isUserBlocked($userId)) {
            return [
                'blocked' => true,
                'message' => 'Account temporarily blocked due to suspicious activity',
                'blocked_until' => Cache::get("user_blocked_{$userId}")
            ];
        }

        // Get security rules for this controller/action
        $rules = $this->getSecurityRules($controllerName, $action);

        if (!$rules) {
            return ['blocked' => false]; // No rules defined, allow
        }

        // Check activity violations
        $violations = $this->checkActivityViolations($userId, $rules, $requestData);

        if (!empty($violations)) {
            $this->blockUser($userId, $controllerName, $action, $violations, $rules['block_duration']);

            return [
                'blocked' => true,
                'message' => 'Account blocked due to suspicious activity',
                'violations' => $violations,
                'blocked_for' => $rules['block_duration'] . ' minutes'
            ];
        }

        return ['blocked' => false];
    }

    private function getSecurityRules($controllerName, $action)
    {
        return $this->securityRules[$controllerName][$action] ?? null;
    }

    private function checkActivityViolations($userId, $rules, $requestData)
    {
        $violations = [];
        $now = Carbon::now();

        // Check 1 minute window
        $oneMinuteCount = $this->getActivityCount($userId, $rules['table'], $now->copy()->subMinute());
        if ($oneMinuteCount >= $rules['max_per_minute']) {
            $violations[] = [
                'type' => 'rapid_activity',
                'window' => '1 minute',
                'count' => $oneMinuteCount,
                'limit' => $rules['max_per_minute']
            ];
        }

        // Check 1 hour window
        $hourCount = $this->getActivityCount($userId, $rules['table'], $now->copy()->subHour());
        if ($hourCount >= $rules['max_per_hour']) {
            $violations[] = [
                'type' => 'excessive_activity',
                'window' => '1 hour',
                'count' => $hourCount,
                'limit' => $rules['max_per_hour']
            ];
        }

        // Check for duplicate content (for posts and comments)
        if (in_array($rules['table'], ['posts', 'post_comments', 'comments'])) {
            $duplicateCheck = $this->checkDuplicateContent($userId, $rules['table'], $requestData);
            if ($duplicateCheck) {
                $violations[] = [
                    'type' => 'duplicate_content',
                    'details' => 'Similar content detected in recent submissions'
                ];
            }
        }

        return $violations;
    }

    private function getActivityCount($userId, $table, $since)
    {
        return DB::table($table)
            ->where('user_id', $userId)
            ->where('created_at', '>=', $since)
            ->count();
    }

    private function checkDuplicateContent($userId, $table, $requestData)
    {
        $query = DB::table($table)
            ->where('user_id', $userId)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5));

        if ($table === 'posts' && isset($requestData['title'])) {
            return $query->where('title', $requestData['title'])->exists();
        }

        if ($table === 'post_comments' && isset($requestData['comment'])) {
            return $query->where('comment', $requestData['comment'])->exists();
        }

        if ($table === 'comments' && isset($requestData['comment'])) {
            return $query->where('comment', $requestData['comment'])->exists();
        }

        return false;
    }

    private function blockUser($userId, $controller, $action, $violations, $blockDurationMinutes)
    {
        $blockedUntil = Carbon::now()->addMinutes($blockDurationMinutes);

        // Store in cache for quick access
        Cache::put("user_blocked_{$userId}", $blockedUntil, $blockedUntil);

        // Store in database
        DB::table('user_blocks')->insert([
            'user_id' => $userId,
            'blocked_at' => Carbon::now(),
            'blocked_until' => $blockedUntil,
            'reason' => "Suspicious activity in {$controller}::{$action}",
            'details' => json_encode($violations),
            'ip_address' => request()->ip(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        // Log suspicious activity
        DB::table('suspicious_activities')->insert([
            'user_id' => $userId,
            'activity_type' => 'user_blocked',
            'controller' => $controller,
            'action' => $action,
            'count' => count($violations),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_data' => json_encode($violations),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }

    private function isUserBlocked($userId)
    {
        $blockedUntil = Cache::get("user_blocked_{$userId}");

        if ($blockedUntil && Carbon::now()->lt($blockedUntil)) {
            return true;
        }

        // Clean up expired blocks
        if ($blockedUntil && Carbon::now()->gte($blockedUntil)) {
            Cache::forget("user_blocked_{$userId}");
        }

        return false;
    }

    public function logSuspiciousActivity($userId, $controller, $action, $activityType, $details = [])
    {
        DB::table('suspicious_activities')->insert([
            'user_id' => $userId,
            'activity_type' => $activityType,
            'controller' => $controller,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_data' => json_encode($details),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
    }

    public function getBlockedUsers()
    {
        return DB::table('user_blocks')
            ->where('blocked_until', '>', Carbon::now())
            ->join('users', 'user_blocks.user_id', '=', 'users.id')
            ->select('users.id', 'users.username', 'users.email', 'user_blocks.*')
            ->get();
    }

    public function unblockUser($userId)
    {
        Cache::forget("user_blocked_{$userId}");

        DB::table('user_blocks')
            ->where('user_id', $userId)
            ->where('blocked_until', '>', Carbon::now())
            ->update(['blocked_until' => Carbon::now()]);
    }
}
