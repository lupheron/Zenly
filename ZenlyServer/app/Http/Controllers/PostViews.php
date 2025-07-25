<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostViews extends Controller
{
    public function getViews(Request $request, $post_id)
    {
        $views = DB::table("post_views")
            ->where("post_id", $post_id)
            ->select("clicked")
            ->get();

        return response()->json([
            "message" => "Post views fetched successfully",
            "status" => 200,
            "data" => $views
        ]);
    }

    public function increaseInterest(Request $request, $post_id)
    {
        $post = DB::table('posts')->where('id', $post_id)->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $authUser = $request->user();
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = $authUser->id;

        // Prevent post owners from triggering view count
        if ($userId == $post->user_id) {
            return response()->json(['message' => 'Owner view ignored']);
        }

        // Check if this user has already viewed this post
        $existingView = DB::table('post_views')
            ->where('post_id', $post_id)
            ->where('user_id', $userId)
            ->first();

        if ($existingView) {
            // User has already viewed this post, do not increment
            return response()->json([
                'message' => 'User has already viewed this post',
                'total_clicks' => DB::table('post_views')->where('post_id', $post_id)->count()
            ]);
        } else {
            // First time this user views this post
            DB::table('post_views')->insert([
                'post_id' => $post_id,
                'user_id' => $userId,
                'clicked' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);

            return response()->json([
                'message' => 'First view recorded for this user and post',
                'total_clicks' => DB::table('post_views')->where('post_id', $post_id)->count()
            ]);
        }
    }
}
