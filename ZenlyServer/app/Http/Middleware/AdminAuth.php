<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Admin token required', 'status' => 401], 401);
        }

        // Only check admins table
        $admin = DB::table('admins')
            ->where('remember_token', $token)
            ->whereNull('deleted_at')
            ->first();

        if (!$admin) {
            return response()->json(['message' => 'Invalid admin token', 'status' => 403], 403);
        }

        if ($admin->status === false) {
            return response()->json(['message' => 'Admin account is inactive', 'status' => 403], 403);
        }

        // Add type field to identify as admin
        $admin->type = 'admin';
        $request->setUserResolver(fn() => $admin);

        return $next($request);
    }
} 