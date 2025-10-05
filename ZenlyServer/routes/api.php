<?php

use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\Admins;
use App\Http\Controllers\Comments;
use App\Http\Controllers\Features;
use App\Http\Controllers\Gallery;
use App\Http\Controllers\PostComments;
use App\Http\Controllers\Posts;
use App\Http\Controllers\PostViews;
use App\Http\Controllers\Rating;
use App\Http\Controllers\Uploads;
use App\Http\Controllers\Users;
use App\Http\Controllers\AreaTypesController;
use App\Http\Controllers\BookingRequest;
use App\Http\Controllers\BookingChecking;
use App\Http\Controllers\MapController;
use App\Http\Middleware\Cors;
use App\Http\Middleware\AdminAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required)
Route::group(['middleware' => [Cors::class]], function () {
    // User authentication
    Route::post('/register', [Users::class, 'register']);
    Route::post('/login', [Users::class, 'login']);

    // Admin authentication
    Route::post('/admin/register', [Admins::class, 'register']);
    Route::post('/admin/login', [Admins::class, 'login']);
    Route::get("/users", [Users::class, 'index']);

    // Public content
    Route::get('/posts', [Posts::class, 'index']);
    Route::get('/post/{id}', [Posts::class, 'getPostById']);
    Route::get('/posts/filter', [Posts::class, 'filter']);
    Route::get('/rating/{id}', [Rating::class, 'getUserAverageRating']);
    Route::get('/gallery/{post_id}', [Gallery::class, 'getGalleryByPostId']);
    Route::get('/comments', [Comments::class, 'index']);
    Route::get('/post-comments/{id}', [PostComments::class, 'index']);
    Route::get('/features/{id}', [Features::class, 'getFeaturesByPostId']);
    Route::get('/area-types', [AreaTypesController::class, 'index']);
    Route::get('/area-types/{id}', [AreaTypesController::class, 'show']);
    Route::post('/area-types', [AreaTypesController::class, 'store']);
    Route::put('/area-types/{id}', [AreaTypesController::class, 'update']);
    Route::get('/posts/top-rated', [Posts::class, 'topRated']);
    Route::get('/users/{id}/basic', [Users::class, 'getBasicUserInfo']);
    
    // Map routes
    Route::get('/map/posts', [MapController::class, 'getMapPosts']);
    Route::get('/map/posts-by-region', [MapController::class, 'getPostsByRegion']);
    Route::get('/map/regions', [MapController::class, 'getUzbekistanRegions']);

    // Public image serving
    Route::get('/uploads/{path}', [Uploads::class, 'serveImage'])->where('path', '.*');

    // Direct file serving from public/uploads
    Route::get('/files/{path}', function ($path) {
        $fullPath = public_path('uploads/' . $path);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $file = file_get_contents($fullPath);
        $type = mime_content_type($fullPath);

        return response($file, 200)
            ->header('Content-Type', $type)
            ->header('Cache-Control', 'public, max-age=31536000');
    })->where('path', '.*');
});

// Admin routes (admin authentication required)
Route::middleware(['auth.admin', Cors::class])->group(function () {
    Route::get('/admin/me', [Admins::class, 'me']);
    Route::post('/admin/logout', [Admins::class, 'logout']);

    // USERS
    Route::get('/admin/users', [Users::class, 'index']);
    Route::get('/admin/users/{id}', [Users::class, 'getUserByIdAdmin']);
    Route::put('/admin/users/{id}', [Users::class, 'updateUserAdmin']);
    Route::delete('/admin/users/{id}', [Users::class, 'deleteUserAdmin']);

    // POSTS
    Route::get('/admin/posts', [Posts::class, 'getAllPosts']);
    Route::get('/admin/post/{id}', [Posts::class, 'index']);
    Route::get('/admin/posts/{postId}', [Posts::class, 'getthefuck']); // For fetching single post
    Route::put('/admin/posts/{postId}', [Posts::class, 'adminUpdate']); // For updating post (admin)
    Route::delete('/admin/posts/{postId}', [Posts::class, 'destroy']); // For deleting post
    Route::get('/admin/posts/user/{userId}', [Posts::class, 'getUserPosts']); // For getting user posts

    // FEATURES
    Route::get('/admin/features/{id}', [Features::class, 'getFeaturesByPostId']);
    Route::post('/admin/features', [Features::class, 'adminCreate']);
    Route::delete('/admin/features/{id}', [Features::class, 'adminDelete']);

    // POST VIEWS
    Route::get('/admin/post-views/{post_id}', [PostViews::class, 'getViews']);
    Route::get('/admin/views/user/{user_id}', [PostViews::class, 'getUserViewsForAdmin']);
    Route::put('/admin/views/{id}', [PostViews::class, 'update']);
    Route::delete('/admin/views/{id}', [PostViews::class, 'destroy']);

    // POST COMMENTS
    Route::get('/admin/comments/{post_id}', [PostComments::class, 'index']);
    Route::get('/admin/comments/user/{user_id}', [PostComments::class, 'getUserCommentsForAdmin']);
    Route::put('/admin/post-comments/{id}', [PostComments::class, 'update']);
    Route::delete('/admin/comments/{id}', [PostComments::class, 'destroy']);

    // RATING
    Route::get('/admin/rating/{post_id}', [Rating::class, 'getUserAverageRating']);
    Route::get('/admin/rating/user/{user_id}', [Rating::class, 'getUserRatingsForAdmin']);
    Route::put('/admin/rating/{id}', [Rating::class, 'update']);
    Route::delete('/admin/rating/{id}', [Rating::class, 'destroy']);

    // GALLERY
    Route::get('/admin/gallery/{post_id}', [Gallery::class, 'getGalleryByPostId']);
    Route::post('/admin/gallery', [Gallery::class, 'adminCreate']);
    Route::delete('/admin/gallery/{id}', [Gallery::class, 'adminDelete']);

    // BOOKING REQUESTS
    Route::get('/admin/booking-requests/user/{user_id}', [BookingRequest::class, 'getUserBookingsForAdmin']);
    Route::put('/admin/booking-requests/{id}', [BookingRequest::class, 'update']);
    Route::delete('/admin/booking-requests/{id}', [BookingRequest::class, 'destroy']);
});

