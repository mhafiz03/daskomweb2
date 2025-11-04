import { useMemo } from "react";

const formatTimestamp = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const getBadgeClass = (row) => {
    const answered = Number(row?.answeredCount ?? 0);
    const total = Number(row?.totalQuestions ?? 0);
    const phaseKey = row?.phaseKey ?? "";

    if (phaseKey === "ta" || phaseKey === "tk") {
        if (answered >= 10) {
            return {
                tone: "success",
                className: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/40",
            };
        }

        return {
            tone: "warning",
            className: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-400/40",
        };
    }

    if (total === 0) {
        if (answered > 0) {
            return {
                tone: "success",
                className: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/40",
            };
        }

        return {
            tone: "neutral",
            className: "bg-depth-interactive/60 text-depth-secondary ring-1 ring-depth/50",
        };
    }

    if (answered >= total) {
        return {
            tone: "success",
            className: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/40",
        };
    }

    return {
        tone: "warning",
        className: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-400/40",
    };
};

export default function TablePraktikanProgress({
    progress,
    onlinePraktikan,
    isLoading = false,
    isFetching = false,
    onRefresh,
}) {
    const activePhase = progress?.activePhase ?? null;
    const phaseMap = progress?.phaseMap ?? {};
    const phaseMeta = activePhase ? phaseMap[activePhase] ?? null : null;
    const rows = Array.isArray(progress?.participants) ? progress.participants : [];
    const onlineSet = useMemo(() => {
        if (!onlinePraktikan) {
            return new Set();
        }

        if (onlinePraktikan instanceof Set) {
            return onlinePraktikan;
        }

        return new Set(Array.isArray(onlinePraktikan) ? onlinePraktikan : []);
    }, [onlinePraktikan]);

    return (
        <div className="glass-surface flex w-full flex-col gap-4 rounded-depth-lg border border-depth bg-depth-card p-6 shadow-depth-lg">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={() => onRefresh?.()}
                        disabled={!onRefresh || isLoading}
                        className="inline-flex items-center gap-1 rounded-depth-md border border-depth bg-depth-interactive px-3 py-1 text-xs font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12a7.5 7.5 0 0114.727-2.222M19.5 12a7.5 7.5 0 01-14.727 2.222"
                            />
                        </svg>
                        Refresh
                    </button>
            </div>

            {isLoading ? (
                <div className="flex flex-1 items-center justify-center py-12 text-depth-secondary">
                    <div className="flex items-center gap-3 text-sm">
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--depth-color-primary)] border-t-transparent" />
                        Memuat progres praktikan...
                    </div>
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-depth-lg border border-dashed border-depth px-4 py-6 text-center text-sm text-depth-secondary">
                    Belum ada progres yang dapat ditampilkan.
                </div>
            ) : (
                <div className="overflow-hidden rounded-depth-lg border border-depth shadow-depth-md">
                    <table className="w-full min-w-[720px] table-auto divide-y divide-[color:var(--depth-border)] text-sm">
                        <tbody className="grid grid-cols-3 gap-2 divide-y divide-[color:var(--depth-border)] bg-depth-card">
                            {rows.map((row) => {
                                const badge = getBadgeClass(row);
                                const answered = Number(row?.answeredCount ?? 0);
                                const totalRaw = row?.totalQuestions;
                                const totalValue = typeof totalRaw === "number" ? totalRaw : Number(totalRaw ?? 0);
                                const total = Number.isFinite(totalValue) ? totalValue : 0;
                                const displayTotal = total > 0 ? total : "-";
                                const isOnline = onlineSet.has(row?.id);

                                return (
                                    <tr key={row?.id ?? row?.nim} className="transition hover:bg-depth-interactive/40">
                                        <td className="px-4 py-3 font-semibold text-depth-primary">{row?.nim ?? "-"}</td>
                                        <td className="px-4 py-3 text-depth-secondary">
                                            <span className="flex items-center gap-2">
                                                {isOnline && (
                                                    <span className="relative flex h-2.5 w-2.5">
                                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                                                    </span>
                                                )}
                                                <span className="truncate" title={row?.nama ?? "Tidak diketahui"}>
                                                    {row?.nama ?? "Tidak diketahui"}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-depth-full px-3 py-1 text-xs font-semibold ${badge.className}`}
                                            >
                                                <span>
                                                    {answered}
                                                    <span className="text-depth-secondary"> / </span>
                                                    {displayTotal}
                                                </span>
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
