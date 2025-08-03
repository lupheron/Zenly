<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\SecurityService;

class Posts extends Controller
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function index(Request $request)
    {
        $query = DB::table("posts")
            ->select(
                "posts.*",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->groupBy('posts.id');

        if ($request->has('area_id')) {
            $query->where('area_id', $request->input('area_id'));
        }
        // Date filtering
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        if ($startDate) {
            $query->where('posts.created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('posts.created_at', '<=', $endDate);
        }
        $posts = $query->get();

        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;

            $post->features = DB::table('features')->where('post_id', $post->id)->get();
            $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
                $item->img = asset($item->img);
                return $item;
            });
        }

        return response()->json([
            "message" => "Posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }

    public function getUserPosts($userId)
    {
        $query = DB::table("posts")
            ->select(
                "posts.*",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.user_id', $userId) // Filter by specific user
            ->groupBy('posts.id')
            ->orderBy('posts.created_at', 'desc');

        $posts = $query->get();

        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;

            $post->features = DB::table('features')->where('post_id', $post->id)->get();
            $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
                $item->img = asset($item->img);
                return $item;
            });
        }

        return response()->json([
            "message" => "User posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }

    public function getPostsByUserId(Request $request, $id)
    {
        $authUser = $request->user();
        if (!$authUser || $authUser->id != $id) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Posts',
                'getPostsByUserId',
                'unauthorized_user_access',
                ['requested_user_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );
            return response()->json([
                "message" => "You are not allowed to access these posts",
                "status" => 403
            ], 403);
        }
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $posts = DB::table("posts")
            ->select(
                "posts.*",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where("posts.user_id", $id)
            ->when($startDate, function ($query) use ($startDate) {
                $query->where('posts.created_at', '>=', $startDate);
            })
            ->when($endDate, function ($query) use ($endDate) {
                $query->where('posts.created_at', '<=', $endDate);
            })
            ->groupBy('posts.id')
            ->get();

        if ($posts->isEmpty()) {
            return response()->json([
                "message" => "No posts found for this user",
                "status" => 404
            ], 404);
        }

        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;

            $post->features = DB::table('features')->where('post_id', $post->id)->get();
            $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
                $item->img = asset($item->img);
                return $item;
            });
        }

        return response()->json([
            "message" => "Posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }

    public function getPostById($id, Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $query = DB::table("posts")
            ->select(
                "posts.*",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where("posts.id", $id);
        if ($startDate) {
            $query->where('posts.created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('posts.created_at', '<=', $endDate);
        }
        $post = $query->groupBy('posts.id')->first();

        if (!$post) {
            return response()->json([
                "message" => "Post not found",
                "status" => 404
            ], 404);
        }

        $post->img = $post->img ? asset($post->img) : null;

        $post->features = DB::table('features')->where('post_id', $post->id)->get();
        $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
            $item->img = asset($item->img);
            return $item;
        });

        return response()->json([
            "message" => "Post fetched successfully",
            "status" => 200,
            "data" => $post
        ]);
    }

    public function filter(Request $request)
    {
        $amenities = $request->input('amenities', []);
        $location = $request->input('location');
        $sort = $request->input('sort');
        $guests = $request->input('guests');
        $areaId = $request->input('area_id');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $query = DB::table('posts')
            ->select(
                'posts.*',
                DB::raw('AVG(rating.rating) as avg_rating'),
                DB::raw('COUNT(DISTINCT post_comments.id) as comment_count'),
                DB::raw('COUNT(DISTINCT post_views.id) as view_count')
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->leftJoin('features', 'posts.id', '=', 'features.post_id')
            ->where('posts.status', 1)
            ->groupBy('posts.id');
        if ($areaId) {
            $query->where('posts.area_id', $areaId);
        }
        if ($location) {
            $query->where('posts.location', 'LIKE', '%' . $location . '%');
        }
        if (!empty($amenities)) {
            $query->whereIn('features.name', $amenities)
                ->havingRaw('COUNT(features.id) = ?', [count($amenities)]);
        }
        if ($guests && is_numeric($guests)) {
            $query->where('posts.members', '>=', (int)$guests);
        }
        if ($startDate) {
            $query->where('posts.created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('posts.created_at', '<=', $endDate);
        }
        if ($sort) {
            switch ($sort) {
                case 'rating':
                    $query->orderByDesc('avg_rating');
                    break;
                case 'price_low':
                    $query->orderBy('posts.price_daily', 'asc');
                    break;
                case 'price_high':
                    $query->orderBy('posts.price_daily', 'desc');
                    break;
                case 'recent':
                    $query->orderByDesc('posts.created_at');
                    break;
                case 'popular':
                    $query->orderByDesc('view_count');
                    break;
                default:
                    $query->orderByDesc('posts.created_at');
                    break;
            }
        }
        $posts = $query->get();

        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;
            $post->features = DB::table('features')->where('post_id', $post->id)->get();
            $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
                $item->img = asset($item->img);
                return $item;
            });
        }

        return response()->json([
            "message" => "Filtered posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }

    public function create(Request $request)
    {
        $authUser = $request->user();
        if (!$authUser || $authUser->id != $request->input('user_id')) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Posts',
                'create',
                'unauthorized_post_create',
                ['requested_user_id' => $request->input('user_id'), 'auth_user_id' => $authUser->id ?? null]
            );
            return response()->json([
                'message' => 'You are not allowed to create a post for another user',
                'status' => 403
            ], 403);
        }

        $user = DB::table('users')->where('id', $request->input('user_id'))->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $imgPath = null;
        if ($request->has('img') && $request->input('img')) {
            $base64Image = $request->input('img');
            $username = $user->username;
            $uploadPath = public_path('uploads/' . $username);

            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $filename = $username . '_' . time() . '_' . uniqid() . '_post.jpg';
            $filePath = 'uploads/' . $username . '/' . $filename;

            $imageData = base64_decode($base64Image);
            file_put_contents(public_path($filePath), $imageData);
            $imgPath = $filePath;
        }

        $postId = DB::table("posts")->insertGetId([
            "area_id" => $request["area_id"],
            "title" => $request->input('title'),
            "description" => $request->input('description'),
            "small_description" => $request->input('small_description'),
            "location" => $request->input('location'),
            "members" => $request->input('members'),
            "price_daily" => $request->input('price_daily'),
            "user_id" => $user->id,
            "img" => $imgPath,
            "created_at" => Carbon::now()
        ]);

        return response()->json([
            "message" => "Post created successfully",
            "status" => 201,
            "post_id" => $postId
        ]);
    }

    public function update(Request $request, $post_id)
    {
        $authUser = $request->user();

        $post = DB::table('posts')->where('id', $post_id)->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if (!$authUser || $authUser->id != $post->user_id) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Posts',
                'update',
                'unauthorized_post_update',
                ['requested_post_id' => $post_id, 'auth_user_id' => $authUser->id ?? null]
            );
            return response()->json([
                "message" => "You are not allowed to update this post",
                "status" => 403
            ], 403);
        }

        $user = DB::table('users')->where('id', $post->user_id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $imgPath = $post->img;

        if ($request->has('img') && $request->input('img')) {
            $base64Image = $request->input('img');

            if ($imgPath && file_exists(public_path($imgPath))) {
                unlink(public_path($imgPath));
            }

            $username = $user->username;
            $uploadPath = public_path('uploads/' . $username);

            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            $filename = $username . '_' . time() . '_' . uniqid() . '_post.jpg';
            $filePath = 'uploads/' . $username . '/' . $filename;

            $imageData = base64_decode($base64Image);
            file_put_contents(public_path($filePath), $imageData);
            $imgPath = $filePath;
        }

        $updated = DB::table("posts")
            ->where("id", $post_id)
            ->update([
                "area_id" => $request["area_id"],
                "title" => $request->input('title'),
                "description" => $request->input('description'),
                "small_description" => $request->input('small_description'),
                "location" => $request->input('location'),
                "members" => $request->input('members'),
                "price_daily" => $request->input('price_daily'),
                "img" => $imgPath,
                "updated_at" => Carbon::now()
            ]);

        if ($updated) {
            return response()->json(["message" => "Post updated successfully", "status" => 200]);
        } else {
            return response()->json(["message" => "Post update failed or no changes made", "status" => 500]);
        }
    }

    public function delete(Request $request, $id)
    {
        $authUser = $request->user();

        $post = DB::table("posts")->where("id", $id)->first();

        if (!$post) {
            return response()->json([
                "message" => "Post not found",
                "status" => 404
            ]);
        }

        if (!$authUser || $authUser->id != $post->user_id) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id ?? 0,
                'Posts',
                'delete',
                'unauthorized_post_delete',
                ['requested_post_id' => $id, 'auth_user_id' => $authUser->id ?? null]
            );
            return response()->json([
                "message" => "You are not allowed to delete this post",
                "status" => 403
            ], 403);
        }

        DB::transaction(function () use ($id, $post) {
            DB::table("rating")->where("post_id", $id)->delete();
            DB::table("gallery")->where("post_id", $id)->delete();
            DB::table("features")->where("post_id", $id)->delete();
            DB::table("post_comments")->where("post_id", $id)->delete();
            DB::table("post_views")->where("post_id", $id)->delete();

            if ($post->img && file_exists(public_path($post->img))) {
                unlink(public_path($post->img));
            }

            DB::table("posts")->where("id", $id)->delete();
        });

        return response()->json([
            "message" => "Post deleted successfully",
            "status" => 200
        ]);
    }

    /**
     * Get top 10 posts by average rating, refreshed every 2 days.
     */
    public function topRated(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $query = DB::table('posts')
            ->select(
                'posts.*',
                DB::raw('AVG(rating.rating) as avg_rating'),
                DB::raw('COUNT(DISTINCT post_comments.id) as comment_count'),
                DB::raw('COUNT(DISTINCT post_views.id) as view_count')
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->groupBy('posts.id');
        if ($startDate) {
            $query->where('posts.created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('posts.created_at', '<=', $endDate);
        }
        $posts = $query->orderByDesc('avg_rating')->limit(10)->get();

        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;
            $post->features = DB::table('features')->where('post_id', $post->id)->get();
            $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
                $item->img = asset($item->img);
                return $item;
            });
        }

        return response()->json([
            'message' => 'Top rated posts fetched successfully',
            'status' => 200,
            'data' => $posts
        ]);
    }
}
