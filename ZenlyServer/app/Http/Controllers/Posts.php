<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\SecurityService;
use Exception;

class Posts extends Controller
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    public function index(Request $request)
    {
        // Update expired bookings before fetching posts
        $this->updateExpiredBookings();
        
        $query = DB::table("posts")
            ->select(
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "posts.updated_at",
                "posts.deleted_at",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.status', 1) // Only show available posts (status = 1)
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.latitude', 'posts.longitude', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at');

        if ($request->has('area_id')) {
            $query->where('area_id', $request->input('area_id'));
        }

        // Coordinate filtering for map functionality
        if ($request->has('bounds')) {
            $bounds = $request->input('bounds');
            if (is_array($bounds) && isset($bounds['north'], $bounds['south'], $bounds['east'], $bounds['west'])) {
                $query->whereNotNull('posts.latitude')
                      ->whereNotNull('posts.longitude')
                      ->whereBetween('posts.latitude', [$bounds['south'], $bounds['north']])
                      ->whereBetween('posts.longitude', [$bounds['west'], $bounds['east']]);
            }
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

    public function getAllPosts()
    {
        $posts = DB::table("posts")
            ->select(
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "posts.updated_at",
                "posts.deleted_at",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at')
            ->orderBy('posts.created_at', 'desc')
            ->get();

        foreach ($posts as $post) {
            // Full image URL
            $post->img = $post->img ? asset($post->img) : null;

            // Add features
            $post->features = DB::table('features')
                ->where('post_id', $post->id)
                ->get();

            // Add gallery with full image URLs
            $post->gallery = DB::table('gallery')
                ->where('post_id', $post->id)
                ->get()
                ->map(function ($item) {
                    $item->img = asset($item->img);
                    return $item;
                });
        }

        return response()->json([
            "message" => "All posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }


    public function getUserPosts($userId)
    {
        $query = DB::table("posts")
            ->select(
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "posts.updated_at",
                "posts.deleted_at",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.user_id', $userId) // Filter by specific user
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at')
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

    public function getthefuck($id)
    {
        $post = DB::table("posts")
            ->select(
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "posts.updated_at",
                "posts.deleted_at",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.id', $id)
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at')
            ->first();

        if (!$post) {
            return response()->json([
                'message' => 'Post not found',
                'status' => 404,
                'data' => null
            ]);
        }

        // 🟢 Add features
        $post->features = DB::table('features')->where('post_id', $post->id)->get();

        // 🟢 Add gallery
        $post->gallery = DB::table('gallery')->where('post_id', $post->id)->get()->map(function ($item) {
            $item->img = asset($item->img); // format to full URL
            return $item;
        });

        // 🟢 Add comments
        $post->comments = DB::table('post_comments')
            ->where('post_id', $post->id)
            ->get();

        return response()->json([
            'message' => 'Post fetched successfully',
            'status' => 200,
            'data' => $post
        ]);
    }

    public function destroy($postId)
    {
        try {
            $post = DB::table('posts')->where('id', $postId)->first();

            if (!$post) {
                return response()->json([
                    "message" => "Post not found",
                    "status" => 404
                ], 404);
            }

            // Delete related data first
            DB::table('rating')->where('post_id', $postId)->delete();
            DB::table('post_comments')->where('post_id', $postId)->delete();
            DB::table('post_views')->where('post_id', $postId)->delete();
            DB::table('features')->where('post_id', $postId)->delete();
            DB::table('gallery')->where('post_id', $postId)->delete();

            // Delete the post
            DB::table('posts')->where('id', $postId)->delete();

            return response()->json([
                "message" => "Post deleted successfully",
                "status" => 200
            ]);
        } catch (Exception $e) {
            return response()->json([
                "message" => "Error deleting post: " . $e->getMessage(),
                "status" => 500
            ], 500);
        }
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
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "posts.updated_at",
                "posts.deleted_at",
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
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at')
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
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "posts.updated_at",
                "posts.deleted_at",
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
        $post = $query->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at')->first();

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
                'posts.id',
                'posts.user_id',
                'posts.area_id',
                'posts.title',
                'posts.small_description',
                'posts.description',
                'posts.location',
                'posts.members',
                'posts.price_daily',
                'posts.img',
                'posts.status',
                'posts.created_at',
                'posts.updated_at',
                'posts.deleted_at',
                DB::raw('AVG(rating.rating) as avg_rating'),
                DB::raw('COUNT(DISTINCT post_comments.id) as comment_count'),
                DB::raw('COUNT(DISTINCT post_views.id) as view_count')
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->leftJoin('features', 'posts.id', '=', 'features.post_id')
            ->where('posts.status', 1) // Only show available posts (status = 1)
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.latitude', 'posts.longitude', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at');
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
            "latitude" => $request->input('latitude') ? (float)$request->input('latitude') : null,
            "longitude" => $request->input('longitude') ? (float)$request->input('longitude') : null,
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
                "latitude" => $request->input('latitude') ? (float)$request->input('latitude') : null,
                "longitude" => $request->input('longitude') ? (float)$request->input('longitude') : null,
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
                'posts.id',
                'posts.user_id',
                'posts.area_id',
                'posts.title',
                'posts.small_description',
                'posts.description',
                'posts.location',
                'posts.members',
                'posts.price_daily',
                'posts.img',
                'posts.status',
                'posts.created_at',
                'posts.updated_at',
                'posts.deleted_at',
                DB::raw('AVG(rating.rating) as avg_rating'),
                DB::raw('COUNT(DISTINCT post_comments.id) as comment_count'),
                DB::raw('COUNT(DISTINCT post_views.id) as view_count')
            )
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.status', 1) // Only show available posts (status = 1)
            ->groupBy('posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 'posts.small_description', 'posts.description', 'posts.location', 'posts.latitude', 'posts.longitude', 'posts.members', 'posts.price_daily', 'posts.img', 'posts.status', 'posts.created_at', 'posts.updated_at', 'posts.deleted_at');
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

    /**
     * Admin method to update post without security checks
     */
    public function adminUpdate(Request $request, $postId)
    {
        try {
            $post = DB::table('posts')->where('id', $postId)->first();

            if (!$post) {
                return response()->json([
                    'message' => 'Post not found',
                    'status' => 404
                ], 404);
            }

            $updateData = [
                'title' => $request->input('title'),
                'small_description' => $request->input('small_description'),
                'description' => $request->input('description'),
                'location' => $request->input('location'),
                'members' => $request->input('members'),
                'price_daily' => $request->input('price_daily'),
                'area_id' => $request->input('area_id'),
                'status' => $request->input('status'),
                'updated_at' => Carbon::now()
            ];

            // Handle main image update if provided
            if ($request->has('img') && $request->input('img')) {
                $base64Image = $request->input('img');
                
                // Get username from the post's user_id
                $user = DB::table('users')->where('id', $post->user_id)->first();
                if ($user) {
                    $username = $user->username;
                    $uploadPath = public_path('uploads/' . $username);

                    if (!file_exists($uploadPath)) {
                        mkdir($uploadPath, 0777, true);
                    }

                    // Delete old image if exists
                    if ($post->img && file_exists(public_path($post->img))) {
                        unlink(public_path($post->img));
                    }

                    $filename = $username . '_' . time() . '_' . uniqid() . '_post.jpg';
                    $filePath = 'uploads/' . $username . '/' . $filename;

                    $imageData = base64_decode($base64Image);
                    file_put_contents(public_path($filePath), $imageData);
                    $updateData['img'] = $filePath;
                }
            }

            $updated = DB::table('posts')
                ->where('id', $postId)
                ->update($updateData);

            if ($updated) {
                return response()->json([
                    'message' => 'Post updated successfully',
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'message' => 'Post update failed or no changes made',
                    'status' => 500
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error updating post: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    /**
     * Update expired bookings and reactivate posts
     */
    private function updateExpiredBookings()
    {
        $now = Carbon::now();
        // Get all booking_checking where end_date < now and status is active
        $expired = DB::table('booking_checking')
            ->where('end_date', '<', $now)
            ->where('status', 'active')
            ->get();
        foreach ($expired as $check) {
            // Set book_status=0 for the related booking_request
            DB::table('booking_requests')
                ->where('id', $check->request_id)
                ->where('book_status', '!=', 0)
                ->update(['book_status' => 0]);
            // Set the related post status to 1 (available)
            DB::table('posts')->where('id', $check->post_id)->update(['status' => 1]);
            // Update booking checking status to expired
            DB::table('booking_checking')
                ->where('id', $check->id)
                ->update(['status' => 'expired']);
        }
    }
}
