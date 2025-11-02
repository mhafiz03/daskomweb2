<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Cache\Repository as CacheRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;
use Illuminate\Validation\Rule;

class AutosaveSnapshotController extends Controller
{
    private const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 30;

    private const QUESTION_TTL_SECONDS = 60 * 60 * 24;

    private const SUPPORTED_SOAL_TYPES = [
        'ta',
        'tk',
        'jurnal',
        'fitb',
        'mandiri',
        'tm',
        'tp',
    ];

    private string $cacheStore;

    public function __construct()
    {
        $this->cacheStore = (string) config('cache.snapshot_store', 'redis');
    }

    private function cache(): CacheRepository
    {
        return Cache::store($this->cacheStore);
    }

    private function cacheKey(int $praktikanId, int $modulId, string $tipeSoal): string
    {
        return "autosave_snapshot:{$praktikanId}:{$modulId}:{$tipeSoal}";
    }

    private function cachePattern(int $praktikanId, ?int $modulId = null, ?string $tipeSoal = null): string
    {
        if ($modulId === null) {
            return $tipeSoal
                ? "autosave_snapshot:{$praktikanId}:*:{$tipeSoal}"
                : "autosave_snapshot:{$praktikanId}:*";
        }

        if ($tipeSoal !== null) {
            return "autosave_snapshot:{$praktikanId}:{$modulId}:{$tipeSoal}";
        }

        return "autosave_snapshot:{$praktikanId}:{$modulId}:*";
    }

