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
        $existing = DB::table("comments")->where("user_id", $request["user_id"])->exists();

        if ($existing) {
            return response()->json([
                "message" => "This user has already left a comment"
            ], 409);
        }

        $comment = DB::table("comments")->insertGetId([
            "user_id" => $request["user_id"],
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
