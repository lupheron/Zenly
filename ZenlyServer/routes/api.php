<?php

use App\Http\Controllers\Comments;
use App\Http\Controllers\Features;
use App\Http\Controllers\Gallery;
use App\Http\Controllers\PostComments;
use App\Http\Controllers\Posts;
use App\Http\Controllers\Rating;
use App\Http\Controllers\Uploads;
use App\Http\Controllers\Users;
use App\Http\Middleware\Cors;
use Illuminate\Support\Facades\Route;

Route::group(['middleware' => [Cors::class]], function () {
    // USERS
    Route::get('/users', [Users::class, 'index']);
    Route::get('/user/{id}', [Users::class, 'getUsersById']);
    Route::post('/register', [Users::class, 'register']);
    Route::post('/login', [Users::class, 'login']);
    Route::post('/users', [Users::class, 'create']);
    Route::put('/users/{id}', [Users::class, 'update']);
    Route::delete('/users/{id}', [Users::class, 'delete']);

    // UPLOADS
    Route::post('/uploads/main', [Uploads::class, 'uploadMainImage']);

    // POSTS
    Route::get('/posts', [Posts::class, 'index']);
    Route::get('/posts/user/{user_id}', [Posts::class, 'getPostsByUserId']);
    Route::get('/post/{id}', [Posts::class, 'getPostById']);
    Route::get('/posts/filter', [Posts::class, 'filter']);
    Route::post('/posts', [Posts::class, 'create']);
    Route::put('/posts/{post_id}', [Posts::class, 'update']);
    Route::put('/posts/{post_id}/increase-interest', [Posts::class, 'increaseInterest']);
    Route::delete('/posts/{id}', [Posts::class, 'delete']);

    // COMMENTS
    Route::get('/comments', [Comments::class, 'index']);
    Route::post('/comments', [Comments::class, 'create']);

    // POSTS COMMENTS
    Route::get('/post-comments/{id}', [PostComments::class, 'index']);
    Route::post('/post-comments', [PostComments::class, 'create']);

    // RATING
    Route::get('/rating/{id}', [Rating::class, 'getUserAverageRating']);
    Route::post('/rating', [Rating::class, 'create']);

    // GALLERY
    Route::get('/gallery/{post_id}', [Gallery::class, 'getGalleryByPostId']);
    Route::post('/gallery', [Gallery::class, 'create']);
    Route::delete('/gallery/{id}', [Gallery::class, 'delete']);

    // FEATURES
    Route::get('/features/{id}', [Features::class, 'getFeaturesByPostId']);
    Route::post('/features', [Features::class, 'create']);
    Route::delete('/features/{id}', [Features::class, 'delete']);
});
