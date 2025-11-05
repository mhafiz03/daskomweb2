import { useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import { useKelasQuery } from "@/hooks/useKelasQuery";
import { usePraktikanLeaderboardQuery } from "@/hooks/usePraktikanLeaderboardQuery";

const LIMIT_OPTIONS = [
    { value: 10, label: "Top 10" },
    { value: 25, label: "Top 25" },
    { value: 50, label: "Top 50" },
    { value: 100, label: "Top 100" },
];

const formatAverage = (value) => {
    const numeric = typeof value === "string" ? Number.parseFloat(value) : value;
    if (Number.isFinite(numeric)) {
        return numeric.toFixed(2);
    }

    return "-";
};

const formatDate = (value) => {
    if (!value) {
        return "Belum ada";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "Belum ada";
    }

    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(parsed);
};

const rankTone = (index) => {
    if (index === 0) {
        return "from-yellow-200/80 via-amber-100/60 to-white border-yellow-300";
    }

    if (index === 1) {
        return "from-slate-200/70 via-slate-100/50 to-white border-slate-200";
    }

    if (index === 2) {
        return "from-orange-200/80 via-amber-100/60 to-white border-amber-200";
    }

    return "from-white via-white to-white border-depth";
};

export default function ContentRanking() {
    const [selectedClass, setSelectedClass] = useState("all");
    const [limit, setLimit] = useState(25);
    const [searchTerm, setSearchTerm] = useState("");

    const filters = useMemo(() => {
        const query = { limit };

        if (selectedClass !== "all") {
            const parsed = Number.parseInt(selectedClass, 10);
            if (!Number.isNaN(parsed)) {
                query.kelas_id = parsed;
            }
        }

        return query;
    }, [limit, selectedClass]);

    const {
        data: kelasList = [],
        isLoading: kelasLoading,
    } = useKelasQuery();

    const kelasOptions = useMemo(() => {
        const options = [
            { value: "all", label: "Semua kelas" },
        ];

        if (Array.isArray(kelasList)) {
            kelasList.forEach((kelas) => {
                if (!kelas?.id) {
                    return;
                }

                options.push({
                    value: String(kelas.id),
                    label: kelas.kelas ?? kelas.nama ?? `Kelas ${kelas.id}`,
                });
            });
        }

        return options;
    }, [kelasList]);

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = usePraktikanLeaderboardQuery(filters);

    const toolbarConfig = useMemo(
        () => ({
            title: "Leaderboard Praktikan",
            actions: [
                {
                    id: "refresh-praktikan-leaderboard",
                    label: isFetching ? "Memuat..." : "Muat ulang",
                    onClick: () => refetch(),
                    icon: "↻",
                    disabled: isFetching,
                },
            ],
        }),
        [isFetching, refetch],
    );

    useAssistantToolbar(toolbarConfig);

    const leaderboardItems = data?.items ?? [];

    const filteredItems = useMemo(() => {
        if (!searchTerm.trim()) {
            return leaderboardItems;
        }

        const query = searchTerm.trim().toLowerCase();
        return leaderboardItems.filter((item) => {
            const name = item.nama?.toLowerCase() ?? "";
            const nim = item.nim?.toLowerCase() ?? "";
            const kelas = item.kelas?.toLowerCase() ?? "";
            return name.includes(query) || nim.includes(query) || kelas.includes(query);
        });
    }, [leaderboardItems, searchTerm]);

    const topThree = useMemo(() => filteredItems.slice(0, 3), [filteredItems]);

    const hasNoData = !isLoading && filteredItems.length === 0;

    return (
        <section className="space-y-6 pb-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <label className="text-sm font-medium text-depth-secondary" htmlFor="leaderboard-search">
                        Cari praktikan
                    </label>
                    <input
                        id="leaderboard-search"
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Nama, NIM, atau kelas"
                        className="w-72 rounded-depth-md border border-depth bg-depth-card px-4 py-2 text-sm text-depth-primary shadow-depth-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)]"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-col text-sm text-depth-secondary">
                        <label className="mb-1 font-medium" htmlFor="kelas-options">
                            Kelas
                        </label>
                        <select
                            id="kelas-options"
                            value={selectedClass}
                            onChange={(event) => setSelectedClass(event.target.value)}
                            disabled={kelasLoading}
                            className="w-56 rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {kelasOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col text-sm text-depth-secondary">
                        <label className="mb-1 font-medium" htmlFor="limit-options">
                            Jumlah baris
                        </label>
                        <select
                            id="limit-options"
                            value={limit}
                            onChange={(event) => setLimit(Number(event.target.value))}
                            className="w-40 rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)]"
                        >
                            {LIMIT_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {topThree.length === 0 && !isLoading ? (
                    <div className="md:col-span-2 xl:col-span-3 rounded-depth-lg border border-depth bg-depth-card p-6 text-center text-depth-secondary shadow-depth-md">
                        Belum ada nilai yang memenuhi kriteria saat ini.
                    </div>
                ) : (
                    topThree.map((entry, index) => (
                        <article
                            key={`highlight-${entry.praktikan_id}`}
                            className={`rounded-depth-lg border bg-gradient-to-br p-6 text-depth-primary shadow-depth-lg transition ${rankTone(index)}`}
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-depth-secondary">#{index + 1}</p>
                                    <h3 className="mt-1 text-xl font-semibold">{entry.nama}</h3>
                                    <p className="text-sm text-depth-secondary">NIM: {entry.nim}</p>
                                    <p className="text-sm text-depth-secondary">Kelas: {entry.kelas ?? "-"}</p>
                                </div>
                                <div className="rounded-depth-full bg-white/50 px-4 py-2 text-right">
                                    <p className="text-sm font-semibold text-depth-secondary">Nilai rata-rata</p>
                                    <p className="text-2xl font-bold text-depth-primary">{formatAverage(entry.average_nilai)}</p>
                                    <p className="mt-2 text-sm font-semibold text-depth-secondary">Rating rata-rata</p>
                                    <p className="text-xl font-semibold text-depth-primary">{formatAverage(entry.average_rating)}</p>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-2 text-sm text-depth-secondary sm:grid-cols-3">
                                <div>
                                    <span className="font-medium text-depth-primary">Modul dinilai:</span> {entry.nilai_count}
                                </div>
                                <div>
                                    <span className="font-medium text-depth-primary">Rating terkumpul:</span> {entry.rating_count}
                                </div>
                                <div>
                                    <span className="font-medium text-depth-primary">Terakhir dinilai:</span> {formatDate(entry.last_submitted_at)}
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            <div className="rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                <div className="flex items-center justify-between border-b border-depth px-6 py-4">
                    <h4 className="text-base font-semibold text-depth-primary">Daftar praktikan</h4>
                    {isFetching ? (
                        <span className="text-xs font-medium text-depth-secondary">Memuat ulang data…</span>
                    ) : null}
                </div>

                {isLoading ? (
                    <div className="px-6 py-12 text-center text-depth-secondary">Memuat leaderboard…</div>
                ) : isError ? (
                    <div className="px-6 py-12 text-center text-red-500">
                        {error?.message ?? "Tidak dapat memuat data leaderboard."}
                    </div>
                ) : hasNoData ? (
                    <div className="px-6 py-12 text-center text-depth-secondary">
                        Tidak ada praktikan yang memenuhi pencarian saat ini.
                    </div>
                ) : (
                    <div className="max-h-[60vh] overflow-y-auto">
                        <table className="min-w-full table-fixed">
                            <thead className="sticky top-0 bg-depth-card">
                                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                                    <th className="w-16 px-6 py-3">Rank</th>
                                    <th className="px-6 py-3">Nama</th>
                                    <th className="w-40 px-6 py-3">NIM</th>
                                    <th className="w-36 px-6 py-3">Kelas</th>
                                    <th className="w-32 px-6 py-3">Nilai rata-rata</th>
                                    <th className="w-32 px-6 py-3">Rating rata-rata</th>
                                    <th className="w-32 px-6 py-3">Modul dinilai</th>
                                    <th className="w-32 px-6 py-3">Rating masuk</th>
                                    <th className="w-40 px-6 py-3">Terakhir dinilai</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.map((entry, index) => (
                                    <tr
                                        key={`row-${entry.praktikan_id}`}
                                        className="border-t border-depth/60 text-sm text-depth-primary hover:bg-depth-interactive/40"
                                    >
                                        <td className="px-6 py-3 font-semibold text-depth-secondary">#{index + 1}</td>
                                        <td className="px-6 py-3 font-medium">{entry.nama}</td>
                                        <td className="px-6 py-3 text-depth-secondary">{entry.nim}</td>
                                        <td className="px-6 py-3 text-depth-secondary">{entry.kelas ?? "-"}</td>
                                        <td className="px-6 py-3 font-semibold">{formatAverage(entry.average_nilai)}</td>
                                        <td className="px-6 py-3 font-semibold">{formatAverage(entry.average_rating)}</td>
                                        <td className="px-6 py-3 text-depth-secondary">{entry.nilai_count}</td>
                                        <td className="px-6 py-3 text-depth-secondary">{entry.rating_count}</td>
                                        <td className="px-6 py-3 text-depth-secondary">{formatDate(entry.last_submitted_at)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
