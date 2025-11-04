import { useMemo, useState } from "react";

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
    const [isExpanded, setIsExpanded] = useState(true);
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

    const lastGenerated = formatTimestamp(progress?.generatedAt ?? null);

    const toggleExpanded = () => setIsExpanded((prev) => !prev);

    return (
        <div className="rounded-depth-lg border border-depth bg-depth-card p-4 shadow-depth-md">
            <div className="flex flex-col gap-3">
                <button
                    type="button"
                    onClick={() => {onRefresh?.(); toggleExpanded()}}
                    className="flex items-center gap-2 text-left text-sm font-semibold text-depth-primary transition-colors hover:text-depth-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-card)]"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    Praktikan
                    {rows.length > 0 && (
                        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-depth-primary/10 px-2 py-0.5 text-xs font-medium text-depth-primary">
                            {onlineSet.size > 0 && (
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                                </span>
                            )}
                            {onlineSet.size}/{rows.length}
                        </span>
                    )}
                    <svg
                        className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {isExpanded && (
                <div className="mt-5">
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
                                <tbody className="grid grid-cols-3 justify-between divide-y divide-[color:var(--depth-border)] bg-depth-card">
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
                                                        className={`inline-flex gap-2 rounded-depth-full px-3 py-1 text-xs font-semibold ${badge.className}`}
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
            )}
        </div>
    );
}
