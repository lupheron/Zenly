<?php

namespace App\Http\Controllers;

use App\Models\BookingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BookingRequestController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'post_id' => 'required|exists:posts,id',
            'status' => 'required|string',
        ]);

        $booking = BookingRequest::create([
            'user_id' => $validated['user_id'],
            'post_id' => $validated['post_id'],
            'status' => $validated['status'],
            'send_date' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Booking request created successfully.',
            'booking' => $booking,
        ], 201);
    }
} 