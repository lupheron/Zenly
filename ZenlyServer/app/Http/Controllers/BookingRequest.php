<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingRequest extends Controller
{
    public function create(Request $request)
    {
        $user_id = $request->input('user_id');
        $post_id = $request->input('post_id');
        $status = $request->input('status', 'pending');

        // Validate required fields
        if (!$user_id || !$post_id) {
            return response()->json([
                'message' => 'user_id and post_id are required',
                'status' => 422
            ], 422);
        }

        // Check if user exists
        $user = DB::table('users')->where('id', $user_id)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
                'status' => 404
            ], 404);
        }

        // Check if post exists
        $post = DB::table('posts')->where('id', $post_id)->first();
        if (!$post) {
            return response()->json([
                'message' => 'Post not found',
                'status' => 404
            ], 404);
        }

        $existingRequest = DB::table('booking_requests')
            ->where('user_id', $user_id)
            ->where('post_id', $post_id)
            ->orderByDesc('send_date')
            ->first();

        if ($existingRequest) {
            $lastSent = Carbon::parse($existingRequest->send_date);
            $daysSince = $lastSent->diffInDays(Carbon::now());

            if ($daysSince < 3) { // You can change 3 to any number of days
                return response()->json([
                    'message' => "Siz ushbu joyga $daysSince kun oldin so'rov yuborgansiz. Iltimos, keyinroq qayta urinib ko'ring.",
                    'status'  => 429
                ], 429);
            }
        }

        // Insert booking request
        $id = DB::table('booking_requests')->insertGetId([
            'user_id'    => $user_id,
            'post_id'    => $post_id,
            'send_date'  => Carbon::now(),
            'status'     => $status,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        $booking = DB::table('booking_requests')->where('id', $id)->first();

        return response()->json([
            'message' => 'Booking request created successfully.',
            'status'  => 201,
            'data'    => $booking
        ], 201);
    }

    public function getByUser(Request $request, $user_id)
    {
        $authUser = $request->user();
        if (!$authUser || $authUser->id != $user_id) {
            return response()->json([
                "message" => "You are not allowed to access these bookings",
                "status" => 403
            ], 403);
        }

        $bookings = DB::table('booking_requests')
            ->join('posts', 'booking_requests.post_id', '=', 'posts.id')
            ->join('users', 'booking_requests.user_id', '=', 'users.id')
            ->where('booking_requests.user_id', $user_id)
            ->select(
                'booking_requests.id',
                'posts.title as post_title',
                'users.fullname as user_fullname',
                'booking_requests.send_date',
                'booking_requests.status'
            )
            ->orderByDesc('booking_requests.send_date')
            ->get();

        return response()->json([
            'message' => 'Booking requests fetched successfully.',
            'status' => 200,
            'data' => $bookings
        ]);
    }
}
