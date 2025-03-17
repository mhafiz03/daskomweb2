<?php

namespace App\Http\Controllers\API;

use App\Models\JawabanTp as JawabanTps;
use App\Models\Modul;
use App\Models\Praktikan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\SoalTp as SoalTps;


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
            
            JawabanTps::where('praktikan_id', $validateData['praktikan_id'])
                ->where('modul_id', $validateData['modul_id'])
                ->where('soal_id', $validateData['soal_id'])
                ->delete();
                
            JawabanTps::create([
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
            $jawaban = JawabanTps::where('praktikan_id', auth('sanctum')->user()->id)
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
            $modules = Modul::select('id', 'judul')->get();
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

    public function getJawabanTP($nim, $modulId) {
        try {
            // Existing logic from showJawabanTP
            $praktikan = Praktikan::where('nim', $nim)->first();
            if (!$praktikan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Praktikan tidak ditemukan',
                ], 404);
            }
    
            $modul = Modul::find($modulId);
            if (!$modul) {
                return response()->json([
                    'success' => false,
                    'message' => 'Modul tidak ditemukan',
                ], 404);
            }
    
            $soalList = SoalTps::where('modul_id', $modulId)->get();
            if ($soalList->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak ada soal untuk modul ini',
                ], 404);
            }
    
            $jawabanList = JawabanTps::where('praktikan_id', $praktikan->id)
                ->where('modul_id', $modulId)
                ->get()
                ->keyBy('soal_id');
    
            $jawabanData = [];
            
            foreach ($soalList as $soal) {
                $jawaban = isset($jawabanList[$soal->id]) ? $jawabanList[$soal->id]->jawaban : '-';
                
                $jawabanData[] = [
                    'soal_id' => $soal->id,
                    'soal_text' => $soal->soal,
                    'jawaban' => $jawaban,
                ];
            }
    
            return response()->json([
                'success' => true,
                'data' => [
                    'jawabanData' => $jawabanData,
                    'praktikan' => $praktikan,
                    'modul' => $modul
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    // Show jawaban for asisten 
 
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