<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class GudeController extends Controller
{
    public function index()
    {
        $guides = DB::table('guides')
            ->select('id', 'first_name', 'last_name', 'gender', 'date_of_birth', 'phone', 'email', 'languages', 'experience_years', 'specialization', 'rating', 'location', 'available', 'profile_photo', 'bio', 'created_at')
            ->get();
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
                "first_name" => $request['first_name'],
                "last_name" => $request['last_name'],
                "gender" => $request['gender'],
                "date_of_birth" => $request['date_of_birth'],
                "phone" => $request['phone'],
                "email" => $request['email'],
                "password" => Hash::make($request['password']),
                "languages" => $request['languages'],
                "experience_years" => $request['experience_years'],
                "specialization" => $request['specialization'],
                "rating" => null,
                "location" => $request['location'],
                "available" => $request['available'] ?? 1,
                "profile_photo" => $profilePhotoPath,
                "bio" => $request['bio'] ?? null,
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

        return response()->json([
            'message' => 'Guide fetched successfully',
            'status' => 200,
            'data' => $guide
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $guide = DB::table('guides')->where('id', $id)->first();

            if (!$guide) {
                return response()->json([
                    'message' => 'Guide not found',
                    'status' => 404
                ], 404);
            }

            $updateData = [
                "first_name" => $request['first_name'] ?? $guide->first_name,
                "last_name" => $request['last_name'] ?? $guide->last_name,
                "gender" => $request['gender'] ?? $guide->gender,
                "date_of_birth" => $request['date_of_birth'] ?? $guide->date_of_birth,
                "phone" => $request['phone'] ?? $guide->phone,
                "email" => $request['email'] ?? $guide->email,
                "languages" => $request['languages'] ?? $guide->languages,
                "experience_years" => $request['experience_years'] ?? $guide->experience_years,
                "specialization" => $request['specialization'] ?? $guide->specialization,
                "rating" => $request['rating'] ?? $guide->rating,
                "location" => $request['location'] ?? $guide->location,
                "available" => $request['available'] ?? $guide->available,
                "bio" => $request['bio'] ?? $guide->bio,
            ];

            // Handle password update if provided
            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request['password']);
            }

            // Handle profile photo upload
            if ($request->hasFile('profile_photo')) {
                $file = $request->file('profile_photo');
                $filename = 'guide_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $uploadPath = public_path('uploads/guides');

                // Create directory if it doesn't exist
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Delete old profile photo if exists
                if ($guide->profile_photo && file_exists(public_path($guide->profile_photo))) {
                    unlink(public_path($guide->profile_photo));
                }

                // Move uploaded file
                $file->move($uploadPath, $filename);
                $updateData['profile_photo'] = 'uploads/guides/' . $filename;
            }

            $updated = DB::table('guides')->where('id', $id)->update($updateData);

            if ($updated) {
                return response()->json([
                    'message' => 'Guide updated successfully',
                    'status' => 200
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
