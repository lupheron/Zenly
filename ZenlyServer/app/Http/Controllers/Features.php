<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Features extends Controller
{
    public function getFeaturesByPostId($id)
    {
        $features = DB::table('features')
            ->where('post_id', $id)
            ->get();

        if ($features->isEmpty()) {
            return response()->json([
                'message' => 'No features found for this post',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'message' => 'Features fetched successfully',
            'status' => 200,
            'data' => $features
        ]);
    }
    public function create(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser || $authUser->id != $request['user_id']) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Make sure the post belongs to this user
        $post = DB::table('posts')->where('id', $request['post_id'])->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if ($post->user_id != $authUser->id) {
            return response()->json(['message' => 'You do not own this post'], 403);
        }

        $features = DB::table('features')->insertGetId([
            'user_id' => $request['user_id'],
            'post_id' => $request['post_id'],
            'name' => $request['name'],
        ]);

        if ($features) {
            return response()->json(['message' => 'Feature created successfully'], 201);
        } else {
            return response()->json(['message' => 'Failed to create feature'], 500);
        }
    }

    public function delete(Request $request, $id)
    {
        $authUser = $request->user();

        $feature = DB::table('features')->where('id', $id)->first();

        if (!$feature) {
            return response()->json(['message' => 'Feature not found'], 404);
        }

        // Check if the user owns the post this feature belongs to
        $post = DB::table('posts')->where('id', $feature->post_id)->first();

        if (!$authUser || !$post || $post->user_id != $authUser->id) {
            return response()->json(['message' => 'Unauthorized to delete this feature'], 403);
        }

        $deleted = DB::table('features')
            ->where('id', $id)
            ->delete();

        if ($deleted) {
            return response()->json(['message' => 'Feature deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Failed to delete feature'], 500);
        }
    }
}
