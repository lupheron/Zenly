<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class Admins extends Controller
{
    public function register(Request $request)
    {
        $user = DB::table('admins')->where('username', $request['username'])->first();
        if ($user) {
            return response()->json([
                'success' => false,
                'message' => 'User already exists',
                'status' => 400
            ], 400);
        }
        $user = DB::table('admins')->insert([
            'username' => $request['username'],
            'password' => Hash::make($request['password']),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'status' => 201
        ], 201);
    }

    public function login(Request $request)
    {
        $user = DB::table('admins')->where('username', $request['username'])->first();
        if ($user && Hash::check($request['password'], $user->password)) {
            $token = Hash::make($request['username'] . $request['password']);
            $t = DB::table('admins')->where('id', $user->id)->update(['remember_token' => $token]);
            if ($t) {
                $user->token = $token;
                return response()->json([
                    'success' => true,
                    'data' => [
                        'admin' => $user,
                        'token' => $token
                    ]
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => 'Error creating token',
                    'status' => 500
                ], 500);
            }
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
                'status' => 401
            ], 401);
        }
    }

    public function me(Request $request)
    {
        $admin = $request->user();

        if (!$admin) {
            return response()->json([
                'success' => false,
                'message' => 'Admin not found',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $admin
        ]);
    }

    public function logout(Request $request)
    {
        $admin = $request->user();

        if ($admin) {
            // Clear the remember token
            DB::table('admins')
                ->where('id', $admin->id)
                ->update(['remember_token' => null]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }
}
