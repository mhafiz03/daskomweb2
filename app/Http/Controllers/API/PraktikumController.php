<?php

namespace App\Http\Controllers\API;

use App\Events\PraktikumProgressUpdated;
use App\Events\PraktikumStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Praktikum;
use App\Services\Praktikum\QuestionProgressService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PraktikumController extends Controller
{
    private const PHASE_SEQUENCE = [
        'preparation',
        'ta',
        'fitb_jurnal',
        'mandiri',
        'tk',
        'feedback',
    ];

    public function index(Request $request): JsonResponse
    {
        try {
            $praktikums = Praktikum::with(['modul', 'kelas', 'pj'])
                ->when($request->filled('kelas_id'), function ($query) use ($request) {
                    $query->where('kelas_id', $request->input('kelas_id'));
                })
                ->when($request->filled('modul_id'), function ($query) use ($request) {
                    $query->where('modul_id', $request->input('modul_id'));
                })
                ->orderBy('kelas_id')
                ->orderBy('modul_id')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Praktikum retrieved successfully.',
                'data' => $praktikums,
                'phases' => self::PHASE_SEQUENCE,
            ]);
        } catch (\Throwable $th) {
            return $this->respondWithServerError($th);
        }
    }

    public function show(Request $request, int $kelasId): JsonResponse
    {
        try {
            $praktikums = Praktikum::with(['modul', 'kelas', 'pj'])
                ->where('kelas_id', $kelasId)
                ->when($request->filled('modul_id'), function ($query) use ($request) {
                    $query->where('modul_id', $request->input('modul_id'));
                })
                ->orderBy('modul_id')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'Praktikum retrieved successfully.',
                'data' => $praktikums,
                'phases' => self::PHASE_SEQUENCE,
            ]);
        } catch (\Throwable $th) {
            return $this->respondWithServerError($th);
        }
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kelas_id' => 'required|exists:kelas,id',
            'modul_id' => 'required|exists:moduls,id',
        ]);

        $praktikum = Praktikum::firstOrCreate(
            [
                'kelas_id' => $validated['kelas_id'],
                'modul_id' => $validated['modul_id'],
            ],
            [
                'status' => 'idle',
                'current_phase' => self::PHASE_SEQUENCE[0],
                'isActive' => false,
                'started_at' => null,
                'ended_at' => null,
                'report_notes' => null,
                'report_submitted_at' => null,
                'pj_id' => null,
            ]
        );

        $praktikum->load(['modul', 'kelas', 'pj']);

        return response()->json([
            'status' => 'success',
            'message' => $praktikum->wasRecentlyCreated
                ? 'Praktikum created successfully.'
                : 'Praktikum already exists.',
            'data' => $praktikum,
        ], $praktikum->wasRecentlyCreated ? 201 : 200);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'action' => 'required|string|in:start,pause,resume,next,exit,report',
            'phase' => 'nullable|string',
            'report_notes' => 'required_if:action,report|string|min:3|max:65535',
        ]);

        $phase = $validated['phase'] ?? null;
        if ($phase !== null && ! in_array($phase, self::PHASE_SEQUENCE, true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Phase is not valid.',
            ], 422);
        }

        $praktikum = Praktikum::with(['modul', 'kelas', 'pj'])->find($id);

        if (! $praktikum) {
            return response()->json([
                'status' => 'error',
                'message' => 'Praktikum not found.',
            ], 404);
        }

        $now = Carbon::now();

        $pjId = null;
        if ($validated['action'] === 'report') {
            $pjId = optional($request->user('asisten'))->id ?? optional(Auth::user())->id ?? null;
        }

        try {
            switch ($validated['action']) {
                case 'start':
                    $this->handleStart($praktikum, $phase ?? self::PHASE_SEQUENCE[0], $now);
                    break;
                case 'pause':
                    $this->handlePause($praktikum, $now);
                    break;
                case 'resume':
                    $this->handleResume($praktikum, $now);
                    break;
                case 'next':
                    $this->handleNext($praktikum, $phase, $now);
                    break;
                case 'exit':
                    $this->handleExit($praktikum, $now);
                    break;
                case 'report':
                    $this->handleReport($praktikum, $validated['report_notes'], $now, $pjId);
                    break;
            }
        } catch (\InvalidArgumentException $exception) {
            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage(),
            ], 422);
        } catch (\Throwable $th) {
            return $this->respondWithServerError($th);
        }

        $praktikum = $praktikum->fresh(['modul', 'kelas', 'pj']);
        broadcast(new PraktikumStatusUpdated($praktikum));

        $progressService = app(QuestionProgressService::class);
        $progressPayload = $progressService->buildForPraktikum($praktikum);
        broadcast(new PraktikumProgressUpdated($praktikum->id, $progressPayload));

        return response()->json([
            'status' => 'success',
            'message' => 'Praktikum updated successfully.',
            'data' => $praktikum,
            'phases' => self::PHASE_SEQUENCE,
        ]);
    }

    private function handleStart(Praktikum $praktikum, string $phase, Carbon $now): void
    {
        // Check if there's already a running praktikum for the same kelas
        $runningPraktikum = Praktikum::where('kelas_id', $praktikum->kelas_id)
            ->where('id', '!=', $praktikum->id)
            ->whereIn('status', ['running', 'paused'])
            ->first();

        if ($runningPraktikum) {
            throw new \InvalidArgumentException(
                'Tidak dapat memulai praktikum. Terdapat praktikum lain yang sedang berjalan untuk kelas ini.'
            );
        }

        $praktikum->isActive = true;
        $praktikum->status = 'running';
        $praktikum->current_phase = $phase;
        $praktikum->started_at = $now;
        $praktikum->ended_at = null;
        $praktikum->report_notes = null;
        $praktikum->report_submitted_at = null;
        $praktikum->pj_id = optional(Auth::user())->id;
        $praktikum->save();
    }

    private function handlePause(Praktikum $praktikum, Carbon $now): void
    {
        if ($praktikum->status !== 'running') {
            throw new \InvalidArgumentException('Praktikum is not running.');
        }

        $praktikum->status = 'paused';
        $praktikum->isActive = false;
        $praktikum->ended_at = $now;
        $praktikum->save();
    }

    private function handleResume(Praktikum $praktikum, Carbon $now): void
    {
        if ($praktikum->status !== 'paused') {
            throw new \InvalidArgumentException('Praktikum is not paused.');
        }

        $elapsed = 0;
        if ($praktikum->started_at) {
            $reference = $praktikum->ended_at ?? $now;
            $elapsed = max(0, $praktikum->started_at->diffInSeconds($reference));
        }

        $praktikum->status = 'running';
        $praktikum->isActive = true;
        $praktikum->started_at = $now->copy()->subSeconds($elapsed);
        $praktikum->ended_at = null;
        $praktikum->save();
    }

    private function handleNext(Praktikum $praktikum, ?string $phase, Carbon $now): void
    {
        // If phase is explicitly provided, use it (for frontend control)
        if ($phase !== null) {
            $nextIndex = array_search($phase, self::PHASE_SEQUENCE, true);

            if ($nextIndex === false) {
                throw new \InvalidArgumentException('Invalid phase provided.');
            }

            $isLastPhase = $nextIndex === count(self::PHASE_SEQUENCE) - 1;

            if ($isLastPhase) {
                $praktikum->status = 'completed';
                $praktikum->isActive = false;
                $praktikum->ended_at = $now;
                $praktikum->current_phase = $phase;
            } else {
                $praktikum->current_phase = $phase;
                $praktikum->status = 'running';
                $praktikum->isActive = true;
                if ($praktikum->started_at) {
                    $reference = $praktikum->ended_at ?? $now;
                    $elapsed = max(0, $praktikum->started_at->diffInSeconds($reference));
                    $praktikum->started_at = $now->copy()->subSeconds($elapsed);
                }
                $praktikum->ended_at = null;
            }
        } else {
            // Fallback to auto-calculating next phase
            $currentPhase = $praktikum->current_phase ?? self::PHASE_SEQUENCE[0];
            $currentIndex = array_search($currentPhase, self::PHASE_SEQUENCE, true);

            if ($currentIndex === false) {
                throw new \InvalidArgumentException('Current phase is invalid.');
            }

            $isLastPhase = $currentIndex === count(self::PHASE_SEQUENCE) - 1;

            if ($isLastPhase) {
                $praktikum->status = 'completed';
                $praktikum->isActive = false;
                $praktikum->ended_at = $now;
            } else {
                $praktikum->current_phase = self::PHASE_SEQUENCE[$currentIndex + 1];
                $praktikum->status = 'running';
                $praktikum->isActive = true;
                if ($praktikum->started_at) {
                    $reference = $praktikum->ended_at ?? $now;
                    $elapsed = max(0, $praktikum->started_at->diffInSeconds($reference));
                    $praktikum->started_at = $now->copy()->subSeconds($elapsed);
                }
                $praktikum->ended_at = null;
            }
        }

        $praktikum->save();
    }

    private function handleExit(Praktikum $praktikum, Carbon $now): void
    {
        $praktikum->status = 'exited';
        $praktikum->isActive = false;
        $praktikum->ended_at = $now;
        $praktikum->save();
    }

    private function handleReport(Praktikum $praktikum, string $notes, Carbon $now, ?int $pjId): void
    {
        if ($praktikum->status !== 'completed') {
            throw new \InvalidArgumentException('Laporan hanya dapat diisi setelah praktikum selesai.');
        }

        $trimmedNotes = trim($notes);

        if ($trimmedNotes === '') {
            throw new \InvalidArgumentException('Isi laporan tidak boleh kosong.');
        }

        $praktikum->report_notes = $trimmedNotes;
        $praktikum->report_submitted_at = $now;
        $praktikum->pj_id = $pjId;
        $praktikum->save();
    }

    public function checkPraktikum(Request $request): JsonResponse
    {
        try {
            $user = $request->user('praktikan');

            if (! $user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. Praktikan not authenticated.',
                ], 401);
            }

            $kelasId = $user->kelas_id;

            if (! $kelasId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Praktikan does not have an assigned kelas.',
                ], 400);
            }

            $activePraktikum = Praktikum::with(['modul', 'kelas', 'pj'])
                ->where('kelas_id', $kelasId)
                ->where('isActive', true)
                ->whereIn('status', ['running', 'paused'])
                ->first();

            return response()->json([
                'status' => 'success',
                'message' => $activePraktikum
                    ? 'Active praktikum found.'
                    : 'No active praktikum for this kelas.',
                'data' => $activePraktikum,
                'phases' => self::PHASE_SEQUENCE,
            ]);
        } catch (\Throwable $th) {
            return $this->respondWithServerError($th);
        }
    }

    public function history(Request $request): JsonResponse
    {
        try {
            $praktikums = Praktikum::with(['modul', 'kelas', 'pj'])
                ->whereNotNull('report_notes')
                ->when($request->filled('kelas_id'), function ($query) use ($request) {
                    $query->where('kelas_id', $request->input('kelas_id'));
                })
                ->when($request->filled('modul_id'), function ($query) use ($request) {
                    $query->where('modul_id', $request->input('modul_id'));
                })
                ->orderByDesc('report_submitted_at')
                ->orderByDesc('updated_at')
                ->get();

            return response()->json([
                'status' => 'success',
                'message' => 'History retrieved successfully.',
                'data' => $praktikums,
            ]);
        } catch (\Throwable $th) {
            return $this->respondWithServerError($th);
        }
    }

    private function respondWithServerError(\Throwable $throwable): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred while processing the request.',
            'error' => $throwable->getMessage(),
        ], 500);
    }
}
