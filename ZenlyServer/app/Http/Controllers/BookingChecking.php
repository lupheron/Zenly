<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class BookingChecking extends Controller
{
    public function create(Request $request)
    {
        $this->updateExpiredBookings();

        $request->validate([
            'request_id' => 'required|integer|exists:booking_requests,id',
            'user_id' => 'required|integer|exists:users,id',
            'post_id' => 'required|integer|exists:posts,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'required|numeric|min:0',
        ]);

        $ownerData = [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'price' => $request->input('price'),
        ];

        $id = DB::table('booking_checking')->insertGetId([
            'request_id' => $request->input('request_id'),
            'user_id' => $request->input('user_id'),
            'post_id' => $request->input('post_id'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'price' => $request->input('price'),
            'owner_confirmed' => true,
            'customer_confirmed' => false,
            'owner_data' => json_encode($ownerData),
            'status' => 'waiting_customer',
            'created_at' => now(),
        ]);

        DB::table('booking_requests')
            ->where('id', $request->input('request_id'))
            ->update(['status' => 'active']);

        $checking = DB::table('booking_checking')->where('id', $id)->first();

        return response()->json([
            'message' => 'Booking checking created. Waiting for customer confirmation.',
            'status' => 201,
            'data' => $checking
        ], 201);
    }

    public function customerConfirm(Request $request, $id)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'price' => 'required|numeric|min:0',
        ]);

        $customerData = [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
            'price' => $request->input('price'),
        ];

        $checking = DB::table('booking_checking')->where('id', $id)->first();
        if (!$checking) {
            return response()->json([
                'message' => 'Booking checking not found.',
                'status' => 404
            ], 404);
        }
        $ownerData = json_decode($checking->owner_data, true);
        if (!$ownerData) {
            return response()->json([
                'message' => 'Owner data not found.',
                'status' => 422
            ], 422);
        }
        // Compare all fields
        if (
            $ownerData['start_date'] === $customerData['start_date'] &&
            $ownerData['end_date'] === $customerData['end_date'] &&
            floatval($ownerData['price']) == floatval($customerData['price'])
        ) {
            // Data matches, set status active
            $updated = DB::table('booking_checking')
                ->where('id', $id)
                ->update([
                    'customer_confirmed' => true,
                    'customer_data' => json_encode($customerData),
                    'status' => 'active',
                ]);
            // Set the related post status to 0 (booked)
            DB::table('posts')->where('id', $checking->post_id)->update(['status' => 0]);
            $checking = DB::table('booking_checking')->where('id', $id)->first();
            return response()->json([
                'message' => 'Customer confirmation received. Data matches. Booking is now active.',
                'status' => 200,
                'data' => $checking
            ]);
        } else {
            // Data does not match
            return response()->json([
                'message' => 'Maʼlumotlar mos emas',
                'status' => 422
            ], 422);
        }
    }

    public function getByRequestId($request_id)
    {
        $checking = DB::table('booking_checking')->where('request_id', $request_id)->first();
        if ($checking) {
            return response()->json([
                'message' => 'Booking checking fetched.',
                'status' => 200,
                'data' => $checking
            ]);
        } else {
            return response()->json([
                'message' => 'Booking checking not found.',
                'status' => 404
            ], 404);
        }
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
            // Set the related post status to 1 (available)
            DB::table('posts')->where('id', $check->post_id)->update(['status' => 1]);
        }
    }
}
