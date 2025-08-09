<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Services\SecurityService;

class Users extends Controller
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function getUsersById(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->id != $id) {
            // Log unauthorized user access attempt
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Users',
                'getUsersById',
                'unauthorized_user_access',
                ['requested_user_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to access this user",
                "status" => 403
            ], 403);
        }

        $user = DB::table("users")->where("id", $id)->first();
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([
                "message" => "User not found",
                "status" => 404
            ], 404);
        }
    }

    public function register(Request $request)
    {
        $existingUser = DB::table('users')->where('username', $request['username'])->first();

        if ($existingUser) {
            $this->securityService->logSuspiciousActivity(
                0,
                'Users',
                'register',
                'duplicate_username_attempt',
                ['username' => $request['username']]
            );

            return response()->json([
                "message" => "Username already exists",
                "status" => 409
            ], 409);
        }

        $imgPath = null;

        if ($request->hasFile('img')) {
            try {
                $username = $request['username'];
                $uploadPath = public_path('uploads/' . $username);

                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                $file = $request->file('img');
                $filename = $username . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($uploadPath, $filename);
                $imgPath = 'uploads/' . $username . '/' . $filename;
            } catch (\Exception $e) {
                $this->securityService->logSuspiciousActivity(
                    0,
                    'Users',
                    'register',
                    'image_upload_error',
                    ['error' => $e->getMessage(), 'username' => $request['username']]
                );
                // Continue without image
            }
        } else {
            $imgPath = $request["img"] ?? null;
        }

        try {
            $users = DB::table('users')->insertOrIgnore([
                "fullname" => $request["fullname"],
                "username" => $request["username"],
                "img" => $imgPath,
                "phone" => $request["phone"],
                "address" => $request["address"],
                "vip_status" => $request["vip_status"],
                "password" => Hash::make($request["password"]),
                "type" => $request["type"],
                "created_at" => Carbon::now(),
            ]);

            if ($users) {
                return response()->json([
                    "message" => "User registered successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Registration failed or user already exists",
                    "status" => 500
                ]);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                0,
                'Users',
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

    public function login(Request $request)
    {
        $user = DB::table("users")->where("username", $request["username"])->first();

        if (!$user) {
            $this->securityService->logSuspiciousActivity(
                0,
                'Users',
                'login',
                'invalid_username_attempt',
                ['username' => $request["username"]]
            );

            return response()->json([
                "message" => "Bunday foydalanuvchi topilmadi!",
                "status" => 401
            ], 401);
        }

        if ($user->deleted_at !== null) {
            return response()->json([
                "message" => "Bu foydalanuvchi o'chirilgan!",
                "status" => 403
            ], 403);
        }

        if (Hash::check($request["password"], $user->password)) {
            try {
                $token = Hash::make($request["username"] . $request["password"]);
                $updated = DB::table("users")->where("id", $user->id)->update([
                    "remember_token" => $token
                ]);

                if ($updated) {
                    return response()->json([
                        "message" => "Muvaffaqiyatli kirish!",
                        "remember_token" => $token,
                        "id" => $user->id,
                        "user" => $user
                    ]);
                } else {
                    return response()->json([
                        "message" => "Tokenni yaratishda xatolik!",
                        "status" => 500
                    ], 500);
                }
            } catch (\Exception $e) {
                $this->securityService->logSuspiciousActivity(
                    $user->id,
                    'Users',
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
                $user->id,
                'Users',
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

    public function update(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->id != $id) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Users',
                'update',
                'unauthorized_user_update',
                ['requested_user_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to update this user",
                "status" => 403
            ], 403);
        }

        $existingUser = DB::table('users')
            ->where('username', $request['username'])
            ->where('id', '!=', $id)
            ->first();

        if ($existingUser) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Users',
                'update',
                'duplicate_username_update_attempt',
                ['username' => $request['username'], 'user_id' => $id]
            );

            return response()->json([
                "message" => "Username already exists",
                "status" => 409
            ], 409);
        }

        $user = DB::table("users")->where("id", $id)->first();
        if (!$user) {
            return response()->json([
                "message" => "User not found",
                "status" => 404
            ], 404);
        }

        $imgPath = $user->img;

        if ($request->hasFile('img')) {
            try {
                $username = $request["username"] ?? $user->username;
                $uploadPath = public_path('uploads/' . $username);

                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                if ($imgPath && file_exists(public_path($imgPath))) {
                    unlink(public_path($imgPath));
                }

                $file = $request->file('img');
                $filename = $username . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($uploadPath, $filename);
                $imgPath = 'uploads/' . $username . '/' . $filename;
            } catch (\Exception $e) {
                $this->securityService->logSuspiciousActivity(
                    $authUser->id,
                    'Users',
                    'update',
                    'image_upload_error',
                    ['error' => $e->getMessage(), 'user_id' => $id]
                );
                // Continue with existing image
            }
        } else if ($request->filled('img')) {
            $imgPath = $request["img"];
        }

        try {
            $updated = DB::table("users")->where("id", $id)->update([
                "fullname" => $request["fullname"],
                "username" => $request["username"],
                "img" => $imgPath,
                "phone" => $request["phone"],
                "address" => $request["address"],
                "updated_at" => Carbon::now(),
            ]);

            if ($updated) {
                return response()->json([
                    "message" => "User updated successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Failed to update user",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Users',
                'update',
                'user_update_error',
                ['error' => $e->getMessage(), 'user_id' => $id]
            );

            return response()->json([
                "message" => "Failed to update user",
                "status" => 500
            ], 500);
        }
    }

    public function delete(Request $request, $id)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->id != $id) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Users',
                'delete',
                'unauthorized_user_delete',
                ['requested_user_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );

            return response()->json([
                "message" => "You are not allowed to delete this user",
                "status" => 403
            ], 403);
        }

        try {
            DB::table("posts")->where("user_id", $id)->delete();
            DB::table("rating")->where("user_id", $id)->delete();
            DB::table("gallery")->where("user_id", $id)->delete();
            DB::table("features")->where("user_id", $id)->delete();
            DB::table("post_comments")->where("user_id", $id)->delete();

            $user = DB::table("users")->where("id", $id)->update([
                'deleted_at' => Carbon::now()
            ]);

            if ($user) {
                return response()->json([
                    "message" => "User deleted successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Failed to delete user",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Users',
                'delete',
                'user_delete_error',
                ['error' => $e->getMessage(), 'user_id' => $id]
            );

            return response()->json([
                "message" => "Failed to delete user",
                "status" => 500
            ], 500);
        }
    }

    public function create(Request $request)
    {
        $authUser = $request->user();

        // Only admins can create users via this endpoint
        if (!$authUser || $authUser->type !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Users',
                'create',
                'unauthorized_user_creation',
                ['user_type' => $authUser->type ?? 'anonymous']
            );

            return response()->json([
                "message" => "Only admins can create users",
                "status" => 403
            ], 403);
        }

        // Use the register method logic for admin user creation
        return $this->register($request);
    }

    // ADMIN SIDE

    public function index()
    {
        $users = DB::table("users")->get();
        return response()->json([
            "success" => true,
            "data" => $users
        ]);
    }

    public function getUserByIdAdmin($id)
    {
        $user = DB::table("users")->where("id", $id)->first();
        return response()->json([
            "success" => true,
            "data" => $user
        ]);
    }

    public function updateUserAdmin(Request $request, $id)
    {
        try {
            // Get existing user
            $currentUser = DB::table("users")->where("id", $id)->first();
            if (!$currentUser) {
                return response()->json([
                    "message" => "User not found",
                    "status" => 404
                ], 404);
            }

            // Validate only provided fields
            $rules = [
                'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
                'fullname' => 'sometimes|string|max:255',
                'phone'    => 'sometimes|string|max:50',
                'address'  => 'sometimes|string|max:255',
                'vip_status' => 'sometimes|string|max:50',
                'type'     => 'sometimes|integer|in:0,1',
                'img'      => 'sometimes|file|image|max:2048'
            ];
            $request->validate($rules);

            $updateData = ['updated_at' => now()];

            // Only update fields that were sent in the request
            foreach (['fullname', 'username', 'phone', 'address', 'vip_status', 'type'] as $field) {
                if ($request->filled($field)) {
                    $updateData[$field] = $request->$field;
                }
            }

            // Handle image upload if provided
            if ($request->hasFile('img')) {
                $usernameForFolder = $request->input('username', $currentUser->username);
                $uploadPath = public_path('uploads/' . $usernameForFolder);

                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Delete old image
                if ($currentUser->img && file_exists(public_path($currentUser->img))) {
                    unlink(public_path($currentUser->img));
                }

                $file = $request->file('img');
                $filename = $usernameForFolder . '_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $file->move($uploadPath, $filename);
                $updateData['img'] = 'uploads/' . $usernameForFolder . '/' . $filename;
            }

            // Apply updates
            DB::table("users")->where("id", $id)->update($updateData);

            // Fetch updated user
            $updatedUser = DB::table("users")->where("id", $id)->first();

            return response()->json([
                "message" => "User updated successfully",
                "status" => 200,
                "data" => $updatedUser
            ]);
        } catch (\Exception $e) {
            Log::error('User update failed: ' . $e->getMessage());
            return response()->json([
                "message" => "Failed to update user",
                "status" => 500,
                "error" => $e->getMessage()
            ], 500);
        }
    }

    public function deleteUserAdmin($id)
    {
        try {
            // Check if user exists
            $user = DB::table("users")->where("id", $id)->first();
            if (!$user) {
                return response()->json([
                    "message" => "User not found",
                    "status" => 404
                ], 404);
            }

            // Soft delete related data
            DB::table("posts")->where("user_id", $id)->update(['deleted_at' => Carbon::now()]);
            DB::table("rating")->where("user_id", $id)->update(['deleted_at' => Carbon::now()]);
            DB::table("gallery")->where("user_id", $id)->update(['deleted_at' => Carbon::now()]);
            DB::table("features")->where("user_id", $id)->update(['deleted_at' => Carbon::now()]);
            DB::table("post_comments")->where("user_id", $id)->update(['deleted_at' => Carbon::now()]);

            // Soft delete the user
            $deleted = DB::table("users")->where("id", $id)->update([
                'deleted_at' => Carbon::now()
            ]);

            if ($deleted) {
                return response()->json([
                    "message" => "User deleted successfully",
                    "status" => 200
                ]);
            } else {
                return response()->json([
                    "message" => "Failed to delete user",
                    "status" => 500
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('User deletion failed: ' . $e->getMessage());
            return response()->json([
                "message" => "Failed to delete user: " . $e->getMessage(),
                "status" => 500
            ], 500);
        }
    }
}
