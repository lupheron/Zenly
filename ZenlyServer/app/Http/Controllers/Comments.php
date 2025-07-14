<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class Comments extends Controller
{
    public function index()
    {
        $comments = DB::table("comments")->get();
        return response()->json([
            "message" => "Comments fetched seccessfully",
            "status" => 200,
            "data" => $comments
        ]);
    }

    public function create(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $existing = DB::table("comments")->where("user_id", $authUser->id)->exists();

        if ($existing) {
            return response()->json([
                "message" => "This user has already left a comment"
            ], 409);
        }

        $comment = DB::table("comments")->insertGetId([
            "user_id" => $authUser->id,
            "title" => $request["title"],
            "fullname" => $request["fullname"],
            "comment" => $request["comment"]
        ]);

        return response()->json([
            "message" => "Comment left successfuly",
            "status" => 200,
            "data" => $comment
        ]);
    }
}
