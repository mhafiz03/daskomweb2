<?php

namespace App\Http\Controllers\API;

use App\Models\JawabanTp;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class JawabanTPController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validateData = $request->validate([
                'jawaban' => 'required|string',
                'soal_id' => 'required',
                'praktikan_id' => 'required',
                'modul_id' => 'required',
            ]);
            JawabanTp::where('praktikan_id', $validateData['praktikan_id'])
                ->where('modul_id', $validateData['modul_id'])
                ->where('soal_id', $validateData['soal_id'])
                ->delete();
            JawabanTp::create([
                'jawaban' => $validateData['jawaban'],
                'soal_id' => $validateData['soal_id'],
                'praktikan_id' => $validateData['praktikan_id'],
                'modul_id' => $validateData['modul_id'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            return response()->json([
                "status" => "success",
                "message" => "Jawaban berhasil disimpan.",
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Terjadi kesalahan saat menyimpan jawaban.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($idModul)
    {
        try {
            $jawaban = JawabanTp::where('praktikan_id', auth('sanctum')->user()->id)
                ->where('modul_id', $idModul)
                ->get();
            if ($jawaban->isEmpty()) {
                return response()->json([
                    "status" => "success",
                    "message" => "Tidak ada jawaban",
                ]);
            }
            return response()->json([
                "status" => "success",
                "jawaban_tp" => $jawaban,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "status" => "error",
                "message" => "Terjadi kesalahan saat mengambil data jawaban.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }


    public function index()
    {
        return Inertia::render('JawabanTPS');
    }

    // Get all modules for the dropdown
    public function getModules()
    {
        $modules = Modul::select('id', 'name')->get();
        return response()->json($modules);
    }

    // Show jawaban for asisten with the specified route pattern
    public function showAsisten($nimPraktikan, $idModul)
    {
        // Find praktikan by NIM
        $praktikan = Praktikan::where('nim', $nimPraktikan)->first();
        
        if (!$praktikan) {
            return Inertia::render('JawabanTPSResult', [
                'errors' => ['praktikan' => ['Praktikan dengan NIM tersebut tidak ditemukan']],
                'jawaban' => [],
                'praktikan' => null,
                'modul' => null
            ]);
        }
        
        // Find modul
        $modul = Modul::find($idModul);
        
        if (!$modul) {
            return Inertia::render('JawabanTPSResult', [
                'errors' => ['modul' => ['Modul tidak ditemukan']],
                'jawaban' => [],
                'praktikan' => $praktikan,
                'modul' => null
            ]);
        }
        
        // Get all jawaban for the praktikan and modul
        $jawaban = JawabanTPS::where('praktikan_id', $praktikan->id)
            ->where('modul_id', $idModul)
            ->get();
            
        return Inertia::render('JawabanTPSResult', [
            'jawaban' => $jawaban,
            'praktikan' => $praktikan,
            'modul' => $modul,
            'errors' => []
        ]);
    }





    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
