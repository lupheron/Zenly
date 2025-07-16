<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SecurityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SecurityController extends Controller
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    // Get security dashboard data
    public function dashboard()
    {
        $data = [
            'blocked_users' => $this->securityService->getBlockedUsers(),
            'stats' => $this->getSecurityStats(),
            'recent_activities' => $this->getRecentSuspiciousActivities()
        ];

        return response()->json($data);
    }

    // Get all blocked users
    public function getBlockedUsers()
    {
        return response()->json([
            'blocked_users' => $this->securityService->getBlockedUsers()
        ]);
    }

    // Unblock a user
    public function unblockUser($userId)
    {
        $this->securityService->unblockUser($userId);

        return response()->json([
            'message' => 'User unblocked successfully'
        ]);
    }

    // Get suspicious activities with filters
    public function getSuspiciousActivities(Request $request)
    {
        $query = DB::table('suspicious_activities')
            ->join('users', 'suspicious_activities.user_id', '=', 'users.id')
            ->select(
                'suspicious_activities.*',
                'users.username',
                'users.email'
            )
            ->orderBy('suspicious_activities.created_at', 'desc');

        // Apply filters
        if ($request->has('user_id')) {
            $query->where('suspicious_activities.user_id', $request->user_id);
        }

        if ($request->has('activity_type')) {
            $query->where('suspicious_activities.activity_type', $request->activity_type);
        }

        if ($request->has('controller')) {
            $query->where('suspicious_activities.controller', $request->controller);
        }

        if ($request->has('date_from')) {
            $query->where('suspicious_activities.created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('suspicious_activities.created_at', '<=', $request->date_to);
        }

        $activities = $query->paginate(50);

        return response()->json($activities);
    }

    // Get security statistics
    private function getSecurityStats()
    {
        return [
            'total_blocks_today' => DB::table('user_blocks')
                ->whereDate('blocked_at', Carbon::today())
                ->count(),

            'total_blocks_week' => DB::table('user_blocks')
                ->where('blocked_at', '>=', Carbon::now()->subWeek())
                ->count(),

            'active_blocks' => DB::table('user_blocks')
                ->where('blocked_until', '>', Carbon::now())
                ->count(),

            'suspicious_activities_today' => DB::table('suspicious_activities')
                ->whereDate('created_at', Carbon::today())
                ->count(),

            'top_violation_types' => DB::table('suspicious_activities')
                ->select('activity_type', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->groupBy('activity_type')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get(),

            'top_controllers' => DB::table('suspicious_activities')
                ->select('controller', DB::raw('COUNT(*) as count'))
                ->where('created_at', '>=', Carbon::now()->subDays(7))
                ->groupBy('controller')
                ->orderBy('count', 'desc')
                ->limit(5)
                ->get(),

            'hourly_blocks' => DB::table('user_blocks')
                ->select(
                    DB::raw('HOUR(blocked_at) as hour'),
                    DB::raw('COUNT(*) as count')
                )
                ->whereDate('blocked_at', Carbon::today())
                ->groupBy('hour')
                ->orderBy('hour')
                ->get()
        ];
    }

    // Get recent suspicious activities
    private function getRecentSuspiciousActivities()
    {
        return DB::table('suspicious_activities')
            ->join('users', 'suspicious_activities.user_id', '=', 'users.id')
            ->select(
                'suspicious_activities.*',
                'users.username',
                'users.email'
            )
            ->orderBy('suspicious_activities.created_at', 'desc')
            ->limit(20)
            ->get();
    }

    // Get security logs with filters
    public function getSecurityLogs(Request $request)
    {
        $query = DB::table('user_blocks')
            ->join('users', 'user_blocks.user_id', '=', 'users.id')
            ->select(
                'user_blocks.*',
                'users.username',
                'users.email'
            )
            ->orderBy('user_blocks.created_at', 'desc');

        // Apply filters
        if ($request->has('user_id')) {
            $query->where('user_blocks.user_id', $request->user_id);
        }

        if ($request->has('date_from')) {
            $query->where('user_blocks.blocked_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->where('user_blocks.blocked_at', '<=', $request->date_to);
        }

        if ($request->has('active_only')) {
            $query->where('user_blocks.blocked_until', '>', Carbon::now());
        }

        $logs = $query->paginate(50);

        return response()->json($logs);
    }

    // Get user activity report
    public function getUserActivityReport($userId)
    {
        $user = DB::table('users')->where('id', $userId)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $report = [
            'user' => $user,
            'total_blocks' => DB::table('user_blocks')
                ->where('user_id', $userId)
                ->count(),

            'active_blocks' => DB::table('user_blocks')
                ->where('user_id', $userId)
                ->where('blocked_until', '>', Carbon::now())
                ->count(),

            'suspicious_activities' => DB::table('suspicious_activities')
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->limit(50)
                ->get(),

            'recent_blocks' => DB::table('user_blocks')
                ->where('user_id', $userId)
                ->orderBy('blocked_at', 'desc')
                ->limit(10)
                ->get(),

            'activity_by_controller' => DB::table('suspicious_activities')
                ->select('controller', DB::raw('COUNT(*) as count'))
                ->where('user_id', $userId)
                ->groupBy('controller')
                ->orderBy('count', 'desc')
                ->get(),

            'activity_by_type' => DB::table('suspicious_activities')
                ->select('activity_type', DB::raw('COUNT(*) as count'))
                ->where('user_id', $userId)
                ->groupBy('activity_type')
                ->orderBy('count', 'desc')
                ->get()
        ];

        return response()->json($report);
    }
}