    private function getRedisKeys(string $pattern): array
    {
        if ($this->cacheStore !== 'redis') {
            return [];
        }

        try {
            $redis = Redis::connection('cache');
            $keys = $redis->keys($pattern);

            $prefix = config('database.redis.options.prefix', '');
            if ($prefix === '' || empty($keys)) {
                return $keys;
            }

            return array_map(static function (string $key) use ($prefix) {
                if (str_starts_with($key, $prefix)) {
                    return substr($key, strlen($prefix));
                }

                return $key;
            }, $keys);
        } catch (\Throwable $exception) {
            report($exception);

            return [];
        }
    }

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['nullable', 'integer'],
            'modul_id' => ['nullable', 'integer'],
            'tipe_soal' => ['nullable', 'string'],
        ]);

        $praktikanId = $validated['praktikan_id'] ?? null;
        $modulId = $validated['modul_id'] ?? null;
        $tipeSoal = $validated['tipe_soal'] ?? null;

        $cache = $this->cache();
        $snapshots = [];

        if ($praktikanId && $modulId && $tipeSoal) {
            $key = $this->cacheKey($praktikanId, $modulId, $tipeSoal);
            $snapshot = $cache->get($key);

            if ($snapshot !== null) {
                $snapshots[] = $snapshot;
            }

            return response()->json([
                'success' => true,
                'data' => $snapshots,
            ]);
        }

        if ($praktikanId && $modulId) {
            $pattern = $this->cachePattern($praktikanId, $modulId);
            $keys = $this->getRedisKeys($pattern);

            foreach ($keys as $key) {
                $snapshot = $cache->get($key);
                if ($snapshot !== null) {
                    $snapshots[] = $snapshot;
                }
            }

            return response()->json([
                'success' => true,
                'data' => $snapshots,
            ]);
        }

        if ($praktikanId) {
            $pattern = $this->cachePattern($praktikanId);
            $keys = $this->getRedisKeys($pattern);

            foreach ($keys as $key) {
                $snapshot = $cache->get($key);
                if ($snapshot !== null) {
                    $snapshots[] = $snapshot;
                }
            }

            return response()->json([
                'success' => true,
                'data' => $snapshots,
            ]);
        }

        $keys = $this->getRedisKeys('autosave_snapshot:*');
        foreach ($keys as $key) {
            $snapshot = $cache->get($key);
            if ($snapshot !== null) {
                $snapshots[] = $snapshot;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $snapshots,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['required', 'integer', 'exists:praktikans,id'],
            'modul_id' => ['required', 'integer', 'exists:moduls,id'],
            'tipe_soal' => ['required', Rule::in(self::SUPPORTED_SOAL_TYPES)],
            'jawaban' => ['required', 'array'],
        ]);

        $cache = $this->cache();
        $key = $this->cacheKey(
            (int) $validated['praktikan_id'],
            (int) $validated['modul_id'],
            $validated['tipe_soal']
        );

        $existing = $cache->get($key);
        $timestamp = Carbon::now()->toISOString();

        $payload = [
            'praktikan_id' => (int) $validated['praktikan_id'],
            'modul_id' => (int) $validated['modul_id'],
            'tipe_soal' => $validated['tipe_soal'],
            'jawaban' => $validated['jawaban'],
            'updated_at' => $timestamp,
            'created_at' => $existing['created_at'] ?? $timestamp,
        ];

        $ttl = (int) config('cache.snapshot_ttl', self::DEFAULT_TTL_SECONDS);
        $cache->put($key, $payload, $ttl);

        return response()->json([
            'success' => true,
            'data' => $payload,
        ]);
    }

    public function bulkUpsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.praktikan_id' => ['required', 'integer', 'exists:praktikans,id'],
            'items.*.modul_id' => ['required', 'integer', 'exists:moduls,id'],
            'items.*.tipe_soal' => ['required', Rule::in(self::SUPPORTED_SOAL_TYPES)],
            'items.*.jawaban' => ['required', 'array'],
        ]);

        $cache = $this->cache();
        $ttl = (int) config('cache.snapshot_ttl', self::DEFAULT_TTL_SECONDS);
        $timestamp = Carbon::now()->toISOString();

        foreach ($validated['items'] as $item) {
            $key = $this->cacheKey(
                (int) $item['praktikan_id'],
                (int) $item['modul_id'],
                $item['tipe_soal']
            );

            $existing = $cache->get($key);

            $payload = [
                'praktikan_id' => (int) $item['praktikan_id'],
                'modul_id' => (int) $item['modul_id'],
                'tipe_soal' => $item['tipe_soal'],
                'jawaban' => $item['jawaban'],
                'updated_at' => $timestamp,
                'created_at' => $existing['created_at'] ?? $timestamp,
            ];

            $cache->put($key, $payload, $ttl);
        }

        return response()->json([
            'success' => true,
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['required', 'integer', 'exists:praktikans,id'],
            'modul_id' => ['required', 'integer', 'exists:moduls,id'],
            'tipe_soal' => ['nullable', Rule::in(self::SUPPORTED_SOAL_TYPES)],
        ]);

        $cache = $this->cache();
        $deleted = 0;

        $praktikanId = (int) $validated['praktikan_id'];
        $modulId = (int) $validated['modul_id'];

        if (! empty($validated['tipe_soal'])) {
            $key = $this->cacheKey($praktikanId, $modulId, $validated['tipe_soal']);
            if ($cache->forget($key)) {
                $deleted++;
            }

            return response()->json([
                'success' => true,
                'deleted' => $deleted,
            ]);
        }

        foreach (self::SUPPORTED_SOAL_TYPES as $tipeSoal) {
            $key = $this->cacheKey($praktikanId, $modulId, $tipeSoal);
            if ($cache->forget($key)) {
                $deleted++;
            }
        }

        return response()->json([
            'success' => true,
            'deleted' => $deleted,
        ]);
    }

    public function storeQuestionIds(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['required', 'integer', 'exists:praktikans,id'],
            'modul_id' => ['required', 'integer', 'exists:moduls,id'],
            'tipe_soal' => ['required', Rule::in(['ta', 'tk', 'mandiri'])],
            'question_ids' => ['required', 'array', 'min:1'],
            'question_ids.*' => ['integer'],
        ]);

        $cache = $this->cache();
        $suffix = "{$validated['tipe_soal']}_questions";
        $key = $this->cacheKey(
            (int) $validated['praktikan_id'],
            (int) $validated['modul_id'],
            $suffix
        );

        if ($cache->has($key)) {
            $existing = $cache->get($key);

            return response()->json([
                'success' => true,
                'question_ids' => $existing['question_ids'] ?? [],
                'created_at' => $existing['created_at'] ?? null,
                'message' => 'Question IDs already stored.',
            ]);
        }

        $timestamp = Carbon::now()->toISOString();
        $payload = [
            'praktikan_id' => (int) $validated['praktikan_id'],
            'modul_id' => (int) $validated['modul_id'],
            'tipe_soal' => $suffix,
            'question_ids' => $validated['question_ids'],
            'updated_at' => $timestamp,
            'created_at' => $timestamp,
        ];

        $ttl = (int) config('cache.question_snapshot_ttl', self::QUESTION_TTL_SECONDS);
        $cache->put($key, $payload, $ttl);

        return response()->json([
            'success' => true,
            'question_ids' => $validated['question_ids'],
            'message' => 'Question IDs stored successfully.',
        ]);
    }

    public function getQuestionIds(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'praktikan_id' => ['required', 'integer', 'exists:praktikans,id'],
            'modul_id' => ['required', 'integer', 'exists:moduls,id'],
            'tipe_soal' => ['required', Rule::in(['ta', 'tk', 'mandiri'])],
        ]);

        $cache = $this->cache();
        $suffix = "{$validated['tipe_soal']}_questions";
        $key = $this->cacheKey(
            (int) $validated['praktikan_id'],
            (int) $validated['modul_id'],
            $suffix
        );

        $snapshot = $cache->get($key);
        if ($snapshot === null) {
            return response()->json([
                'success' => true,
                'question_ids' => [],
                'has_stored_questions' => false,
            ]);
        }

        return response()->json([
            'success' => true,
            'question_ids' => $snapshot['question_ids'] ?? [],
            'has_stored_questions' => true,
            'created_at' => $snapshot['created_at'] ?? null,
        ]);
    }
}
