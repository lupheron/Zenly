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

        // Find the latest booking request for this user and post
        $latestRequest = DB::table('booking_requests')
            ->where('user_id', $user_id)
            ->where('post_id', $post_id)
            ->orderByDesc('send_date')
            ->first();

        if ($latestRequest) {
            // If the latest request is not cancelled and its book_status is not 0, block new request
            if ($latestRequest->status !== 'cancelled' && $latestRequest->book_status != 0) {
                return response()->json([
                    'message' => "Siz allaqachon ushbu joyga so'rov yuborgansiz va u hali bekor qilinmagan.",
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
            ->join('users as users_from_posts', 'posts.user_id', '=', 'users_from_posts.id')
            ->where('booking_requests.user_id', $user_id)
            ->select(
                'booking_requests.id',
                'posts.title as post_title',
                'posts.id as post_id',
                'users.fullname as user_fullname',
                'users.phone as user_phone',
                'users_from_posts.fullname as post_owner_fullname',
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

    public function getRequestsForUserPosts(Request $request, $user_id)
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
            ->join('users as requesters', 'booking_requests.user_id', '=', 'requesters.id')
            ->where('posts.user_id', $user_id)
            ->select(
                'booking_requests.id',
                'posts.title as post_title',
                'posts.id as post_id',  
                'requesters.fullname as requester_fullname',
                'requesters.phone as user_phone',
                'booking_requests.send_date',
                'booking_requests.status'
            )
            ->orderByDesc('booking_requests.send_date')
            ->get();

        return response()->json([
            'message' => 'Booking requests for your posts fetched successfully.',
            'status' => 200,
            'data' => $bookings
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $authUser = $request->user();
        $booking = DB::table('booking_requests')
            ->join('posts', 'booking_requests.post_id', '=', 'posts.id')
            ->where('booking_requests.id', $id)
            ->select('posts.user_id as post_owner_id')
            ->first();

        if (!$booking || $authUser->id != $booking->post_owner_id) {
            return response()->json([
                "message" => "You are not allowed to update this booking request",
                "status" => 403
            ], 403);
        }

        $status = $request->input('status');
        if (!in_array($status, ['active', 'cancelled'])) {
            return response()->json([
                "message" => "Invalid status",
                "status" => 422
            ], 422);
        }

        DB::table('booking_requests')->where('id', $id)->update([
            'status' => $status,
            'updated_at' => now(),
        ]);

        return response()->json([
            "message" => "Booking request status updated",
            "status" => 200
        ]);
    }
}
