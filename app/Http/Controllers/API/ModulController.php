<?php

namespace App\Http\Controllers\API;

use App\Models\Modul;
use App\Models\Resource;
use App\Models\Tugaspendahuluan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ModulController extends BaseController
{
    public function index()
    {
        try {
            $moduls = Modul::leftJoin('resources', 'resources.modul_id', '=', 'moduls.id')
                ->select(
                    'judul',
                    'deskripsi',
                    'isEnglish',
                    'isUnlocked',
                    'moduls.id as idM',
                    'resources.id as idR',
                    'resources.modul_link',
                    'resources.ppt_link'
                )
                ->get();

            return response()->json([
                'data' => $moduls,
                'message' => 'Moduls retrieved successfully.',
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while retrieving moduls.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            // Mengambil modul dengan eager loading relasi 'resource'
            $modul = Modul::with('resource')
                ->select('judul', 'deskripsi', 'isEnglish', 'isUnlocked', 'moduls.id as idM')
                ->where('moduls.id', $id)
                ->first();
            if (! $modul) {
                return response()->json([
                    'message' => 'Modul tidak ditemukan.',
                ], 404);
            }
            $modul->resource_id = $modul->resource->id ?? null;
            $modul->modul_link = $modul->resource->modul_link ?? null;
            $modul->ppt_link = $modul->resource->ppt_link ?? null;

            return response()->json([
                'success' => true,
                'data' => $modul,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil modul.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        // Validasi input dari request
        $request->validate([
            'judul' => 'required|unique:moduls|string',
            'deskripsi' => 'required|string',
            'isEnglish' => 'required|integer',
            'isUnlocked' => 'required|integer',
            'modul_link' => 'nullable|string',
            'ppt_link' => 'nullable|string',
            'video_link' => 'nullable|string',
        ]);
        try {
            $modul = Modul::create([
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'isEnglish' => $request->isEnglish,
                'isUnlocked' => $request->isUnlocked,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            Resource::create([
                'modul_id' => $modul->id,
                'modul_link' => $request->modul_link ?? '',
                'ppt_link' => $request->ppt_link ?? '',
                'video_link' => $request->video_link ?? '',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            Tugaspendahuluan::create([
                'modul_id' => $modul->id,
                'pembahasan' => 'empty',
                'isActive' => 0,
            ]);

            return redirect()->back()->with('success', 'Modul added successfully.');
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menambahkan modul.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string',
            'deskripsi' => 'required|string',
            'isEnglish' => 'required|integer',
            'isUnlocked' => 'required|integer',
            'modul_link' => 'required|string',
            'ppt_link' => 'required|string',
            'video_link' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Check if title is being changed and if new title already exists
            $modul = Modul::findOrFail($id);
            if ($request->judul !== $modul->judul) {
                $existingModul = Modul::where('judul', $request->judul)->first();
                if ($existingModul) {
                    return redirect()->back()->withErrors([
                        'judul' => 'Judul "'.$request->judul.'" sudah terdaftar.',
                    ])->withInput();
                }
            }

            $resource = Resource::where('modul_id', $modul->id)->first();

            if (! $resource) {
                // Create a new resource if one doesn't exist
                $resource = new Resource;
                $resource->modul_id = $modul->id;
                // Set other required fields
            }

            //            if (!$resource) {
            //                return redirect()->back()->withErrors([
            //                    'general' => 'Resource tidak ditemukan untuk modul ini.'
            //                ])->withInput();
            //            }

            // Update modul
            $modul->judul = $request->judul;
            $modul->deskripsi = $request->deskripsi;
            $modul->isEnglish = $request->isEnglish;
            $modul->isUnlocked = $request->isUnlocked;
            $modul->save();

            // Update resource
            $resource->modul_link = $request->modul_link;
            $resource->ppt_link = $request->ppt_link;
            $resource->video_link = $request->video_link;
            $resource->save();

            return redirect()->back()->with('success', 'Modul berhasil diupdate.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'general' => 'Terjadi kesalahan saat mengupdate modul: '.$e->getMessage(),
            ])->withInput();
        }
    }

    public function destroy($id)
    {
        if (! Modul::where('id', $id)->exists()) {
            return response()->json(['message' => 'Modul tidak ditemukan'], 404);
        }
        $modul = Modul::findOrFail($id);
        $modul->delete();

        return response()->json([
            'message' => 'modul berhasil dihapus',

        ], 200);
    }

    //  =====================Template for resetAll()=====================
    //    di disable but still can be used
    //
    //
    //    public function resetAll()
    //    {
    //        try {
    //            // This deletes all records but respects foreign keys
    //            Modul::query()->delete();
    //
    //            return response()->json([
    //                'message' => 'Semua data modul berhasil dihapus'
    //            ], 200);
    //        } catch (\Exception $e) {
    //            return response()->json([
    //                'message' => 'Gagal menghapus data modul: ' . $e->getMessage()
    //            ], 500);
    //        }
    //    }

    public function reset()
    {
        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0;');
            Modul::query()->delete();
            DB::table('jawaban_fitbs')->truncate();
            DB::table('jawaban_jurnals')->truncate();
            DB::table('jawaban_mandiris')->truncate();
            DB::table('jawaban_tas')->truncate();
            DB::table('jawaban_tks')->truncate();
            DB::table('jawaban_tps')->truncate();
            DB::table('kumpul_tps')->truncate();
            DB::table('nilais')->truncate();
            DB::table('praktikums')->truncate();
            DB::table('resources')->truncate();
            DB::table('soal_fitbs')->truncate();
            DB::table('soal_jurnals')->truncate();
            DB::table('soal_mandiris')->truncate();
            DB::table('soal_tas')->truncate();
            DB::table('soal_tks')->truncate();
            DB::table('soal_tps')->truncate();
            DB::table('temp_jawabantps')->truncate();
            DB::table('tugaspendahuluans')->truncate();
            DB::statement('SET FOREIGN_KEY_CHECKS=1;');

            return response()->json(['message' => 'Modul table and related data reset successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during the reset process.',
                'error' => $e->getMessage(),
            ], 500); // Server error
        }
    }

    public function updateStatus(Request $request)
    {
        $data = $request->all();

        if (empty($data)) {
            return response()->json([
                'message' => 'No data provided.',
            ], 400);
        }

        try {
            // Validasi input
            $validatedData = $request->validate([
                '*.id' => 'required|exists:moduls,id',
                '*.isUnlocked' => 'required|boolean',
            ]);

            // Ambil semua ID yang diberikan dalam request
            $ids = collect($validatedData)->pluck('id');

            // Ambil semua modul yang sesuai dengan ID yang diberikan
            $moduls = Modul::whereIn('id', $ids)->get();

            // Update status modul
            foreach ($moduls as $modul) {
                $item = collect($validatedData)->firstWhere('id', $modul->id);
                $modul->update([
                    'isUnlocked' => $item['isUnlocked'],
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Status modul berhasil diupdate.',
                'data' => $validatedData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengupdate status: '.$e->getMessage(),
            ], 500);
        }
    }

    public function bulkUpdate(Request $request)
    {
        // Validasi request
        $request->validate([
            '*.id' => 'required|integer',
            '*.isUnlocked' => 'required|integer|in:0,1',
        ]);

        // Update setiap modul
        foreach ($request->all() as $data) {
            $modul = Modul::find($data['id']);
            if ($modul) {
                $modul->update([
                    'isUnlocked' => $data['isUnlocked'],
                ]);
            }
        }

        return response()->json([
            'message' => 'Bulk update berhasil',
        ], 200);
    }
}
