<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostComments extends Controller
{
    public function index($id, Request $request)
    {
        try {
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $query = DB::table('post_comments')->where('post_id', $id);

            if ($startDate) {
                $query->where('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->where('created_at', '<=', $endDate);
            }

            $comments = $query->orderBy('created_at', 'desc')->get();

            // Return in the expected format
            return response()->json([
                'message' => 'Comments fetched successfully',
                'status' => 200,
                'data' => $comments
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error fetching comments: ' . $e->getMessage(),
                'status' => 500,
                'data' => []
            ], 500);
        }
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
            'created_at' => Carbon::now()
        ]);

        return response()->json(['message' => 'Comment created successfully'], 201);
    }

    public function getUserCommentsForAdmin($user_id)
    {
        $views = DB::table('post_comments')
            ->join('posts', 'post_comments.post_id', '=', 'posts.id')
            ->join('users as viewer', 'post_comments.user_id', '=', 'viewer.id')
            ->where('post_comments.user_id', $user_id)
            ->select(
                'post_comments.id',
                'posts.id as post_id',
                'posts.title as post_title',
                'viewer.fullname as viewer_fullname',
                'post_comments.text',
                'post_comments.status',
                'post_comments.created_at'
            )
            ->orderByDesc('post_comments.created_at')
            ->get();

        return response()->json([
            'message' => 'User viewss fetched successfully for admin.',
            'status'  => 200,
            'data'    => $views
        ]);
    }
}
