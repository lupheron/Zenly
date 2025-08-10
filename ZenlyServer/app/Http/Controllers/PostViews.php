<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PostViews extends Controller
{
    public function getViews(Request $request, $post_id)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $query = DB::table("post_views")
            ->where("post_id", $post_id)
            ->select("clicked");
        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }
        $views = $query->get();
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

    public function getUserViewsForAdmin($user_id)
    {
        $views = DB::table('post_views')
            ->join('posts', 'post_views.post_id', '=', 'posts.id')
            ->join('users as viewer', 'post_views.user_id', '=', 'viewer.id')
            ->where('post_views.user_id', $user_id)
            ->select(
                'post_views.id',
                'posts.id as post_id',
                'posts.title as post_title',
                'viewer.fullname as viewer_fullname',
                'post_views.clicked',
                'post_views.created_at'
            )
            ->orderByDesc('post_views.created_at')
            ->get();

        return response()->json([
            'message' => 'User viewss fetched successfully for admin.',
            'status'  => 200,
            'data'    => $views
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
            'clicked'  => 'required|numeric|min:1|max:5',
        ]);

        DB::table('post_views')->where('id', $id)->update([
            'post_id'    => $request->post_id,
            'user_id'    => $request->user_id,
            'clicked'     => $request->clicked,
            'updated_at' => Carbon::now()
        ]);

        return response()->json([
            'status' => 200,
            'message' => 'Clicked updated successfully'
        ]);
    }


    public function destroy($id)
    {
        $view = DB::table("post_views")->where("id", $id)->delete();

        if ($view) {
            return response()->json(['message' => 'View deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'View not found'], 404);
        }
    }
}
