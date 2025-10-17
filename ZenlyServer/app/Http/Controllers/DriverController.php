<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DriverController extends Controller
{
    public function index()
    {
        $drivers = DB::table('drivers')->get();
        return response()->json([
            'message' => 'Drivers fetched successfully',
            'status' => 200,
            'data' => $drivers
        ]);
    }

    public function create(Request $request)
    {

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

        $driver = DB::table('drivers')->insertGetId([
            "first_name" => $request['first_name'],
            "last_name" => $request['last_name'],
            "gender" => $request['gender'],
            "phone" => $request['phone'],
            "email" => $request['email'],
            "language" => $request['language'],
            "experience_years" => $request['experience_years'],
            "license_number" => $request['license_number'],
            "vehicle_type" => $request['vehicle_type'],
            "vehicle_model" => $request['vehicle_model'],
            "plate_number" => $request['plate_number'],
            "rating" => $request['rating'] ?? null,
            "available" => $request['available'] ?? 1,
            "location" => $request['location'],
            "price_per_day" => $request['price_per_day'],
            "bio" => $request['bio'] ?? null,
            "profile_photo" => $profilePhotoPath,
            "created_at" => now(),
        ]);

        return response()->json([
            'message' => 'Driver created successfully!',
            'driver' => $driver
        ]);
    }
}
