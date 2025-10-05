<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MapController extends Controller
{
    /**
     * Get posts for map display with coordinates and filtering
     */
    public function getMapPosts(Request $request)
    {
        $query = DB::table("posts")
            ->select(
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "area_types.name as area_type_name",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('area_types', 'area_types.id', '=', 'posts.area_id')
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.status', 1)
            ->groupBy(
                'posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 
                'posts.small_description', 'posts.location', 'posts.latitude', 
                'posts.longitude', 'posts.members', 'posts.price_daily', 
                'posts.img', 'posts.status', 'posts.created_at', 'area_types.name'
            );

        // Filter by area type (service type)
        if ($request->has('area_id') && $request->area_id) {
            $query->where('posts.area_id', $request->area_id);
        }

        // Filter by region (location) - flexible matching
        if ($request->has('region') && $request->region) {
            $region = $request->region;
            
            // Map region names to flexible search patterns
            $regionPatterns = [
                'Toshkent viloyati' => ['Tashkent', 'Toshkent'],
                'Toshkent shahri' => ['Tashkent', 'Toshkent'],
                'Samarqand' => ['Samarkand', 'Samarqand'],
                'Buxoro' => ['Bukhara', 'Buxoro'],
                'Fargʻona' => ['Fergana', 'Fargʻona'],
                'Andijon' => ['Andijan', 'Andijon'],
                'Namangan' => ['Namangan'],
                'Jizzax' => ['Jizzakh', 'Jizzax'],
                'Xorazm' => ['Khorezm', 'Xorazm'],
                'Navoiy' => ['Navoi', 'Navoiy'],
                'Qashqadaryo' => ['Kashkadarya', 'Qashqadaryo'],
                'Qoraqalpogʻiston' => ['Karakalpakstan', 'Qoraqalpogʻiston'],
                'Sirdaryo' => ['Syrdarya', 'Sirdaryo'],
                'Surxondaryo' => ['Surkhandarya', 'Surxondaryo']
            ];
            
            if (isset($regionPatterns[$region])) {
                $patterns = $regionPatterns[$region];
                $query->where(function($q) use ($patterns) {
                    foreach ($patterns as $pattern) {
                        $q->orWhere('posts.location', 'LIKE', '%' . $pattern . '%');
                    }
                });
            } else {
                $query->where('posts.location', $region);
            }
        }

        // Filter by coordinates (for map bounds) - only if coordinates exist
        if ($request->has('bounds')) {
            $bounds = $request->bounds;
            if (isset($bounds['north']) && isset($bounds['south']) && 
                isset($bounds['east']) && isset($bounds['west'])) {
                $query->whereNotNull('posts.latitude')
                      ->whereNotNull('posts.longitude')
                      ->whereBetween('posts.latitude', [$bounds['south'], $bounds['north']])
                      ->whereBetween('posts.longitude', [$bounds['west'], $bounds['east']]);
            }
        }

        $posts = $query->orderBy('posts.created_at', 'desc')->get();

        // Process posts data
        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;
            $post->avg_rating = round($post->avg_rating, 1);
        }

        return response()->json([
            "message" => "Map posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }

    /**
     * Get posts by region for the sidebar
     */
    public function getPostsByRegion(Request $request)
    {
        $query = DB::table("posts")
            ->select(
                "posts.id",
                "posts.user_id",
                "posts.area_id",
                "posts.title",
                "posts.small_description",
                "posts.location",
                "posts.latitude",
                "posts.longitude",
                "posts.members",
                "posts.price_daily",
                "posts.img",
                "posts.status",
                "posts.created_at",
                "area_types.name as area_type_name",
                DB::raw("AVG(rating.rating) as avg_rating"),
                DB::raw("COUNT(DISTINCT post_comments.id) as comment_count"),
                DB::raw("COUNT(DISTINCT post_views.id) as view_count")
            )
            ->leftJoin('area_types', 'area_types.id', '=', 'posts.area_id')
            ->leftJoin('rating', 'rating.post_id', '=', 'posts.id')
            ->leftJoin('post_comments', 'post_comments.post_id', '=', 'posts.id')
            ->leftJoin('post_views', 'post_views.post_id', '=', 'posts.id')
            ->where('posts.status', 1)
            ->groupBy(
                'posts.id', 'posts.user_id', 'posts.area_id', 'posts.title', 
                'posts.small_description', 'posts.location', 'posts.latitude', 
                'posts.longitude', 'posts.members', 'posts.price_daily', 
                'posts.img', 'posts.status', 'posts.created_at', 'area_types.name'
            );

        // Filter by area type (service type)
        if ($request->has('area_id') && $request->area_id) {
            $query->where('posts.area_id', $request->area_id);
        }

        // Filter by region (location) - flexible matching
        if ($request->has('region') && $request->region) {
            $region = $request->region;
            
            // Map region names to flexible search patterns
            $regionPatterns = [
                'Toshkent viloyati' => ['Tashkent', 'Toshkent'],
                'Toshkent shahri' => ['Tashkent', 'Toshkent'],
                'Samarqand' => ['Samarkand', 'Samarqand'],
                'Buxoro' => ['Bukhara', 'Buxoro'],
                'Fargʻona' => ['Fergana', 'Fargʻona'],
                'Andijon' => ['Andijan', 'Andijon'],
                'Namangan' => ['Namangan'],
                'Jizzax' => ['Jizzakh', 'Jizzax'],
                'Xorazm' => ['Khorezm', 'Xorazm'],
                'Navoiy' => ['Navoi', 'Navoiy'],
                'Qashqadaryo' => ['Kashkadarya', 'Qashqadaryo'],
                'Qoraqalpogʻiston' => ['Karakalpakstan', 'Qoraqalpogʻiston'],
                'Sirdaryo' => ['Syrdarya', 'Sirdaryo'],
                'Surxondaryo' => ['Surkhandarya', 'Surxondaryo']
            ];
            
            if (isset($regionPatterns[$region])) {
                $patterns = $regionPatterns[$region];
                $query->where(function($q) use ($patterns) {
                    foreach ($patterns as $pattern) {
                        $q->orWhere('posts.location', 'LIKE', '%' . $pattern . '%');
                    }
                });
            } else {
                $query->where('posts.location', $region);
            }
        }

        $posts = $query->orderBy('posts.created_at', 'desc')->limit(10)->get();

        // Process posts data
        foreach ($posts as $post) {
            $post->img = $post->img ? asset($post->img) : null;
            $post->avg_rating = round($post->avg_rating, 1);
        }

        return response()->json([
            "message" => "Region posts fetched successfully",
            "status" => 200,
            "data" => $posts
        ]);
    }

    /**
     * Get Uzbekistan regions with coordinates
     */
    public function getUzbekistanRegions()
    {
        $regions = [
            ['name' => 'Andijon', 'lat' => 40.7756, 'lng' => 72.3441],
            ['name' => 'Buxoro', 'lat' => 39.7756, 'lng' => 64.4286],
            ['name' => 'Fargʻona', 'lat' => 40.3864, 'lng' => 71.7864],
            ['name' => 'Jizzax', 'lat' => 40.1158, 'lng' => 67.8422],
            ['name' => 'Xorazm', 'lat' => 41.5279, 'lng' => 60.6235],
            ['name' => 'Namangan', 'lat' => 40.9983, 'lng' => 71.6726],
            ['name' => 'Navoiy', 'lat' => 40.0844, 'lng' => 65.3792],
            ['name' => 'Qashqadaryo', 'lat' => 38.8406, 'lng' => 65.7942],
            ['name' => 'Qoraqalpogʻiston', 'lat' => 43.7500, 'lng' => 59.0000],
            ['name' => 'Samarqand', 'lat' => 39.6547, 'lng' => 66.9597],
            ['name' => 'Sirdaryo', 'lat' => 40.8439, 'lng' => 68.6617],
            ['name' => 'Surxondaryo', 'lat' => 37.9409, 'lng' => 67.5709],
            ['name' => 'Toshkent viloyati', 'lat' => 41.2213, 'lng' => 69.8597],
            ['name' => 'Toshkent shahri', 'lat' => 41.2995, 'lng' => 69.2401]
        ];

        return response()->json([
            "message" => "Uzbekistan regions fetched successfully",
            "status" => 200,
            "data" => $regions
        ]);
    }
}
