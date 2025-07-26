<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Services\AdminSecurityService;

class Admins extends Controller
{
    protected $adminSecurityService;

    public function __construct(AdminSecurityService $adminSecurityService)
    {
        $this->adminSecurityService = $adminSecurityService;
    }

    public function register(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'surename' => 'required|string|max:50',
            'username' => 'required|string|min:3|max:50|unique:admins,username',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'name.required' => 'Name is required',
            'name.max' => 'Name must not exceed 50 characters',
            'surename.required' => 'Surname is required',
            'surename.max' => 'Surname must not exceed 50 characters',
            'username.required' => 'Username is required',
            'username.min' => 'Username must be at least 3 characters',
            'username.max' => 'Username must not exceed 50 characters',
            'username.unique' => 'Username is already taken',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
            'password.confirmed' => 'Password confirmation does not match',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if admins table exists
            if (!DB::getSchemaBuilder()->hasTable('admins')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admins table does not exist'
                ], 500);
            }

            // Create the admin user
            $adminId = DB::table('admins')->insertGetId([
                'name' => $request->name,
                'surename' => $request->surename,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'status' => true, // Active by default
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);

            // Log the registration
            Log::info('New admin registered', [
                'admin_id' => $adminId,
                'username' => $request->username,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Admin account created successfully',
                'data' => [
                    'id' => $adminId,
                    'name' => $request->name,
                    'surename' => $request->surename,
                    'username' => $request->username,
                    'status' => true
                ]
            ], 201);

        } catch (\Exception $e) {
            // Log the error
            Log::error('Admin registration failed: ' . $e->getMessage(), [
                'request_data' => $request->except(['password', 'password_confirmation']),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again later.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Username and password are required'
            ], 422);
        }

        try {
            // Check if admins table exists
            if (!DB::getSchemaBuilder()->hasTable('admins')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admins table does not exist'
                ], 500);
            }

            $admin = DB::table('admins')
                ->where('username', $request->username)
                ->whereNull('deleted_at')
                ->first();

            if (!$admin || !Hash::check($request->password, $admin->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid username or password'
                ], 401);
            }

            if ($admin->status !== true) {
                return response()->json([
                    'success' => false,
                    'message' => 'Admin account is inactive'
                ], 403);
            }

            // Generate remember token
            $rememberToken = bin2hex(random_bytes(32));
            
            DB::table('admins')
                ->where('id', $admin->id)
                ->update([
                    'remember_token' => $rememberToken,
                    'updated_at' => Carbon::now()
                ]);

            // Log the successful login
            Log::info('Admin logged in successfully', [
                'admin_id' => $admin->id,
                'username' => $admin->username,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'admin' => [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'surename' => $admin->surename,
                        'username' => $admin->username,
                        'status' => $admin->status
                    ],
                    'token' => $rememberToken
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Admin login failed: ' . $e->getMessage(), [
                'username' => $request->username,
                'ip_address' => $request->ip(),
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();
            
            if ($token) {
                DB::table('admins')
                    ->where('remember_token', $token)
                    ->update([
                        'remember_token' => null,
                        'updated_at' => Carbon::now()
                    ]);
            }

            Log::info('Admin logged out', [
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Admin logout failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Logout failed'
            ], 500);
        }
    }

    public function me(Request $request)
    {
        try {
            $admin = $request->user();
            
            if (!$admin || $admin->type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'surename' => $admin->surename,
                    'username' => $admin->username,
                    'status' => $admin->status,
                    'created_at' => $admin->created_at
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Get admin profile failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to get profile'
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $admin = $request->user();
            
            if (!$admin || $admin->type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Admin can only update their own profile
            if ($admin->id != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only update your own profile'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:50',
                'surename' => 'sometimes|string|max:50',
                'username' => 'sometimes|string|min:3|max:50|unique:admins,username,' . $id,
                'password' => 'sometimes|string|min:6|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = $request->only(['name', 'surename', 'username']);
            
            if ($request->has('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $updateData['updated_at'] = Carbon::now();

            DB::table('admins')
                ->where('id', $id)
                ->update($updateData);

            Log::info('Admin profile updated', [
                'admin_id' => $admin->id,
                'ip_address' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Admin profile update failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            $admin = $request->user();
            
            if (!$admin || $admin->type !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
            }

            // Admin can only delete their own account
            if ($admin->id != $id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only delete your own account'
                ], 403);
            }

            // Soft delete the admin account
            DB::table('admins')
                ->where('id', $id)
                ->update([
                    'deleted_at' => Carbon::now(),
                    'updated_at' => Carbon::now()
                ]);

            Log::warning('Admin account deleted', [
                'admin_id' => $admin->id,
                'ip_address' => $request->ip()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Account deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Admin account deletion failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete account'
            ], 500);
        }
    }

    public function debug()
    {
        return response()->json([
            'message' => 'Admin API is working',
            'timestamp' => Carbon::now(),
            'tables' => [
                'admins_exists' => DB::getSchemaBuilder()->hasTable('admins'),
                'admins_count' => DB::getSchemaBuilder()->hasTable('admins') ? DB::table('admins')->count() : 0
            ]
        ]);
    }
}
