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
use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required)
Route::group(['middleware' => [Cors::class]], function () {
    // Publicly accessible routes
    Route::post('/register', [Users::class, 'register']);
    Route::post('/login', [Users::class, 'login']);
    Route::post('/admin/login', [Admins::class, 'login']);
    Route::get('/admin/debug', [Admins::class, 'debug']);
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
    Route::get('/booking-checking/by-request/{request_id}', [BookingChecking::class, 'getByRequestId']);

    // USER PROFILE
    Route::get('/user/{id}', [Users::class, 'getUsersById']);
    Route::put('/users/{id}', [Users::class, 'update']);
    Route::delete('/users/{id}', [Users::class, 'delete']);
});
