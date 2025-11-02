<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Asisten;
use App\Models\LaporanPraktikan;
use App\Models\Nilai;
use App\Models\Praktikan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class PraktikanController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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

    public function setPraktikan(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'nim' => 'required|exists:praktikans,nim',
            'modul_id' => 'required|exists:moduls,id',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
            ], 400);
        }

        try {
            // Get the current logged in asisten (full user model)
            $asisten = Auth::user();
            $asisten_id = Auth::id();

            if (! $asisten) {
                return response()->json([
                    'success' => false,
                    'message' => 'Asisten not found for this user',
                ], 404);
            }

            // Get the praktikan by NIM
            $praktikan = Praktikan::where('nim', $request->nim)->first();

            if (! $praktikan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Praktikan with this NIM not found',
                ], 404);
            }

            $laporanPraktikan = LaporanPraktikan::where('praktikan_id', $praktikan->id)
                ->where('modul_id', $request->modul_id)
                ->first();

            if (! $laporanPraktikan) {
                return response()->json([
                    'success' => false,
                    'message' => 'No record found for this praktikan and modul combination',
                ], 404);
            }

            $nilai = Nilai::where('praktikan_id', $praktikan->id)
                ->where('modul_id', $request->modul_id)
                ->first();

            if ($nilai) {
                $nilai->asisten_id = $asisten->id;
                $nilai->updated_at = now();
                $nilai->save();
            }
            $laporanPraktikan->asisten_id = $asisten->id;
            $laporanPraktikan->pesan = 'pulled by '.$asisten->kode;
            $laporanPraktikan->updated_at = now();
            $laporanPraktikan->save();

            return response()->json([
                'success' => true,
                'message' => 'Praktikan successfully assigned to asisten',
                'data' => [
                    'laporan_praktikan' => $laporanPraktikan,
                    'nilai' => $nilai ?? null,
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while assigning praktikan',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAssignedPraktikan(Request $request): JsonResponse
    {
        $assistant = $request->user('asisten');

        if (! $assistant) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        try {
            $assignments = LaporanPraktikan::with([
                'praktikan.kelas',
                'modul',
            ])
                ->where('asisten_id', $assistant->id)
                ->latest('updated_at')
                ->get();

            if ($assignments->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'data' => [],
                    'message' => 'Belum ada praktikan yang ditarik.',
                ]);
            }

            $nilaiLookup = Nilai::where('asisten_id', $assistant->id)
                ->whereIn('praktikan_id', $assignments->pluck('praktikan_id'))
                ->whereIn('modul_id', $assignments->pluck('modul_id'))
                ->get()
                ->keyBy(fn (Nilai $nilai) => $nilai->praktikan_id.'-'.$nilai->modul_id);

            $data = $assignments->map(static function (LaporanPraktikan $assignment) use ($nilaiLookup) {
                $praktikan = $assignment->praktikan;
                $kelas = $praktikan?->kelas;
                $nilai = $nilaiLookup->get($assignment->praktikan_id.'-'.$assignment->modul_id);
                $timestamp = $assignment->updated_at ?? $assignment->created_at;

                return [
                    'id' => $assignment->id,
                    'pesan' => $assignment->pesan,
                    'rating_praktikum' => $assignment->rating_praktikum,
                    'rating_asisten' => $assignment->rating_asisten,
                    'timestamps' => [
                        'assigned_at' => optional($assignment->created_at)->toIso8601String(),
                        'updated_at' => optional($assignment->updated_at)->toIso8601String(),
                    ],
                    'datetime' => [
                        'date' => optional($timestamp)->toDateString(),
                        'time' => optional($timestamp)->format('H:i:s'),
                    ],
                    'modul' => [
                        'id' => $assignment->modul?->id,
                        'judul' => $assignment->modul?->judul,
                    ],
                    'praktikan' => [
                        'id' => $praktikan?->id,
                        'nama' => $praktikan?->nama,
                        'nim' => $praktikan?->nim,
                        'kelas' => $kelas ? [
                            'id' => $kelas->id,
                            'nama' => $kelas->kelas,
                            'hari' => $kelas->hari,
                            'shift' => $kelas->shift,
                        ] : null,
                    ],
                    'nilai' => $nilai ? [
                        'id' => $nilai->id,
                        'tp' => $nilai->tp,
                        'ta' => $nilai->ta,
                        'd1' => $nilai->d1,
                        'd2' => $nilai->d2,
                        'd3' => $nilai->d3,
                        'd4' => $nilai->d4,
                        'l1' => $nilai->l1,
                        'l2' => $nilai->l2,
                        'avg' => $nilai->avg,
                        'updated_at' => optional($nilai->updated_at)->toIso8601String(),
                    ] : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Throwable $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data praktikan.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the praktikan's password.
     */
    public function setPassword(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'nim' => 'required|exists:praktikans,nim',
            'password' => 'required|min:6',
        ], [
            'nim.required' => 'NIM harus diisi',
            'nim.exists' => 'NIM tidak ditemukan dalam database',
            'password.required' => 'Password baru harus diisi',
            'password.min' => 'Password baru minimal 6 karakter',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors(),
                ], 422);
            }

            return back()->withErrors($validator)->withInput();
        }

        try {
            // Find the praktikan by NIM
            $praktikan = Praktikan::where('nim', $request->nim)->first();

            if (! $praktikan) {
                if ($request->expectsJson()) {
                    return response()->json([
                        'message' => 'Praktikan tidak ditemukan',
                    ], 404);
                }

                return back()->with('error', 'Praktikan tidak ditemukan');
            }

            // Update the password
            $praktikan->password = Hash::make($request->password);
            $praktikan->save();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Password Praktikan berhasil diperbarui',
                ], 200);
            }

            return redirect()->back()->with('success', 'Password Praktikan berhasil diperbarui');
        } catch (\Exception $e) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Terjadi kesalahan saat memperbarui password',
                    'error' => $e->getMessage(),
                ], 500);
            }

            return back()->with('error', 'Terjadi kesalahan saat memperbarui password');
        }
    }

    /**
     * Change password of praktikan by themself
     */
    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        try {
            $praktikan = Praktikan::find(auth()->guard('praktikan')->user()->id);

            if (! $praktikan) {
                return redirect()->back()->withErrors([
                    'error' => 'Praktikan not found.',
                ]);
            }

            if (! Hash::check($request->current_password, $praktikan->password)) {
                return redirect()->back()->withErrors([
                    'current_password' => 'Password saat ini tidak sesuai',
                ]);
            }

            $praktikan->password = Hash::make($request->password);
            $praktikan->save();

            return redirect()->back()->with('success', 'Password berhasil diubah');
        } catch (\Exception $e) {
            // Since we're using Inertia, return a redirect with errors instead of JSON
            return redirect()->back()->withErrors([
                'error' => 'Gagal mengubah password: '.$e->getMessage(),
            ]);
        }
    }
}
