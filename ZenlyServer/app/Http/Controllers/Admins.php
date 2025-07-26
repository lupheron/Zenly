<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Services\SecurityService;

class Admins extends Controller
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Get all admins (only accessible by super admins)
     */
    public function index(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            // Log unauthorized admin access attempt
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Admins',
                'index',
                'unauthorized_admin_access',
                ['user_type' => $authUser->type ?? 'anonymous']
            );

            return response()->json([
                "message" => "Only admins can access this",
                "status" => 403
            ], 403);
        }

        $admins = DB::table("admins")->whereNull('deleted_at')->get();
        return response()->json($admins);
    }

    /**
     * Get admin by ID
     */
    public function getAdminById(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            // Log unauthorized admin access attempt
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Admins',
                'getAdminById',
                'unauthorized_admin_access',
                ['requested_admin_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to access this admin",
                "status" => 403
            ], 403);
        }

        $admin = DB::table("admins")->where("id", $id)->whereNull('deleted_at')->first();
        if ($admin) {
            return response()->json($admin);
        } else {
            return response()->json([
                "message" => "Admin not found",
                "status" => 404
            ], 404);
        }
    }

    /**
     * Register a new admin
     */
    public function register(Request $request)
    {
        $existingAdmin = DB::table('admins')->where('username', $request['username'])->first();

        if ($existingAdmin) {
            $this->securityService->logSuspiciousActivity(
                0,
                'Admins',
                'register',
                'duplicate_username_attempt',
                ['username' => $request['username']]
            );

            return response()->json([
                "message" => "Username already exists",
                "status" => 409
            ], 409);
        }

        try {
            $admin = DB::table('admins')->insert([
                "name" => $request["name"],
                "surename" => $request["surename"],
                "username" => $request["username"],
                "password" => Hash::make($request["password"]),
                "status" => $request["status"] ?? true,
                "created_at" => Carbon::now(),
                "updated_at" => Carbon::now(),
            ]);

            if ($admin) {
                return response()->json([
                    "message" => "Admin registered successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Registration failed",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                0,
                'Admins',
                'register',
                'registration_error',
                ['error' => $e->getMessage(), 'username' => $request['username']]
            );

            return response()->json([
                "message" => "Registration failed",
                "status" => 500
            ], 500);
        }
    }

    /**
     * Admin login
     */
    public function login(Request $request)
    {
        $admin = DB::table("admins")->where("username", $request["username"])->first();

        if (!$admin) {
            $this->securityService->logSuspiciousActivity(
                0,
                'Admins',
                'login',
                'invalid_username_attempt',
                ['username' => $request["username"]]
            );

            return response()->json([
                "message" => "Bunday admin topilmadi!",
                "status" => 401
            ], 401);
        }

        if ($admin->deleted_at !== null) {
            return response()->json([
                "message" => "Bu admin o'chirilgan!",
                "status" => 403
            ], 403);
        }

        if ($admin->status === false) {
            return response()->json([
                "message" => "Bu admin faol emas!",
                "status" => 403
            ], 403);
        }

        if (Hash::check($request["password"], $admin->password)) {
            try {
                $token = Hash::make($request["username"] . $request["password"]);
                $updated = DB::table("admins")->where("id", $admin->id)->update([
                    "remember_token" => $token,
                    "updated_at" => Carbon::now()
                ]);

                if ($updated) {
                    return response()->json([
                        "message" => "Muvaffaqiyatli kirish!",
                        "remember_token" => $token,
                        "id" => $admin->id,
                        "admin" => $admin
                    ]);
                } else {
                    return response()->json([
                        "message" => "Tokenni yaratishda xatolik!",
                        "status" => 500
                    ], 500);
                }
            } catch (\Exception $e) {
                $this->securityService->logSuspiciousActivity(
                    $admin->id,
                    'Admins',
                    'login',
                    'token_creation_error',
                    ['error' => $e->getMessage(), 'username' => $request["username"]]
                );

                return response()->json([
                    "message" => "Tokenni yaratishda xatolik!",
                    "status" => 500
                ], 500);
            }
        } else {
            $this->securityService->logSuspiciousActivity(
                $admin->id,
                'Admins',
                'login',
                'invalid_password_attempt',
                ['username' => $request["username"]]
            );

            return response()->json([
                "message" => "Noto'g'ri parol!",
                "status" => 401
            ], 401);
        }
    }

    /**
     * Update admin information
     */
    public function update(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Admins',
                'update',
                'unauthorized_admin_update',
                ['requested_admin_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to update this admin",
                "status" => 403
            ], 403);
        }

        $existingAdmin = DB::table('admins')
            ->where('username', $request['username'])
            ->where('id', '!=', $id)
            ->first();

        if ($existingAdmin) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Admins',
                'update',
                'duplicate_username_update_attempt',
                ['username' => $request['username'], 'admin_id' => $id]
            );

            return response()->json([
                "message" => "Username already exists",
                "status" => 409
            ], 409);
        }

        $admin = DB::table("admins")->where("id", $id)->whereNull('deleted_at')->first();
        if (!$admin) {
            return response()->json([
                "message" => "Admin not found",
                "status" => 404
            ], 404);
        }

        $updateData = [
            "name" => $request["name"],
            "surename" => $request["surename"],
            "username" => $request["username"],
            "updated_at" => Carbon::now(),
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request["password"]);
        }

        // Only update status if provided
        if ($request->has('status')) {
            $updateData['status'] = $request["status"];
        }

        try {
            $updated = DB::table("admins")->where("id", $id)->update($updateData);

            if ($updated) {
                return response()->json([
                    "message" => "Admin updated successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Failed to update admin",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Admins',
                'update',
                'admin_update_error',
                ['error' => $e->getMessage(), 'admin_id' => $id]
            );

            return response()->json([
                "message" => "Failed to update admin",
                "status" => 500
            ], 500);
        }
    }

    /**
     * Delete admin (soft delete)
     */
    public function delete(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Admins',
                'delete',
                'unauthorized_admin_delete',
                ['requested_admin_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to delete this admin",
                "status" => 403
            ], 403);
        }

        // Prevent admin from deleting themselves
        if ($authUser->id == $id) {
            return response()->json([
                "message" => "You cannot delete your own account",
                "status" => 403
            ], 403);
        }

        try {
            $admin = DB::table("admins")->where("id", $id)->update([
                'deleted_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);

            if ($admin) {
                return response()->json([
                    "message" => "Admin deleted successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Failed to delete admin",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Admins',
                'delete',
                'admin_delete_error',
                ['error' => $e->getMessage(), 'admin_id' => $id]
            );

            return response()->json([
                "message" => "Failed to delete admin",
                "status" => 500
            ], 500);
        }
    }

    /**
     * Create admin (admin creation endpoint)
     */
    public function create(Request $request)
    {
        $authUser = $request->user();

        // Only admins can create other admins
        if (!$authUser || $authUser->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Admins',
                'create',
                'unauthorized_admin_creation',
                ['user_type' => $authUser->type ?? 'anonymous']
            );

            return response()->json([
                "message" => "Only admins can create other admins",
                "status" => 403
            ], 403);
        }

        // Use the register method logic for admin creation
        return $this->register($request);
    }

    /**
     * Change admin status (activate/deactivate)
     */
    public function changeStatus(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Admins',
                'changeStatus',
                'unauthorized_status_change',
                ['requested_admin_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to change admin status",
                "status" => 403
            ], 403);
        }

        // Prevent admin from deactivating themselves
        if ($authUser->id == $id) {
            return response()->json([
                "message" => "You cannot change your own status",
                "status" => 403
            ], 403);
        }

        $admin = DB::table("admins")->where("id", $id)->whereNull('deleted_at')->first();
        if (!$admin) {
            return response()->json([
                "message" => "Admin not found",
                "status" => 404
            ], 404);
        }

        $newStatus = $request->input('status', !$admin->status);

        try {
            $updated = DB::table("admins")->where("id", $id)->update([
                'status' => $newStatus,
                'updated_at' => Carbon::now()
            ]);

            if ($updated) {
                $statusText = $newStatus ? 'activated' : 'deactivated';
                return response()->json([
                    "message" => "Admin {$statusText} successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Failed to change admin status",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Admins',
                'changeStatus',
                'status_change_error',
                ['error' => $e->getMessage(), 'admin_id' => $id]
            );

            return response()->json([
                "message" => "Failed to change admin status",
                "status" => 500
            ], 500);
        }
    }

    /**
     * Get admin profile
     */
    public function profile(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            return response()->json([
                "message" => "Unauthorized access",
                "status" => 401
            ], 401);
        }

        $admin = DB::table("admins")->where("id", $authUser->id)->whereNull('deleted_at')->first();
        if ($admin) {
            return response()->json($admin);
        } else {
            return response()->json([
                "message" => "Admin profile not found",
                "status" => 404
            ], 404);
        }
    }

    /**
     * Logout admin
     */
    public function logout(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->type !== 'admin') {
            return response()->json([
                "message" => "Unauthorized access",
                "status" => 401
            ], 401);
        }

        try {
            DB::table("admins")->where("id", $authUser->id)->update([
                "remember_token" => null,
                "updated_at" => Carbon::now()
            ]);

            return response()->json([
                "message" => "Logged out successfully",
                "status" => 200
            ]);
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Admins',
                'logout',
                'logout_error',
                ['error' => $e->getMessage()]
            );

            return response()->json([
                "message" => "Failed to logout",
                "status" => 500
            ], 500);
        }
    }
}
