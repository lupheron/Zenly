<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostComments extends Controller
{
    public function index($id)
    {
        $comments = DB::table('post_comments')->where('post_id', $id)->get();
        return response()->json($comments);
    }

    public function create(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->id != $request->user_id) {
            return response()->json([
                'message' => 'You are not allowed to comment as this user',
                'status' => 403
            ], 403);
        }

        $existing = DB::table('post_comments')
            ->where('post_id', $request->post_id)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You already commented'], 409);
        }

        DB::table('post_comments')->insertOrIgnore([
            'post_id' => $request['post_id'],
            'user_id' => $request['user_id'],
            'name' => $request['name'],
            'text' => $request['text'],
        ]);

        return response()->json(['message' => 'Comment created successfully'], 201);
    }
}
