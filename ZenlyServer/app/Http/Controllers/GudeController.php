<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GudeController extends Controller
{
    public function index() {
        $guides = DB::table('guides')->get();
        return response()->json([
            'message' => 'Guides fetched successfully',
            'status' => 200,
            'data' => $guides
        ]);
    }

    public function create(Request $request) {
        $guide = DB::table('guides')->insertGetId([
            "first_name" => $request['first_name'],
            "last_name" => $request['last_name'],
            "gender" => $request['gender'],
            "date_of_birth" => $request['date_of_birth'],
            "phone" => $request['phone'],
            "email" => $request['email'],
            "language" => $request['language'],
            "experience_years" => $request['experience_years'],
            "specialization" => $request['specialization'],
            "rating" => $request['rating'],
            "location" => $request['location'],
            "available" => $request['available'],
            "profile_photo" => $request['profile_photo'],
            "bio" => $request['bio'],
            "created_at" => Carbon::now(),
        ]);
        if ($guide) {
            return response()->json([
                'message' => 'Guide created successfully',
                'status' => 200,
                'data' => $guide
            ]);
        } else {
            return response()->json([
                'message' => 'Guide creation failed',
                'status' => 500
            ]);
        }
    }
}
