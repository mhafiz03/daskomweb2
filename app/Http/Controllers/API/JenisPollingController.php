<?php

namespace App\Http\Controllers\API;

use App\Models\JenisPolling;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class JenisPollingController extends Controller
{
    /**
     * Get all polling categories
     */
    public function index()
    {
        try {
            $categories = JenisPolling::select('id', 'judul')->get();

            return response()->json([
                'status' => 'success',
                'categories' => $categories,
                'message' => 'Polling categories retrieved successfully.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve polling categories.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}