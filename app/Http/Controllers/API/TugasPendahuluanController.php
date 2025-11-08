<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use App\Models\Modul;
use App\Models\Tugaspendahuluan;
use Illuminate\Http\Request;

class TugasPendahuluanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            // Ambil data tugas pendahuluan dengan join ke tabel modul
            $tugas = Tugaspendahuluan::leftJoin('moduls', 'moduls.id', '=', 'tugaspendahuluans.modul_id')
                ->select('tugaspendahuluans.*', 'moduls.judul as nama_modul', 'moduls.isEnglish as modul_is_english')
                ->get();

            if ($tugas->isEmpty()) {
                $modules = Modul::select('id')->get();

                foreach ($modules as $module) {
                    Tugaspendahuluan::firstOrCreate(
                        ['modul_id' => $module->id],
                        [
                            'pembahasan' => 'empty',
                            'isActive' => 0,
                        ]
                    );
                }

                $tugas = Tugaspendahuluan::leftJoin('moduls', 'moduls.id', '=', 'tugaspendahuluans.modul_id')
                    ->select('tugaspendahuluans.*', 'moduls.judul as nama_modul', 'moduls.isEnglish as modul_is_english')
                    ->get();
            }

            $configuration = Configuration::select(
                'id',
                'tp_activation',
                'tp_schedule_enabled',
                'tp_schedule_start_at',
                'tp_schedule_end_at'
            )->first();
            if ($configuration) {
                $configuration->refreshTpActivationFromSchedule();
            }
            $tpActive = $configuration ? (bool) $configuration->tp_activation : true;

            $activeRegular = $tugas->first(function ($item) {
                return (int) ($item->isActive ?? 0) === 1 && (int) ($item->modul_is_english ?? 0) !== 1;
            });

            $activeEnglish = $tugas->first(function ($item) {
                return (int) ($item->isActive ?? 0) === 1 && (int) ($item->modul_is_english ?? 0) === 1;
            });

            return response()->json([
                'status' => 'success',
                'data' => $tugas,
                'meta' => [
                    'tp_active' => $tpActive,
                    'active_regular_modul_id' => $activeRegular->modul_id ?? null,
                    'active_english_modul_id' => $activeEnglish->modul_id ?? null,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengambil data tugas.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        // Validasi input
        $request->validate([
            'data' => 'required|array',
            'data.*.id' => 'required|integer|exists:tugaspendahuluans,id',
            'data.*.isActive' => 'required|integer|in:0,1',
        ]);

        try {
            $updatedTugas = [];
            foreach ($request->data as $item) {
                $tugas = Tugaspendahuluan::find($item['id']);

                if (! $tugas) {
                    return response()->json([
                        'message' => "Tugas dengan ID {$item['id']} tidak ditemukan.",
                    ], 404);
                }

                // Update status isActive
                $tugas->isActive = $item['isActive'];
                $tugas->updated_at = now();
                $tugas->save();

                $updatedTugas[] = $tugas;
            }

            return response()->json([
                'status' => 'success',
                'data' => $updatedTugas,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat mengupdate tugas.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
