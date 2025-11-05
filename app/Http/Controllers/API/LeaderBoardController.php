<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LeaderBoardController extends Controller
{
    private function buildLeaderboardQuery(?int $kelasId = null): Builder
    {
        $query = DB::table('praktikans')
            ->leftJoin('nilais', 'praktikans.id', '=', 'nilais.praktikan_id')
            ->leftJoin('kelas', 'praktikans.kelas_id', '=', 'kelas.id')
            ->select([
                'praktikans.id as praktikan_id',
                'praktikans.nama as praktikan_name',
                'praktikans.nim as praktikan_nim',
                'kelas.kelas as kelas_name',
            ])
            ->selectRaw('AVG(nilais.avg) as average_nilai')
            ->selectRaw('AVG(nilais.rating) as average_rating')
            ->selectRaw('COUNT(nilais.id) as nilai_count')
            ->selectRaw('COUNT(CASE WHEN nilais.rating IS NOT NULL THEN 1 END) as rating_count')
            ->selectRaw('MAX(nilais.updated_at) as last_submitted_at')
            ->groupBy('praktikans.id', 'praktikans.nama', 'praktikans.nim', 'kelas.kelas');

        if ($kelasId) {
            $query->where('praktikans.kelas_id', $kelasId);
        }

        return $query
            ->havingRaw('COUNT(nilais.id) > 0')
            ->orderByDesc('average_nilai')
            ->orderByDesc('average_rating')
            ->orderByDesc('rating_count')
            ->orderBy('praktikans.nama');
    }

    private function formatLeaderboard(Collection $rows): Collection
    {
        return $rows->map(static function ($row) {
            $averageNilai = $row->average_nilai !== null ? round((float) $row->average_nilai, 2) : null;
            $averageRating = $row->average_rating !== null ? round((float) $row->average_rating, 2) : null;

            return [
                'praktikan_id' => (int) $row->praktikan_id,
                'nama' => $row->praktikan_name,
                'nim' => $row->praktikan_nim,
                'kelas' => $row->kelas_name,
                'average_nilai' => $averageNilai,
                'average_rating' => $averageRating,
                'nilai_count' => (int) $row->nilai_count,
                'rating_count' => (int) $row->rating_count,
                'last_submitted_at' => $row->last_submitted_at,
            ];
        })->values();
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kelas_id' => ['nullable', 'integer', 'exists:kelas,id'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:200'],
        ]);

        $query = $this->buildLeaderboardQuery($validated['kelas_id'] ?? null);

        if (! empty($validated['limit'])) {
            $query->limit((int) $validated['limit']);
        }

        $leaderboard = $this->formatLeaderboard($query->get());

        return response()->json([
            'status' => 'success',
            'leaderboard' => $leaderboard,
            'message' => 'Leaderboard retrieved successfully.',
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'limit' => ['nullable', 'integer', 'min:1', 'max:200'],
        ]);

        $query = $this->buildLeaderboardQuery($id);

        if (! empty($validated['limit'])) {
            $query->limit((int) $validated['limit']);
        }

        $leaderboard = $this->formatLeaderboard($query->get());

        if ($leaderboard->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Tidak ada data untuk kelas dengan ID ini.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'leaderboard' => $leaderboard,
            'message' => 'Leaderboard retrieved successfully.',
        ]);
    }
}