// User routes (authenticated users only)
Route::middleware(['auth.custom', 'security', Cors::class])->group(function () {
    // Authenticated user info
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // UPLOADS
    Route::post('/uploads/main', [Uploads::class, 'uploadMainImage']);

    // POSTS
    Route::get('/posts/user/{user_id}', [Posts::class, 'getPostsByUserId']);
    Route::post('/posts', [Posts::class, 'create']);
    Route::put('/posts/{post_id}', [Posts::class, 'update']);
    Route::delete('/posts/{id}', [Posts::class, 'delete']);

    // POST VIEWS
    Route::get("/posts/{post_id}/increase-interest", [PostViews::class, "getViews"]);
    Route::put("/posts/{post_id}/increase-interest", [PostViews::class, "increaseInterest"]);

    // COMMENTS
    Route::post('/comments', [Comments::class, 'create']);

    // POSTS COMMENTS
    Route::post('/post-comments', [PostComments::class, 'create']);

    // RATING
    Route::get('/rating/{post_id}/check', [Rating::class, 'checkUserRating']);
    Route::post('/rating', [Rating::class, 'create']);

    // GALLERY
    Route::post('/gallery', [Gallery::class, 'create']);
    Route::delete('/gallery/{id}', [Gallery::class, 'delete']);

    // FEATURES
    Route::post('/features', [Features::class, 'create']);
    Route::delete('/features/{id}', [Features::class, 'delete']);

    // SUBSCRIPTIONS
    Route::post('/subscriptions', [\App\Http\Controllers\Subscription::class, 'create']);
    Route::get('/subscriptions', [\App\Http\Controllers\Subscription::class, 'index']);
    Route::get('/subscriptions/{id}', [\App\Http\Controllers\Subscription::class, 'show']);
    Route::put('/subscriptions/{id}/status', [\App\Http\Controllers\Subscription::class, 'updateStatus']);

    // BOOKING REQUESTS
    Route::post('/booking-requests', [BookingRequest::class, 'create']);
    Route::get('/booking-requests/user/{user_id}', [BookingRequest::class, 'getByUser']);
    Route::get('/booking-requests/for-user-posts/{user_id}', [BookingRequest::class, 'getRequestsForUserPosts']);
    Route::put('/booking-requests/{id}/status', [BookingRequest::class, 'updateStatus']);
    Route::get('/booking-requests/booking-counts/{user_id}', [BookingRequest::class, 'getBookingCountsForUserPosts']);

    // BOOKING CHECKING
    Route::post('/booking-checking', [BookingChecking::class, 'create']);
    Route::post('/booking-checking/{id}/customer-confirm', [BookingChecking::class, 'customerConfirm']);
    Route::post('/booking-requests/{id}/customer-reject', [BookingChecking::class, 'customerReject']);
    Route::get('/booking-checking/by-request/{request_id}', [BookingChecking::class, 'getByRequestId']);
    Route::post('/booking-checking/update-expired', [BookingChecking::class, 'updateExpiredBookingsPublic']);

    // USER PROFILE
    Route::get('/user/{id}', [Users::class, 'getUsersById']);
    Route::put('/users/{id}', [Users::class, 'update']);
    Route::delete('/users/{id}', [Users::class, 'delete']);
});
