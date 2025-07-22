<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Services\SecurityService;

class Subscription extends Controller
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    // List all subscriptions for the authenticated user
    public function index(Request $request)
    {
        $authUser = $request->user();
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $subscriptions = DB::table('subscription')->where('user_id', $authUser->id)->get();
        return response()->json([
            'message' => 'Subscriptions fetched successfully',
            'status' => 200,
            'data' => $subscriptions
        ]);
    }

    // View a single subscription (only if it belongs to the user)
    public function show(Request $request, $id)
    {
        $authUser = $request->user();
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $subscription = DB::table('subscription')->where('id', $id)->where('user_id', $authUser->id)->first();
        if (!$subscription) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Subscription',
                'show',
                'unauthorized_subscription_access',
                ['requested_subscription_id' => $id, 'auth_user_id' => $authUser->id]
            );
            return response()->json(['message' => 'Subscription not found or access denied', 'status' => 404], 404);
        }
        return response()->json([
            'message' => 'Subscription fetched successfully',
            'status' => 200,
            'data' => $subscription
        ]);
    }

    // Create a new subscription for the authenticated user
    public function create(Request $request)
    {
        $authUser = $request->user();
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Security check: user_id must match auth user, not from request
        $data = $request->only(['plan_name', 'price', 'start_date', 'end_date', 'status', 'payment_method']);
        $data['user_id'] = $authUser->id;
        $data['created_at'] = Carbon::now();
        $data['updated_at'] = Carbon::now();

        // Optionally: check for existing active subscription
        $active = DB::table('subscription')
            ->where('user_id', $authUser->id)
            ->where('status', 'active')
            ->where('end_date', '>', Carbon::now())
            ->first();
        if ($active) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Subscription',
                'create',
                'duplicate_active_subscription',
                ['plan_name' => $data['plan_name']]
            );
            return response()->json([
                'message' => 'You already have an active subscription',
                'status' => 409
            ], 409);
        }

        try {
            $id = DB::table('subscription')->insertGetId($data);
            return response()->json([
                'message' => 'Subscription created successfully',
                'status' => 201,
                'subscription_id' => $id
            ], 201);
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Subscription',
                'create',
                'subscription_creation_error',
                ['error' => $e->getMessage()]
            );
            return response()->json([
                'message' => 'Failed to create subscription',
                'status' => 500
            ], 500);
        }
    }

    // Update the status of a subscription (e.g., after payment)
    public function updateStatus(Request $request, $id)
    {
        $authUser = $request->user();
        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $subscription = DB::table('subscription')->where('id', $id)->first();
        if (!$subscription) {
            return response()->json(['message' => 'Subscription not found', 'status' => 404], 404);
        }
        // Only the owner or an admin can update
        if ($authUser->id !== $subscription->user_id && ($authUser->type ?? null) !== 'admin') {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Subscription',
                'updateStatus',
                'unauthorized_subscription_status_update',
                ['subscription_id' => $id, 'auth_user_id' => $authUser->id]
            );
            return response()->json(['message' => 'You are not allowed to update this subscription', 'status' => 403], 403);
        }
        $status = $request->input('status');
        if (!in_array($status, ['active', 'pending', 'cancelled'])) {
            return response()->json(['message' => 'Invalid status value', 'status' => 422], 422);
        }
        try {
            DB::table('subscription')->where('id', $id)->update([
                'status' => $status,
                'updated_at' => Carbon::now(),
            ]);
            return response()->json([
                'message' => 'Subscription status updated successfully',
                'status' => 200
            ]);
        } catch (\Exception $e) {
            $this->securityService->logSuspiciousActivity(
                $authUser->id,
                'Subscription',
                'updateStatus',
                'subscription_status_update_error',
                ['error' => $e->getMessage()]
            );
            return response()->json([
                'message' => 'Failed to update subscription status',
                'status' => 500
            ], 500);
        }
    }
}
