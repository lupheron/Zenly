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
     * Get current admin info
     */
    public function me(Request $request)
    {
        $admin = $request->user();
        return response()->json($admin);
    }

    /**
     * Get admin by ID
     */
    public function getAdminById(Request $request, $id)
    {
        $authAdmin = $request->user();

        if (!$authAdmin || $authAdmin->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authAdmin->id ?? 0,
                'Admins',
                'getAdminById',
                'unauthorized_admin_access',
                ['requested_admin_id' => $id, 'auth_admin_id' => $authAdmin->id ?? null]
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
     * Update admin information
     */
    public function update(Request $request, $id)
    {
        $authAdmin = $request->user();

        if (!$authAdmin || $authAdmin->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authAdmin->id ?? 0,
                'Admins',
                'update',
                'unauthorized_admin_update',
                ['requested_admin_id' => $id, 'auth_admin_id' => $authAdmin->id ?? null]
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
                $authAdmin->id,
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
                $authAdmin->id,
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
}
