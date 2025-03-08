<?php

namespace App\Http\Controllers\API;

use App\Models\JawabanTp;
use App\Models\Modul;
use App\Models\Praktikan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JawabanTPController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

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

    // Get all modules for the dropdown
    public function getModules()
    {
        try {
            $modules = Modul::select('id', 'name')->get();
            return response()->json([
                'success' => true,
                'data' => $modules
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data modul',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function getJawabanTP($nim, $modulId)
    {
        try {
            // Find praktikan by NIM
            $praktikan = Praktikan::where('nim', $nim)->first();
            
            if (!$praktikan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Praktikan dengan NIM tersebut tidak ditemukan'
                ], 404);
            }
            
            // Find modul
            $modul = Modul::where('id', $modulId)->first();
            
            if (!$modul) {
                return response()->json([
                    'success' => false,
                    'message' => 'Modul tidak ditemukan'
                ], 404);
            }
            
            $jawaban = JawabanTp::where('praktikan_id', $praktikan->id)
                ->where('modul_id', $modulId)
                ->get();
            
            if ($jawaban->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada jawaban TPS untuk praktikan dan modul tersebut'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Data ditemukan',
                'data' => [
                    'jawaban' => $jawaban,
                    'praktikan' => $praktikan,
                    'modul' => $modul
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Show jawaban for asisten with the specified route pattern
    public function showJawabanTP($nim, $modulId)
    {
        try {
            // Find praktikan by NIM
            $praktikan = Praktikan::where('nim', $nim)->first();
            
            if (!$praktikan) {
                return Inertia::render('JawabanTPS/JawabanTPSResult', [
                    'errors' => ['praktikan' => 'Praktikan dengan NIM tersebut tidak ditemukan']
                ]);
            }
            
            // Find modul
            $modul = Modul::where('idM', $modulId)->first();
            
            if (!$modul) {
                return Inertia::render('JawabanTPS/JawabanTPSResult', [
                    'errors' => ['modul' => 'Modul tidak ditemukan']
                ]);
            }
            
            // Get all soal for this modul
            $soalList = SoalTps::where('modul_id', $modulId)->get();
            
            if ($soalList->isEmpty()) {
                return Inertia::render('JawabanTPS/JawabanTPSResult', [
                    'errors' => ['soal' => 'Tidak ada soal untuk modul tersebut']
                ]);
            }
            
            // Get all jawaban for this praktikan and modul
            $jawabanList = JawabanTps::where('praktikan_id', $praktikan->id)
                ->where('modul_id', $modulId)
                ->get()
                ->keyBy('soal_id');
            
            // Prepare combined data (soal and jawaban)
            $combinedData = [];
            foreach ($soalList as $soal) {
                $jawaban = $jawabanList->get($soal->id);
                
                $combinedData[] = [
                    'soal_id' => $soal->id,
                    'soal_text' => $soal->soal,
                    'jawaban' => $jawaban ? $jawaban->jawaban : '-'
                ];
            }
            
            return Inertia::render('JawabanTPS/JawabanTPSResult', [
                'combinedData' => $combinedData,
                'praktikan' => $praktikan,
                'modul' => $modul
            ]);
        } catch (\Exception $e) {
            return Inertia::render('JawabanTPS/JawabanTPSResult', [
                'errors' => ['system' => 'Terjadi kesalahan: ' . $e->getMessage()]
            ]);
        }
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