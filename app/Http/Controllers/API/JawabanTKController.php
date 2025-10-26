<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JawabanTk;
use App\Models\Modul;
use App\Models\SoalOpsi;
use App\Models\SoalTk;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JawabanTKController extends Controller
{
    public function index(): void {}

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['required', 'integer'],
            'modul_id' => ['required', 'integer'],
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.soal_id' => ['required', 'integer', 'exists:soal_tks,id'],
            'answers.*.opsi_id' => ['required', 'integer', 'exists:soal_opsis,id'],
        ]);

        $praktikanId = (int) $validated['praktikan_id'];
        $modulId = (int) $validated['modul_id'];

        try {
            DB::transaction(function () use ($validated, $praktikanId, $modulId) {
                JawabanTk::where('praktikan_id', $praktikanId)
                    ->where('modul_id', $modulId)
                    ->delete();

                foreach ($validated['answers'] as $index => $answer) {
                    $soal = SoalTk::with('options')->find($answer['soal_id']);

                    if (!$soal || $soal->modul_id !== $modulId) {
                        throw ValidationException::withMessages([
                            "answers.{$index}.soal_id" => 'Soal tidak valid untuk modul ini.',
                        ]);
                    }

                    $option = $soal->options->firstWhere('id', $answer['opsi_id']);
                    if (!$option || $option->soal_type !== SoalOpsi::TYPE_TK) {
                        throw ValidationException::withMessages([
                            "answers.{$index}.opsi_id" => 'Opsi tidak valid untuk soal ini.',
                        ]);
                    }

                    JawabanTk::create([
                        'praktikan_id' => $praktikanId,
                        'modul_id' => $modulId,
                        'soal_id' => $soal->id,
                        'opsi_id' => $option->id,
                    ]);
                }
            });

            $jawaban = JawabanTk::with('soal_tk')
                ->where('praktikan_id', $praktikanId)
                ->where('modul_id', $modulId)
                ->get();

            $correct = $jawaban->filter(fn (JawabanTk $item) => $item->opsi_id === $item->soal_tk?->opsi_benar_id)->count();
            $nilai = $jawaban->isNotEmpty() ? ($correct / $jawaban->count()) * 100 : 0;

            return response()->json([
                'status' => 'success',
                'nilai_tk' => $nilai,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data jawaban TK.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $modulId): JsonResponse
    {
        try {
            $modul = Modul::findOrFail($modulId);

            if (!$modul->isUnlocked) {
                return response()->json([
                    'status' => 'locked',
                    'message' => 'Jawaban masih terkunci.',
                ], 403);
            }

            $jawaban = JawabanTk::with(['soal_tk.options'])
                ->where('praktikan_id', auth('sanctum')->id())
                ->where('modul_id', $modulId)
                ->get();

            if ($jawaban->isEmpty()) {
                return response()->json([
                    'status' => 'not_found',
                    'message' => 'Tidak ada jawaban untuk modul ini.',
                ], 404);
            }

            $data = $jawaban->map(function (JawabanTk $item) {
                $soal = $item->soal_tk;
                $options = $soal?->options->map(fn (SoalOpsi $opsi) => [
                    'id' => $opsi->id,
                    'text' => $opsi->text,
                    'is_correct' => $opsi->id === $soal->opsi_benar_id,
                ]);

                return [
                    'soal_id' => $item->soal_id,
                    'pertanyaan' => $soal?->pertanyaan,
                    'selected_opsi_id' => $item->opsi_id,
                    'opsi_benar_id' => $soal?->opsi_benar_id,
                    'options' => $options,
                ];
            });

            return response()->json([
                'status' => 'success',
                'jawaban_tk' => $data,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data jawaban.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
