<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Uploads extends Controller
{
    public function uploadMainImage(Request $request)
    {
        $request->validate([
            'img' => 'required|image',
            'user_id' => 'required|integer',
            'post_id' => 'required|integer'
        ]);

        $user = DB::table('users')->where('id', $request['user_id'])->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!$request->hasFile('img')) {
            return response()->json(['message' => 'No image uploaded.'], 400);
        }

        $username = $user->username;
        $uploadPath = public_path('uploads/' . $username);

        if (!file_exists($uploadPath)) {
            mkdir($uploadPath, 0777, true);
        }

        $file = $request->file('img');
        $filename = $username . '_' . time() . '_' . uniqid() . '_post_' . $file->getClientOriginalName();
        $file->move($uploadPath, $filename);
        $filePath = 'uploads/' . $username . '/' . $filename;

        return response()->json([
            'message' => 'Image uploaded successfully.',
            'path' => $filePath
        ], 201);
    }
}
