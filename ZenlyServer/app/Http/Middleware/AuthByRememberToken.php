<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AuthByRememberToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token yo‘q', 'status' => 401], 401);
        }

        $user = DB::table('users')->where('remember_token', $token)->first();

        if (!$user || $user->deleted_at !== null) {
            return response()->json(['message' => 'Token noto‘g‘ri yoki foydalanuvchi o‘chirilgan', 'status' => 403], 403);
        }

        $request->setUserResolver(fn() => $user);

        return $next($request);
    }
}
