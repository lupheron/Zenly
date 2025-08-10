<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Rating extends Controller
{
    public function getUserAverageRating($postId, Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $query = DB::table('rating')
            ->where('post_id', $postId);
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
        $avg = $query->avg('rating');
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

    public function getUserRatingsForAdmin($user_id)
    {
        $ratings = DB::table('rating')
            ->join('posts', 'rating.post_id', '=', 'posts.id')
            ->join('users as raters', 'rating.user_id', '=', 'raters.id')
            ->where('rating.user_id', $user_id)
            ->select(
                'rating.id',
                'posts.id as post_id',
                'posts.title as post_title',
                'raters.fullname as rater_fullname',
                'rating.rating',
                'rating.created_at'
            )
            ->orderByDesc('rating.created_at')
            ->get();

        return response()->json([
            'message' => 'User ratings fetched successfully for admin.',
            'status'  => 200,
            'data'    => $ratings
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
            'rating'  => 'required|numeric|min:1|max:5',
        ]);

        DB::table('rating')->where('id', $id)->update([
            'post_id'    => $request->post_id,
            'user_id'    => $request->user_id,
            'rating'     => $request->rating,
            'updated_at' => Carbon::now()
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Rating updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $rating = DB::table("rating")->where("id", $id)->delete();

        if ($rating) {
            return response()->json(['message' => 'Rating deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Rating not found'], 404);
        }
    }
}
