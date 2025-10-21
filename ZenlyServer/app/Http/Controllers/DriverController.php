<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = DB::table('drivers')
            ->select('id', 'first_name', 'last_name', 'gender', 'phone', 'email', 'language', 'experience_years', 'license_number', 'vehicle_type', 'vehicle_model', 'plate_number', 'rating', 'available', 'location', 'price_per_day', 'profile_photo', 'bio', 'created_at')
            ->get();
        return response()->json([
            'message' => 'Drivers fetched successfully',
            'status' => 200,
            'data' => $drivers
        ]);
    }

    public function create(Request $request)
    {
        try {
            // Handle profile photo upload
            $profilePhotoPath = null;
            if ($request->hasFile('profile_photo')) {
                $file = $request->file('profile_photo');
                $filename = 'driver_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $uploadPath = public_path('uploads/drivers');

                // Create directory if it doesn't exist
                if (!file_exists($uploadPath)) {
                    mkdir($uploadPath, 0777, true);
                }

                // Move uploaded file
                $file->move($uploadPath, $filename);
                $profilePhotoPath = 'uploads/drivers/' . $filename;
            }

            $driver = DB::table('drivers')->insertGetId([
                "first_name" => $request->get('first_name'),
                "last_name" => $request->get('last_name'),
                "gender" => $request->get('gender'),
                "phone" => $request->get('phone'),
                "email" => $request->get('email'),
                "password" => Hash::make($request->get('password')),
                "language" => $request->get('language'),
                "experience_years" => $request->get('experience_years'),
                "license_number" => $request->get('license_number'),
                "vehicle_type" => $request->get('vehicle_type'),
                "vehicle_model" => $request->get('vehicle_model'),
                "plate_number" => $request->get('plate_number'),
                "rating" => null,
                "available" => $request->get('available', 'yes'),
                "location" => $request->get('location'),
                "price_per_day" => $request->get('price_per_day'),
                "bio" => $request->get('bio'),
                "profile_photo" => $profilePhotoPath,
                "created_at" => Carbon::now(),
            ]);

            if ($driver) {
                return response()->json([
                    'message' => 'Driver created successfully',
                    'status' => 200,
                    'data' => ['id' => $driver]
                ]);
            } else {
                return response()->json([
                    'message' => 'Driver creation failed',
                    'status' => 500
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating driver: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function show($id)
    {
        $driver = DB::table('drivers')
            ->select('id', 'first_name', 'last_name', 'gender', 'phone', 'email', 'language', 'experience_years', 'license_number', 'vehicle_type', 'vehicle_model', 'plate_number', 'rating', 'available', 'location', 'price_per_day', 'profile_photo', 'bio', 'created_at')
            ->where('id', $id)
            ->first();

        if (!$driver) {
            return response()->json([
                'message' => 'Driver not found',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'message' => 'Driver fetched successfully',
            'status' => 200,
            'data' => $driver
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            // Get existing driver
            $existingDriver = DB::table('drivers')->where('id', $id)->first();

            if (!$existingDriver) {
                return response()->json([
                    'message' => 'Driver not found',
                    'status' => 404
                ], 404);
            }

            // Validate only provided fields
            $rules = [
                'first_name' => 'sometimes|string|max:50',
                'last_name' => 'sometimes|string|max:50',
                'gender' => 'sometimes|string|in:male,female,other',
                'phone' => 'sometimes|string|max:20',
                'email' => 'sometimes|email|max:100',
                'password' => 'sometimes|string|min:6',
                'language' => 'sometimes|string|max:100',
                'experience_years' => 'sometimes|integer|min:0',
                'license_number' => 'sometimes|string|max:50',
                'vehicle_type' => 'sometimes|string|in:car,minivan,bus,jeep',
                'vehicle_model' => 'sometimes|string|max:100',
                'plate_number' => 'sometimes|string|max:20',
                'location' => 'sometimes|string|max:100',
                'available' => 'sometimes|string|in:yes,no',
                'price_per_day' => 'sometimes|numeric|min:0',
                'bio' => 'sometimes|string|max:1000',
                'profile_photo' => 'sometimes|file|image|max:2048'
            ];
            
            $request->validate($rules);

            $updateData = ['updated_at' => Carbon::now()];

            // Only update fields that were sent in the request
            foreach (['first_name', 'last_name', 'gender', 'phone', 'email', 'language', 'license_number', 'vehicle_type', 'vehicle_model', 'plate_number', 'location', 'available', 'price_per_day', 'bio'] as $field) {
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
                    $filename = 'driver_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $uploadPath = public_path('uploads/drivers');

                    // Create directory if it doesn't exist
                    if (!file_exists($uploadPath)) {
                        mkdir($uploadPath, 0777, true);
                    }

                    // Delete old profile photo if exists
                    if ($existingDriver->profile_photo && file_exists(public_path($existingDriver->profile_photo))) {
                        unlink(public_path($existingDriver->profile_photo));
                    }

                    // Move uploaded file
                    $file->move($uploadPath, $filename);
                    $updateData['profile_photo'] = 'uploads/drivers/' . $filename;
                } catch (\Exception $e) {
                    // If image upload fails, keep existing photo
                    // Don't update profile_photo field
                }
            }

            // Apply updates
            $updated = DB::table("drivers")->where("id", $id)->update($updateData);

            if ($updated) {
                // Fetch updated driver
                $updatedDriver = DB::table('drivers')->where('id', $id)->first();
                return response()->json([
                    'message' => 'Driver updated successfully',
                    'status' => 200,
                    'data' => $updatedDriver
                ]);
            } else {
                return response()->json([
                    'message' => 'Driver update failed',
                    'status' => 500
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating driver: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $driver = DB::table('drivers')->where('id', $id)->first();

            if (!$driver) {
                return response()->json([
                    'message' => 'Driver not found',
                    'status' => 404
                ], 404);
            }

            // Delete profile photo if exists
            if ($driver->profile_photo && file_exists(public_path($driver->profile_photo))) {
                unlink(public_path($driver->profile_photo));
            }

            $deleted = DB::table('drivers')->where('id', $id)->delete();

            if ($deleted) {
                return response()->json([
                    'message' => 'Driver deleted successfully',
                    'status' => 200
                ]);
            } else {
                return response()->json([
                    'message' => 'Driver deletion failed',
                    'status' => 500
                ], 500);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting driver: ' . $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }
}
