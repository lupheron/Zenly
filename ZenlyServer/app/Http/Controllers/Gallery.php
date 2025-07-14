<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Gallery extends Controller
{
    public function getGalleryByPostId($post_id)
    {
        $gallery = DB::table('gallery')
            ->where('post_id', $post_id)
            ->get();

        // Convert paths to full URLs
        $gallery = $gallery->map(function ($item) {
            $item->img = asset($item->img); // Using Laravel's asset() helper
            return $item;
        });

        return response()->json([
            'message' => 'Gallery fetched successfully',
            'status' => 200,
            'data' => $gallery
        ]);
    }


    // In Gallery.php controller
    public function create(Request $request)
    {
        $authUser = $request->user();
        if (!$authUser || $authUser->id != $request['user_id']) {
            return response()->json(['message' => 'Unauthorized user'], 403);
        }

        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
            'img' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $post = DB::table('posts')->where('id', $request['post_id'])->first();
        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $user = DB::table('users')->where('id', $request['user_id'])->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $username = $user->username;
        $uploadPath = public_path('uploads/' . $username);

        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $file = $request->file('img');
        $filename = $username . '_' . time() . '_' . uniqid() . '_gallery_' . $file->getClientOriginalName();
        $file->move($uploadPath, $filename);
        $filePath = 'uploads/' . $username . '/' . $filename;

        $galleryId = DB::table('gallery')->insertGetId([
            "post_id" => $request['post_id'],
            "user_id" => $request['user_id'],
            "img" => $filePath,
            "created_at" => now(),
        ]);

        $galleryItem = DB::table('gallery')->where('id', $galleryId)->first();

        return response()->json([
            'message' => 'Image uploaded successfully',
            'data' => $galleryItem
        ], 201);
    }


    public function update(Request $request, $id)
    {
        $existing = DB::table('gallery')->where('id', $id)->first();
        if (!$existing) {
            return response()->json(['message' => 'Gallery item not found'], 404);
        }

        $authUser = $request->user();
        if (!$authUser || $authUser->id != $existing->user_id) {
            return response()->json(['message' => 'You are not allowed to update this gallery item'], 403);
        }

        $user = DB::table('users')->where('id', $request['user_id'])->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $username = $user->username;
        $uploadPath = public_path('uploads/' . $username);

        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $filePath = $existing->img;

        if ($request->hasFile('image')) {
            if ($filePath && file_exists(public_path($filePath))) {
                unlink(public_path($filePath));
            }

            $file = $request->file('image');
            $filename = $username . '_' . time() . '_' . uniqid() . '_gallery_' . $file->getClientOriginalName();
            $file->move($uploadPath, $filename);
            $filePath = 'uploads/' . $username . '/' . $filename;
        }

        $updated = DB::table('gallery')->where('id', $id)->update([
            "post_id" => $request['post_id'],
            "user_id" => $request['user_id'],
            "img" => $filePath
        ]);

        if ($updated) {
            return response()->json([
                'message' => 'Gallery updated successfully',
                'path' => $filePath
            ], 200);
        } else {
            return response()->json(['message' => 'Failed to update gallery'], 500);
        }
    }

    public function delete(Request $request, $id)
    {
        $gallery = DB::table('gallery')->where('id', $id)->first();

        $authUser = $request->user();
        if (!$authUser || $authUser->id != $gallery->user_id) {
            return response()->json(['message' => 'You are not allowed to delete this gallery item'], 403);
        }

        if ($gallery) {
            if ($gallery->img && file_exists(public_path($gallery->img))) {
                unlink(public_path($gallery->img));
            }

            DB::table('gallery')->where('id', $id)->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Gallery deleted successfully'
            ]);
        }

        return response()->json([
            'status' => 404,
            'message' => 'Gallery not found'
        ], 404);
    }
}
