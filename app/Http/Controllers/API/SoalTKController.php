<?php

namespace App\Http\Controllers\API;

use App\Models\SoalTk;
use App\Models\Modul;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;

class SoalTKController extends Controller
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
    public function store(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'pengantar'      => 'nullable|string|max:1000',
                'kodingan'       => 'nullable|string|max:1000',
                'pertanyaan'     => [
                    'required',
                    'string',
                    'max:1000',
                    Rule::unique('soal_tks', 'pertanyaan')->where(fn($q) => $q->where('modul_id', $id))
                ],
                'jawaban_benar'  => 'required|string|max:1000',
                'jawaban_salah1' => 'required|string|max:1000',
                'jawaban_salah2' => 'required|string|max:1000',
                'jawaban_salah3' => 'required|string|max:1000',
            ]);

            $validated['pengantar'] = $validated['pengantar'] ?? 'empty';
            $validated['kodingan']  = $validated['kodingan']  ?? 'empty';
            $soal = SoalTk::create($validated + ['modul_id' => $id]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'id'            => $soal->id,
                    'pengantar'     => $soal->pengantar,
                    'kodingan'      => $soal->kodingan,
                    'pertanyaan'    => $soal->pertanyaan,
                    'modul_id'      => $id,
                    'jawaban_benar' => $soal->jawaban_benar,
                    'jawaban'       => [
                        $soal->jawaban_salah1,
                        $soal->jawaban_salah2,
                        $soal->jawaban_salah3,
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            // Menangani kesalahan yang terjadi pada proses penyimpanan
            return response()->json([
                "message" => "Terjadi kesalahan saat menyimpan soal.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function show($modul_id)
    {
        try {
            $modul = Modul::find($modul_id);
            if (!$modul) {
                return response()->json([
                    "message" => "Modul dengan ID $modul_id tidak ditemukan.",
                ], 404);
            }

            $user = auth('praktikan')->user();
            $soalQuery = SoalTk::where('modul_id', $modul_id);

            if ($user) { // for praktikan (10 questions) and also tot accounts (all quesntions)
                $isTOT = substr($user->kelas->kelas, 0, 3) === 'TOT';
                $soals = $isTOT ? $soalQuery->get() : $soalQuery->inRandomOrder()->take(10)->get();

                $data = $soals->map(function ($soal) {
                    $jawaban = [
                        $soal->jawaban_benar,
                        $soal->jawaban_salah1,
                        $soal->jawaban_salah2,
                        $soal->jawaban_salah3,
                    ];
                    shuffle($jawaban);
                    return [
                        'id' => $soal->id,
                        'pengantar' => $soal->pengantar,
                        'kodingan' => $soal->kodingan,
                        'pertanyaan' => $soal->pertanyaan,
                        'modul_id' => $soal->modul_id,
                        'soal' => $jawaban,
                    ];
                });
            } else { // for assistant
                $soals = $soalQuery->get();
                $data = $soals->map(function ($soal) {
                    return [
                        'id' => $soal->id,
                        'pengantar' => $soal->pengantar,
                        'kodingan' => $soal->kodingan,
                        'pertanyaan' => $soal->pertanyaan,
                        'modul_id' => $soal->modul_id,
                        'jawaban_benar' => $soal->jawaban_benar,
                        'jawaban' => [
                            $soal->jawaban_salah1,
                            $soal->jawaban_salah2,
                            $soal->jawaban_salah3,
                        ],
                    ];
                });
            }

            return response()->json([
                "message" => "Soal retrieved successfully.",
                "data" => $data,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Terjadi kesalahan saat mengambil soal.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $soal = SoalTk::find($id);
            if (!$soal)
                return response()->json(['message' => "Soal dengan ID $id tidak ditemukan."], 404);

            // If modul_id may change, use the incoming one for the unique scope; otherwise fall back to current
            $modulId = $request->input('modul_id', $soal->modul_id);
            $validated = $request->validate([
                'modul_id'        => ['required', 'integer', 'exists:moduls,id'],
                'pengantar'       => ['nullable', 'string', 'max:255'],
                'kodingan'        => ['nullable', 'string', 'max:1000'],
                'pertanyaan'      => [
                    'required',
                    'string',
                    'max:500',
                    Rule::unique('soal_tks', 'pertanyaan')->where(fn($q) => $q->where('modul_id', $modulId))->ignore($soal->id),
                ],
                'jawaban_benar'   => ['required', 'string', 'max:255'],
                'jawaban_salah1'  => ['required', 'string', 'max:255'],
                'jawaban_salah2'  => ['required', 'string', 'max:255'],
                'jawaban_salah3'  => ['required', 'string', 'max:255'],
            ]);

            $validated['pengantar'] = $validated['pengantar'] ?? 'empty';
            $validated['kodingan']  = $validated['kodingan']  ?? 'empty';
            $validated['modul_id'] = $modulId;
            $soal->fill($validated)->save();
            return response()->json([
                'status' => 'success',
                'data'   => [
                    'id'            => $soal->id,
                    'pengantar'     => $soal->pengantar,
                    'kodingan'      => $soal->kodingan,
                    'pertanyaan'    => $soal->pertanyaan,
                    'modul_id'      => $soal->modul_id,
                    'jawaban_benar' => $soal->jawaban_benar,
                    'jawaban'       => [
                        $soal->jawaban_salah1,
                        $soal->jawaban_salah2,
                        $soal->jawaban_salah3,
                    ],
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Terjadi kesalahan saat memperbarui soal.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            // Cek apakah soal ada
            $soal = SoalTk::find($id);
            if (!$soal) {
                return response()->json([
                    "message" => "Soal dengan ID $id tidak ditemukan.",
                ], 404);
            }
            // Hapus soal
            $soal->delete();
            return response()->json([
                "status" => "success",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Terjadi kesalahan saat menghapus soal.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }

    public function reset()
    {
        try {
            SoalTk::truncate();
            return response()->json([
                "status" => "success",
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Terjadi kesalahan saat mereset soal.",
                "error" => $e->getMessage(),
            ], 500);
        }
    }
}
