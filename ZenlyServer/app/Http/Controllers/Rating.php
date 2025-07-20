<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Rating extends Controller
{
    public function getUserAverageRating($postId)
    {
        $avg = DB::table('rating')
            ->where('post_id', $postId)
            ->avg('rating');

        return response()->json([
            'post_id' => $postId,
            'average_rating' => round($avg ?? 0, 1),
        ]);
    }

    public function checkUserRating(Request $request, $postId)
    {
        $authUser = $request->user();
        
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userRating = DB::table('rating')
            ->where('post_id', $postId)
            ->where('user_id', $authUser->id)
            ->first();

        return response()->json([
            'has_rated' => !is_null($userRating),
            'user_rating' => $userRating ? $userRating->rating : null,
        ]);
    }

    public function create(Request $request)
    {
        $authUser = $request->user();
        
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if user has already rated this post
        $existingRating = DB::table('rating')
            ->where('post_id', $request['post_id'])
            ->where('user_id', $authUser->id)
            ->first();

        if ($existingRating) {
            return response()->json(['message' => 'You have already rated this post'], 409);
        }

        // Check if user is trying to rate their own post
        $post = DB::table('posts')
            ->where('id', $request['post_id'])
            ->first();

        if ($post && $post->user_id == $authUser->id) {
            return response()->json(['message' => 'You cannot rate your own post'], 403);
        }

        $rating = DB::table("rating")->insertGetId([
            "post_id" => $request["post_id"],
            "user_id" => $authUser->id,
            "rating" => $request["rating"],
        ]);
        
        return response()->json(['message' => 'Rating created successfully'], 201);
    }
}
