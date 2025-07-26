<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class AdminSecurityService
{
    // Admin isolation rules - prevent one admin from accessing another admin's data
    private $adminIsolationRules = [
        'Admins' => [
            'me' => ['self_only' => true], // Can only access own profile
            'update' => ['self_only' => true], // Can only update own profile
            'delete' => ['self_only' => true], // Can only delete own account
            'logout' => ['self_only' => true], // Can only logout own session
        ]
    ];

    public function checkAdminActivity($adminId, $controllerName, $action, $requestData = [])
    {
        // Check admin isolation rules
        $isolationCheck = $this->checkAdminIsolation($adminId, $controllerName, $action, $requestData);
        
        if ($isolationCheck['blocked']) {
            return $isolationCheck;
        }

        // Check for suspicious admin-to-admin access attempts
        $suspiciousCheck = $this->checkSuspiciousAdminAccess($adminId, $controllerName, $action, $requestData);
        
        if ($suspiciousCheck['blocked']) {
            return $suspiciousCheck;
        }

        return ['blocked' => false];
    }

    private function checkAdminIsolation($adminId, $controllerName, $action, $requestData)
    {
        $rules = $this->getAdminIsolationRules($controllerName, $action);

        if (!$rules) {
            return ['blocked' => false]; // No isolation rules defined
        }

        // Check if admin is trying to access another admin's data
        if (isset($rules['self_only']) && $rules['self_only']) {
            $targetAdminId = $this->getTargetAdminId($requestData, $action);
            
            if ($targetAdminId && $targetAdminId != $adminId) {
                $this->logAdminIsolationViolation($adminId, $targetAdminId, $controllerName, $action);
                
                return [
                    'blocked' => true,
                    'message' => 'Access denied: You can only access your own data',
                    'violation_type' => 'admin_isolation'
                ];
            }
        }

        return ['blocked' => false];
    }

    private function checkSuspiciousAdminAccess($adminId, $controllerName, $action, $requestData)
    {
        // Check for attempts to access other admin accounts
        if (isset($requestData['admin_id']) && $requestData['admin_id'] != $adminId) {
            $this->logSuspiciousAdminAccess($adminId, $requestData['admin_id'], $controllerName, $action);
            
            return [
                'blocked' => true,
                'message' => 'Suspicious activity detected: Attempting to access another admin account',
                'violation_type' => 'suspicious_admin_access'
            ];
        }

        // Check for attempts to modify other admin's data
        if (isset($requestData['id']) && $requestData['id'] != $adminId) {
            $targetAdmin = DB::table('admins')->where('id', $requestData['id'])->first();
            if ($targetAdmin) {
                $this->logSuspiciousAdminAccess($adminId, $requestData['id'], $controllerName, $action);
                
                return [
                    'blocked' => true,
                    'message' => 'Access denied: Cannot modify another admin\'s data',
                    'violation_type' => 'unauthorized_admin_modification'
                ];
            }
        }

        return ['blocked' => false];
    }

    private function getAdminIsolationRules($controllerName, $action)
    {
        return $this->adminIsolationRules[$controllerName][$action] ?? null;
    }

    private function getTargetAdminId($requestData, $action)
    {
        // Extract target admin ID from request data
        if (isset($requestData['admin_id'])) {
            return $requestData['admin_id'];
        }
        
        if (isset($requestData['id'])) {
            return $requestData['id'];
        }
        
        if (isset($requestData['user_id'])) {
            // Check if user_id refers to an admin
            $admin = DB::table('admins')->where('id', $requestData['user_id'])->first();
            return $admin ? $requestData['user_id'] : null;
        }
        
        return null;
    }

    private function logAdminIsolationViolation($adminId, $targetAdminId, $controller, $action)
    {
        Log::warning('Admin isolation violation detected', [
            'admin_id' => $adminId,
            'target_admin_id' => $targetAdminId,
            'controller' => $controller,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_data' => request()->all()
        ]);

        // Store violation in database for audit
        DB::table('admin_security_violations')->insert([
            'admin_id' => $adminId,
            'target_admin_id' => $targetAdminId,
            'violation_type' => 'admin_isolation',
            'controller' => $controller,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_data' => json_encode(request()->all()),
            'created_at' => Carbon::now()
        ]);
    }

    private function logSuspiciousAdminAccess($adminId, $targetAdminId, $controller, $action)
    {
        Log::warning('Suspicious admin access attempt', [
            'admin_id' => $adminId,
            'target_admin_id' => $targetAdminId,
            'controller' => $controller,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_data' => request()->all()
        ]);

        // Store violation in database for audit
        DB::table('admin_security_violations')->insert([
            'admin_id' => $adminId,
            'target_admin_id' => $targetAdminId,
            'violation_type' => 'suspicious_admin_access',
            'controller' => $controller,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_data' => json_encode(request()->all()),
            'created_at' => Carbon::now()
        ]);
    }

    public function logAdminActivity($adminId, $controller, $action, $activityType, $details = [])
    {
        Log::info('Admin activity logged', [
            'admin_id' => $adminId,
            'activity_type' => $activityType,
            'controller' => $controller,
            'action' => $action,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'details' => $details
        ]);
    }

    public function getAdminViolations($adminId = null)
    {
        $query = DB::table('admin_security_violations')
            ->join('admins', 'admin_security_violations.admin_id', '=', 'admins.id')
            ->select('admin_security_violations.*', 'admins.username', 'admins.name', 'admins.surename');

        if ($adminId) {
            $query->where('admin_security_violations.admin_id', $adminId);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function canAdminAccessResource($adminId, $resourceId, $resourceType = 'admin')
    {
        // Admin can only access their own resources
        if ($resourceType === 'admin') {
            return $adminId == $resourceId;
        }
        
        // For other resource types, implement specific rules here
        return true;
    }
} 