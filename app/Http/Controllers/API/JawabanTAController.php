<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JawabanTa;
use App\Models\Modul;
use App\Models\SoalOpsi;
use App\Models\SoalTa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JawabanTAController extends Controller
{
    public function index(): void {}

    public function showAsisten(int $praktikanId, int $modulId): JsonResponse
    {
        try {
            $jawaban = JawabanTa::with(['soal_ta.options'])
                ->where('praktikan_id', $praktikanId)
                ->where('modul_id', $modulId)
                ->get();

            $data = $jawaban
                ->map(function (JawabanTa $item) {
                    $soal = $item->soal_ta;
                    $options = $soal?->options
                        ? $soal->options
                            ->map(fn (SoalOpsi $opsi) => [
                                'id' => $opsi->id,
                                'text' => $opsi->text,
                                'is_correct' => $opsi->id === $soal->opsi_benar_id,
                            ])
                            ->values()
                            ->all()
                        : [];

                    return [
                        'soal_id' => $item->soal_id,
                        'pertanyaan' => $soal?->pertanyaan,
                        'selected_opsi_id' => $item->opsi_id,
                        'opsi_benar_id' => $soal?->opsi_benar_id,
                        'options' => $options,
                    ];
                })
                ->values();

            return response()->json([
                'success' => true,
                'jawaban_ta' => $data,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengambil data jawaban.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['required', 'integer'],
            'modul_id' => ['required', 'integer'],
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.soal_id' => ['required', 'integer', 'exists:soal_tas,id'],
            'answers.*.opsi_id' => ['required', 'integer', 'exists:soal_opsis,id'],
        ]);

        $praktikanId = (int) $validated['praktikan_id'];
        $modulId = (int) $validated['modul_id'];

        try {
            DB::transaction(function () use ($validated, $praktikanId, $modulId) {
                JawabanTa::where('praktikan_id', $praktikanId)
                    ->where('modul_id', $modulId)
                    ->delete();

                foreach ($validated['answers'] as $index => $answer) {
                    /** @var SoalTa|null $soal */
                    $soal = SoalTa::with('options')->find($answer['soal_id']);

                    if (! $soal || $soal->modul_id !== $modulId) {
                        throw ValidationException::withMessages([
                            "answers.{$index}.soal_id" => 'Soal tidak valid untuk modul ini.',
                        ]);
                    }

                    $option = $soal->options->firstWhere('id', $answer['opsi_id']);
                    if (! $option || $option->soal_type !== SoalOpsi::TYPE_TA) {
                        throw ValidationException::withMessages([
                            "answers.{$index}.opsi_id" => 'Opsi tidak valid untuk soal ini.',
                        ]);
                    }

                    JawabanTa::create([
                        'praktikan_id' => $praktikanId,
                        'modul_id' => $modulId,
                        'soal_id' => $soal->id,
                        'opsi_id' => $option->id,
                    ]);
                }
            });

            $jawaban = JawabanTa::with('soal_ta')
                ->where('praktikan_id', $praktikanId)
                ->where('modul_id', $modulId)
                ->get();

            $correct = $jawaban->filter(fn (JawabanTa $item) => $item->opsi_id === $item->soal_ta?->opsi_benar_id)->count();
            $nilai = $jawaban->isNotEmpty() ? ($correct / $jawaban->count()) * 100 : 0;

            return response()->json([
                'status' => 'success',
                'nilai_ta' => $nilai,
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan jawaban TA.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function score(int $praktikanId, int $modulId): JsonResponse
    {
        $praktikan = auth('praktikan')->user();

        if (! $praktikan || $praktikan->id !== $praktikanId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak diizinkan mengakses nilai modul ini.',
            ], 403);
        }

        try {
            $totalQuestions = SoalTa::where('modul_id', $modulId)->count();

            if ($totalQuestions === 0) {
                return response()->json([
                    'status' => 'success',
                    'score' => 0,
                    'correct_answers' => 0,
                    'total_questions' => 0,
                ]);
            }

            $jawaban = JawabanTa::with('soal_ta')
                ->where('praktikan_id', $praktikanId)
                ->where('modul_id', $modulId)
                ->get();

            $correctAnswers = $jawaban
                ->filter(fn (JawabanTa $item) => $item->soal_ta && $item->opsi_id === $item->soal_ta->opsi_benar_id)
                ->count();

            $score = $correctAnswers > 0
                ? round(($correctAnswers / $totalQuestions) * 100, 2)
                : 0;

            return response()->json([
                'status' => 'success',
                'score' => $score,
                'correct_answers' => $correctAnswers,
                'total_questions' => $totalQuestions,
            ]);
        } catch (\Throwable $e) {
            report($e);

            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghitung nilai TA.',
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $modul = Modul::findOrFail($id);

            if (! $modul->isUnlocked) {
                return response()->json([
                    'status' => 'success',
                    'messages' => 'Jawaban Masih Terkunci',
                ]);
            }

            $praktikan = auth('praktikan')->user();

            if (! $praktikan) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized.',
                ], 401);
            }

            $jawaban = JawabanTa::with(['soal_ta.options'])
                ->where('praktikan_id', $praktikan->id)
                ->where('modul_id', $id)
                ->get();

            if ($jawaban->isEmpty()) {
                return response()->json([
                    'message' => 'Tidak ada jawaban',
                ]);
            }

            $data = $jawaban->map(function (JawabanTa $item) {
                $soal = $item->soal_ta;
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
                'jawaban_ta' => $data,
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
