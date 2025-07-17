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
    public function create(Request $request)
    {
        $rating = DB::table("rating")->insertGetId([
            "post_id" => $request["post_id"],
            "user_id" => $request["user_id"],
            "rating" => $request["rating"],
        ]);
        return response()->json(['message' => 'Rating created successfully'], 201);
    }
}
