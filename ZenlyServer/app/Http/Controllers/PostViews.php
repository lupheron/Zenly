<?php

namespace App\Http\Controllers;

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

        // Securely update or create
        $existingView = DB::table('post_views')
            ->where('post_id', $post_id)
            ->first();

        if ($existingView) {
            DB::table('post_views')
                ->where('id', $existingView->id)
                ->increment('clicked');
        } else {
            DB::table('post_views')->insert([
                'post_id' => $post_id,
                'user_id' => $userId,
                'clicked' => 1
            ]);
        }

        return response()->json(['message' => 'View recorded securely']);
    }
}
