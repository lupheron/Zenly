<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class GudeController extends Controller
{
    public function index()
    {
        $guides = DB::table('guides')
            ->select('id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'phone', 'email', 'languages', 'experience_years', 'specialization', 'rating', 'location', 'available', 'profile_photo', 'bio', 'created_at')
            ->get();
        
        // Add full image URLs
        foreach ($guides as $guide) {
            $guide->profile_photo = $guide->profile_photo ? asset($guide->profile_photo) : null;
        }
        
        return response()->json([
            'message' => 'Guides fetched successfully',
            'status' => 200,
            'data' => $guides
        ]);
    }

    public function create(Request $request)
    {
        try {
            // Handle profile photo upload
            $profilePhotoPath = null;
            if ($request->hasFile('profile_photo')) {
                $file = $request->file('profile_photo');
                $filename = 'guide_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $uploadPath = public_path('uploads/guides');

                // Create directory if it doesn't exist
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Move uploaded file
                $file->move($uploadPath, $filename);
                $profilePhotoPath = 'uploads/guides/' . $filename;
            }

            $guide = DB::table('guides')->insertGetId([
                "first_name" => $request->get('first_name'),
                "last_name" => $request->get('last_name'),
                "gender" => $request->get('gender'),
                "date_of_birth" => $request->get('date_of_birth'),
                "phone" => $request->get('phone'),
                "email" => $request->get('email'),
                "password" => Hash::make($request->get('password')),
                "languages" => $request->get('languages'),
                "experience_years" => $request->get('experience_years'),
                "specialization" => $request->get('specialization'),
                "rating" => null,
                "location" => $request->get('location'),
                "available" => $request->get('available', 'yes'),
                "profile_photo" => $profilePhotoPath,
                "bio" => $request->get('bio'),
                "created_at" => Carbon::now(),
            ]);

            if ($guide) {
                return response()->json([
                    'message' => 'Guide created successfully',
                    'status' => 200,
                    'data' => ['id' => $guide]
                ]);
            } else {
                return response()->json([
                    'message' => 'Guide creation failed',
                    'status' => 500
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating guide: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function show($id)
    {
        $guide = DB::table('guides')
            ->select('id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'phone', 'email', 'languages', 'experience_years', 'specialization', 'rating', 'location', 'available', 'profile_photo', 'bio', 'created_at')
            ->where('id', $id)
            ->first();

        if (!$guide) {
            return response()->json([
                'message' => 'Guide not found',
                'status' => 404
            ], 404);
        }

        // Add full image URL
        $guide->profile_photo = $guide->profile_photo ? asset($guide->profile_photo) : null;

        return response()->json([
            'message' => 'Guide fetched successfully',
            'status' => 200,
            'data' => $guide
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            // Get existing guide
            $existingGuide = DB::table('guides')->where('id', $id)->first();

            if (!$existingGuide) {
                return response()->json([
                    'message' => 'Guide not found',
                    'status' => 404
                ], 404);
            }

            // Validate only provided fields
            $rules = [
                'first_name' => 'sometimes|string|max:255',
                'last_name' => 'sometimes|string|max:255',
                'gender' => 'sometimes|string|in:male,female',
                'date_of_birth' => 'sometimes|date',
                'phone' => 'sometimes|string|max:50',
                'email' => 'sometimes|email|max:255',
                'password' => 'sometimes|string|min:6',
                'languages' => 'sometimes|string|max:500',
                'experience_years' => 'sometimes|integer|min:0',
                'specialization' => 'sometimes|string|max:500',
                'location' => 'sometimes|string|max:255',
                'available' => 'sometimes|string|in:yes,no',
                'bio' => 'sometimes|string|max:1000',
                'profile_photo' => 'sometimes|file|image|max:2048'
            ];
            
            $request->validate($rules);

            $updateData = ['updated_at' => Carbon::now()];

            // Only update fields that were sent in the request
            foreach (['first_name', 'last_name', 'gender', 'date_of_birth', 'phone', 'email', 'languages', 'specialization', 'location', 'available', 'bio'] as $field) {
                if ($request->filled($field)) {
                    $updateData[$field] = $request->$field;
                }
            }

            // Handle experience_years separately to ensure it's an integer
            if ($request->filled('experience_years')) {
                $updateData['experience_years'] = (int) $request->experience_years;
            }

            // Handle password separately to hash it
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            // Handle profile photo upload if provided
            if ($request->hasFile('profile_photo')) {
                try {
                    $file = $request->file('profile_photo');
                    $filename = 'guide_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $uploadPath = public_path('uploads/guides');

                    // Create directory if it doesn't exist
                    if (!file_exists($uploadPath)) {
                        mkdir($uploadPath, 0777, true);
                    }

                    // Delete old profile photo if exists
                    if ($existingGuide->profile_photo && file_exists(public_path($existingGuide->profile_photo))) {
                        unlink(public_path($existingGuide->profile_photo));
                    }

                    // Move uploaded file
                    $file->move($uploadPath, $filename);
                    $updateData['profile_photo'] = 'uploads/guides/' . $filename;
                } catch (\Exception $e) {
                    // If image upload fails, keep existing photo
                    // Don't update profile_photo field
                }
            }

            // Apply updates
            $updated = DB::table("guides")->where("id", $id)->update($updateData);

            if ($updated) {
                // Fetch updated guide
                $updatedGuide = DB::table('guides')->where('id', $id)->first();
                return response()->json([
                    'message' => 'Guide updated successfully',
                    'status' => 200,
                    'data' => $updatedGuide
                ]);
            } else {
                return response()->json([
                    'message' => 'Guide update failed',
                    'status' => 500
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating guide: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $guide = DB::table('guides')->where('id', $id)->first();

            if (!$guide) {
                return response()->json([
                    'message' => 'Guide not found',
                    'status' => 404
                ], 404);
            }

            // Delete profile photo if exists
            if ($guide->profile_photo && file_exists(public_path($guide->profile_photo))) {
                unlink(public_path($guide->profile_photo));
            }

            $deleted = DB::table('guides')->where('id', $id)->delete();

            if ($deleted) {
                return response()->json([
                    'message' => 'Guide deleted successfully',
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'message' => 'Guide deletion failed',
                    'status' => 500
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting guide: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }
}
