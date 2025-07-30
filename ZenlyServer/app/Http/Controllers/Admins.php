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
        $username = $request->input('username');
        $password = $request->input('password');

        // Simple DB check (no hashing, no security, for demo only!)
        $admin = DB::table('admins')->where('username', $username)->first();
        if ($admin && $admin->password === $password) {
            return response()->json(['success' => true, 'message' => 'Login successful', 'admin' => $admin]);
        } else {
            return response()->json(['success' => false, 'message' => 'Invalid credentials'], 401);
        }
    }
}
