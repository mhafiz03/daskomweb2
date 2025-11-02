<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Asisten;
use App\Models\LaporanPraktikan;
use Illuminate\Http\Request;

class LaporanPraktikanController extends Controller
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
        // Validasi input
        $request->validate([
            'pesan' => 'required|string',
            'kode' => 'required|string|max:3',
            'modul_id' => 'required|integer|exists:moduls,id',
            'praktikan_id' => 'required|integer|exists:praktikans,id',
            'rating' => 'nullable|numeric|min:0|max:5',
            'rating_praktikum' => 'nullable|numeric|min:0|max:5',
            'rating_asisten' => 'nullable|numeric|min:0|max:5',
        ]);
        // Cari asisten berdasarkan kode
        $asisten = Asisten::where('kode', $request->kode)->first();
        if (! $asisten) {
            return response()->json([
                'status' => 'error',
                'message' => 'Asisten dengan kode tersebut tidak ditemukan tolong hubungi JIN/FYN.',
            ], 404);
        }
        // Simpan laporan
        $laporan = LaporanPraktikan::create([
            'pesan' => $request->pesan,
            'asisten_id' => $asisten->id,
            'modul_id' => $request->modul_id,
            'praktikan_id' => $request->praktikan_id,
            'rating_praktikum' => $request->input('rating_praktikum', $request->input('rating')),
            'rating_asisten' => $request->input('rating_asisten'),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Feedback berhasil dikirim',
            'laporan_id' => $laporan->id,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        // Ambil laporan berdasarkan ID asisten
        $laporan = LaporanPraktikan::where('asisten_id', $id)
            ->leftJoin('moduls', 'moduls.id', '=', 'laporan_praktikans.modul_id')
            ->leftJoin('praktikans', 'praktikans.id', '=', 'laporan_praktikans.praktikan_id')
            ->leftJoin('kelas', 'kelas.id', '=', 'praktikans.kelas_id')
            ->select(
                'laporan_praktikans.id',
                'laporan_praktikans.pesan',
                'laporan_praktikans.rating_praktikum',
                'laporan_praktikans.rating_asisten',
                'laporan_praktikans.created_at',
                'laporan_praktikans.updated_at',
                'laporan_praktikans.asisten_id',
                'laporan_praktikans.modul_id',
                'laporan_praktikans.praktikan_id',
                'moduls.judul as modul_judul',
                'kelas.kelas as kelas',
                'kelas.id as id_kelas',
                'kelas.hari as hari',
                'kelas.shift as shift',
                'praktikans.nim as nim',
                'praktikans.nama as nama'
            )
            ->get();
        // Cek jika tidak ada laporan ditemukan
        if ($laporan->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada laporan yang ditemukan untuk asisten ini.',
            ], 404);
        }

        // Return laporan
        return response()->json([
            'status' => 'success',
            'laporan' => $laporan,
            'message' => 'Laporan praktikan retrieved successfully.',
        ], 200);
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
