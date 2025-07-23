<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingChecking extends Controller
{
    public function create(Request $request)
    {
        // Auto-update expired bookings before creating a new one
        $this->updateExpiredBookings();

        $request->validate([
            'request_id' => 'required|integer|exists:booking_requests,id',
            'user_id' => 'required|integer|exists:users,id',
            'post_id' => 'required|integer|exists:posts,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'required|numeric|min:0',
        ]);

        $id = DB::table('booking_checking')->insertGetId([
            'request_id' => $request->input('request_id'),
            'user_id' => $request->input('user_id'),
            'post_id' => $request->input('post_id'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'price' => $request->input('price'),
            'created_at' => Carbon::now(),
        ]);

        // Update booking_requests status to 'success'
        DB::table('booking_requests')
            ->where('id', $request->input('request_id'))
            ->update(['status' => 'active']);

        $checking = DB::table('booking_checking')->where('id', $id)->first();

        return response()->json([
            'message' => 'Booking checking created successfully.',
            'status' => 201,
            'data' => $checking
        ], 201);
    }

    /**
     * Set book_status=0 for booking_requests whose booking_checking end_date has passed.
     */
    private function updateExpiredBookings()
    {
        $now = Carbon::now();
        // Get all booking_checking where end_date < now
        $expired = DB::table('booking_checking')
            ->where('end_date', '<', $now)
            ->get();
        foreach ($expired as $check) {
            // Set book_status=0 for the related booking_request
            DB::table('booking_requests')
                ->where('id', $check->request_id)
                ->where('book_status', '!=', 0)
                ->update(['book_status' => 0]);
        }
    }
}
