<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MonumentsController extends Controller
{
    public function index()
    {
        $monuments = DB::table('monuments')->get();
        
        // Add full image URLs
        foreach ($monuments as $monument) {
            $monument->img = $monument->img ? asset($monument->img) : null;
        }
        
        return response()->json($monuments);   
    }

    public function create(Request $request)
    {
        try {
            // Validate required fields
            $request->validate([
                'name' => 'required|string|max:255',
                'location' => 'required|string|max:255',
                'description' => 'required|string',
                'img' => 'required|image|max:10240', // Image file is required, max 10MB
            ]);

            // Handle file upload
            $imgPath = null;
            if ($request->hasFile('img')) {
                $file = $request->file('img');
                $filename = 'monument_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $uploadPath = public_path('uploads/monuments');

                // Create monuments directory if it doesn't exist
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Move uploaded file
                $file->move($uploadPath, $filename);
                $imgPath = 'uploads/monuments/' . $filename;
            }

            $monumentId = DB::table('monuments')->insertGetId([
                'name' => $request->input('name'),
                'location' => $request->input('location'),
                'description' => $request->input('description'),
                'img' => $imgPath,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Monument created successfully',
                'monument_id' => $monumentId,
                'code' => 201
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error creating monument: ' . $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            // Get existing monument
            $monument = DB::table('monuments')->where('id', $id)->first();
            
            if (!$monument) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Monument not found',
                    'code' => 404
                ], 404);
            }

            // Validate fields
            $request->validate([
                'name' => 'sometimes|string|max:255',
                'location' => 'sometimes|string|max:255',
                'description' => 'sometimes|string',
                'img' => 'sometimes|image|max:10240', // Optional image file, max 10MB
            ]);

            $imgPath = $monument->img;

            // Handle new image upload
            if ($request->hasFile('img')) {
                $file = $request->file('img');

                // Delete old image if exists
                if ($imgPath && file_exists(public_path($imgPath))) {
                    unlink(public_path($imgPath));
                }

                $filename = 'monument_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $uploadPath = public_path('uploads/monuments');

                // Create monuments directory if it doesn't exist
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Move uploaded file
                $file->move($uploadPath, $filename);
                $imgPath = 'uploads/monuments/' . $filename;
            }

            $updateData = [];
            
            // Only update fields that were sent
            if ($request->filled('name')) {
                $updateData['name'] = $request->input('name');
            }
            if ($request->filled('location')) {
                $updateData['location'] = $request->input('location');
            }
            if ($request->filled('description')) {
                $updateData['description'] = $request->input('description');
            }
            if ($request->hasFile('img')) {
                $updateData['img'] = $imgPath;
            }

            DB::table('monuments')->where('id', $id)->update($updateData);

            return response()->json([
                'status' => 'success',
                'message' => 'Monument updated successfully',
                'code' => 200
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error updating monument: ' . $e->getMessage(),
                'code' => 500
            ], 500);
        }
    }

    public function delete($id)
    {
        // Get monument to delete its image
        $monument = DB::table('monuments')->where('id', $id)->first();
        
        if (!$monument) {
            return response()->json([
                'status' => 'error',
                'message' => 'Monument not found',
                'code' => 404
            ], 404);
        }

        // Delete image file if exists
        if ($monument->img && file_exists(public_path($monument->img))) {
            unlink(public_path($monument->img));
        }

        // Delete monument from database
        DB::table('monuments')->where('id', $id)->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Monument deleted successfully',
            'code' => 200
        ]);   
    }
}
