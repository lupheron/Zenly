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
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $bookings = DB::table('booking_requests')
            ->join('posts', 'booking_requests.post_id', '=', 'posts.id')
            ->join('users', 'booking_requests.user_id', '=', 'users.id')
            ->join('users as users_from_posts', 'posts.user_id', '=', 'users_from_posts.id')
            ->where('booking_requests.user_id', $user_id)
            ->when($startDate, function ($query) use ($startDate) {
                $query->where('booking_requests.created_at', '>=', $startDate);
            })
            ->when($endDate, function ($query) use ($endDate) {
                $query->where('booking_requests.created_at', '<=', $endDate);
            })
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

    /**
     * Get booking counts for each post owned by the user (for dashboard bar chart)
     */
    public function getBookingCountsForUserPosts(Request $request, $user_id)
    {
        $authUser = $request->user();
        if (!$authUser || $authUser->id != $user_id) {
            return response()->json([
                'message' => 'You are not allowed to access these booking counts',
                'status' => 403
            ], 403);
        }

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $counts = DB::table('posts')
            ->leftJoin('booking_requests', function ($join) use ($startDate, $endDate) {
                $join->on('posts.id', '=', 'booking_requests.post_id')
                    ->where('booking_requests.status', '=', 'active');
                if ($startDate) {
                    $join->where('booking_requests.created_at', '>=', $startDate);
                }
                if ($endDate) {
                    $join->where('booking_requests.created_at', '<=', $endDate);
                }
            })
            ->where('posts.user_id', $user_id)
            ->groupBy('posts.id', 'posts.title')
            ->select('posts.id as post_id', 'posts.title as post_title', DB::raw('COUNT(booking_requests.id) as count'))
            ->get();

        return response()->json([
            'message' => 'Booking counts fetched successfully.',
            'status' => 200,
            'data' => $counts
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

    public function getUserBookingsForAdmin($user_id)
    {
        $bookings = DB::table('booking_requests')
            ->join('posts', 'booking_requests.post_id', '=', 'posts.id')
            ->join('users as requesters', 'booking_requests.user_id', '=', 'requesters.id')
            ->join('users as post_owners', 'posts.user_id', '=', 'post_owners.id')
            ->where('booking_requests.user_id', $user_id)
            ->select(
                'booking_requests.id',
                'booking_requests.send_date',
                'booking_requests.status',
                'posts.id as post_id',
                'posts.title as post_title',
                'post_owners.fullname as post_owner_fullname',
                'requesters.fullname as requester_fullname',
                'requesters.phone as requester_phone'
            )
            ->orderByDesc('booking_requests.send_date')
            ->get();

        return response()->json([
            'message' => 'User booking requests fetched successfully for admin.',
            'status'  => 200,
            'data'    => $bookings
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'user_id' => 'required|exists:users,id',
            'send_date' => 'required|date',
            'status' => 'required|string|in:pending,active,cancelled',
            'book_status' => 'required|integer|min:0|max:1',
        ]);

        DB::table('booking_requests')->where('id', $id)->update([
            'post_id'     => $request->post_id,
            'user_id'     => $request->user_id,
            'send_date'   => $request->send_date,
            'status'      => $request->status,
            'book_status' => $request->book_status,
            'updated_at'  => Carbon::now()
        ]);

        $updated = DB::table('booking_requests')->where('id', $id)->first();

        return response()->json([
            'status'  => 200,
            'message' => 'Booking Request updated successfully',
            'data'    => $updated
        ]);
    }
    
    public function destroy($id)
    {
        $postId = DB::table('booking_requests')->where('id', $id)->value('post_id');
        if (!$postId) {
            return response()->json(['message' => 'Booking request not found'], 404);
        }

        $booking = DB::table('booking_requests')->where('id', $id)->delete();

        $post = DB::table('posts')->where('id', $postId)->update([
            "status" => 1
        ]);

        if (!$post) {
            return response()->json(['message' => 'Post not found or already updated'], 404);
        }

        if ($booking) {
            return response()->json(['message' => 'Booking request deleted successfully'], 200);
        } else {
            return response()->json(['message' => 'Booking request not found'], 404);
        }
    }
}
