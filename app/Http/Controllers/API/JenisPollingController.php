<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JenisPolling;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
                'message' => 'Polling categories retrieved successfully.',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve polling categories.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created polling category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255|unique:jenis_pollings,judul',
        ]);

        try {
            $category = JenisPolling::create([
                'judul' => $validated['judul'],
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Jenis polling berhasil dibuat.',
                'category' => [
                    'id' => $category->id,
                    'judul' => $category->judul,
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat jenis polling.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
