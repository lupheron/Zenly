<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;


class Admins extends Controller
{
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
}
