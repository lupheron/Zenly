<?php

namespace App\Http\Controllers;

use App\Models\AreaTypes;
use Illuminate\Http\Request;

class AreaTypesController extends Controller
{
    public function index()
    {
        return response()->json(['data' => AreaTypes::all()]);
    }

    public function show($id)
    {
        $areaType = AreaTypes::find($id);
        if (!$areaType) {
            return response()->json(['message' => 'Area type not found'], 404);
        }
        return response()->json(['data' => $areaType]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $areaType = AreaTypes::create($validated);
        return response()->json(['data' => $areaType], 201);
    }

    public function update(Request $request, $id)
    {
        $areaType = AreaTypes::find($id);
        if (!$areaType) {
            return response()->json(['message' => 'Area type not found'], 404);
        }
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);
        $areaType->update($validated);
        return response()->json(['data' => $areaType]);
    }
}
