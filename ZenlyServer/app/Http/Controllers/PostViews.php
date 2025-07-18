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

        // Ensure only authenticated users can access this
        $authUser = $request->user();
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = $authUser->id;

        // Prevent post owners from triggering view count
        if ($userId == $post->user_id) {
            return response()->json(['message' => 'Owner view ignored']);
        }

        // Check if there's already a view record for this post (regardless of user)
        $existingView = DB::table('post_views')
            ->where('post_id', $post_id)
            ->first();

        if ($existingView) {
            // Update existing view record
            DB::table('post_views')
                ->where('post_id', $post_id)
                ->update([
                    'clicked' => $existingView->clicked + 1,
                    'user_id' => $userId, // Update to current user
                    'updated_at' => Carbon::now()
                ]);

            return response()->json([
                'message' => 'View count updated',
                'total_clicks' => $existingView->clicked + 1
            ]);
        } else {
            // First time this post is viewed
            DB::table('post_views')->insert([
                'post_id' => $post_id,
                'user_id' => $userId,
                'clicked' => 1,
                'created_at' => Carbon::now()
            ]);

            return response()->json([
                'message' => 'First view recorded for this post',
                'total_clicks' => 1
            ]);
        }
    }
}
