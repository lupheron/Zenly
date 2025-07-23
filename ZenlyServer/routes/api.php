<?php

use App\Http\Controllers\Admin\SecurityController;
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
use App\Http\Middleware\Cors;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes (no auth required)
Route::group(['middleware' => [Cors::class]], function () {
    // Publicly accessible routes
    Route::post('/register', [Users::class, 'register']);
    Route::post('/login', [Users::class, 'login']);
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

// Protected routes (only for authenticated users with valid token)
Route::middleware(['auth.custom', 'security', Cors::class])->group(function () {
    // Authenticated user info
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // USERS
    Route::get('/users', [Users::class, 'index']);
    Route::get('/user/{id}', [Users::class, 'getUsersById']);
    Route::post('/users', [Users::class, 'create']);
    Route::put('/users/{id}', [Users::class, 'update']);
    Route::delete('/users/{id}', [Users::class, 'delete']);

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
});

// // Admin Security Routes (add role-based middleware later)
// Route::middleware(['auth.custom', Cors::class])->prefix('admin')->group(function () {
//     Route::get('/security/dashboard', [SecurityController::class, 'dashboard']);
//     Route::get('/security/blocked-users', [SecurityController::class, 'getBlockedUsers']);
//     Route::post('/security/unblock-user/{userId}', [SecurityController::class, 'unblockUser']);
//     Route::get('/security/suspicious-activities', [SecurityController::class, 'getSuspiciousActivities']);
//     Route::get('/security/logs', [SecurityController::class, 'getSecurityLogs']);
//     Route::get('/security/user-report/{userId}', [SecurityController::class, 'getUserActivityReport']);
// });
