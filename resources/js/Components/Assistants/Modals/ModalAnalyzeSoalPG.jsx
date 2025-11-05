import { useEffect, useMemo, useState } from "react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useSoalAnalytics } from "@/hooks/useSoalAnalytics";

const normalizeModuleOption = (module) => {
    if (!module) {
        return null;
    }

    const value = module.idM ?? module.id ?? module.value ?? module.uuid ?? module.ID;
    if (value === undefined || value === null) {
        return null;
    }

    return {
        value: String(value),
        label: module.judul ?? module.name ?? module.label ?? module.title ?? `Modul ${value}`,
    };
};

const SummaryCard = ({ title, value, tone = "primary" }) => {
    const toneClass = {
        primary: "border-[var(--depth-color-primary)] bg-[var(--depth-color-primary)]/10 text-[var(--depth-color-primary)]",
        secondary: "border-depth bg-depth-card text-depth-primary",
    }[tone];

    return (
        <div className={`rounded-depth-md border px-4 py-3 text-center shadow-depth-sm ${toneClass}`}>
            <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">{title}</p>
            <p className="mt-1 text-2xl font-semibold">{value}</p>
        </div>
    );
};

const OptionBar = ({ option, maxPercentage }) => {
    const percentage = Number.isFinite(option?.percentage) ? option.percentage : 0;
    const safePercentage = Math.min(Math.max(percentage, 0), 100);
    const label = option?.text?.trim() || "Pilihan belum diisi";
    const barWidth = maxPercentage > 0 ? `${(safePercentage / maxPercentage) * 100}%` : `${safePercentage}%`;

    return (
        <div className={`rounded-depth-md border px-3 py-2 text-sm shadow-depth-sm ${
            option?.is_correct
                ? "border-[var(--depth-color-primary)] bg-[var(--depth-color-primary)]/10"
                : "border-depth bg-depth-interactive"
        }`}>
            <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                <span>{option?.is_correct ? "Jawaban Benar" : "Pilihan"}</span>
                <span>{safePercentage.toFixed(1)}%</span>
            </div>
            <p className="mt-1 text-sm font-medium text-depth-primary">{label}</p>
            <div className="mt-2 h-2 rounded-depth-full bg-depth-card">
                <div
                    className={`h-2 rounded-depth-full ${
                        option?.is_correct ? "bg-[var(--depth-color-primary)]" : "bg-depth-secondary/70"
                    }`}
                    style={{ width: barWidth }}
                />
            </div>
            <p className="mt-1 text-xs text-depth-secondary">
                {option?.count ?? 0} jawaban
            </p>
        </div>
    );
};

export default function ModalAnalyzeSoalPG({
    kategoriSoal,
    modules = [],
    initialModuleId = "",
    onClose,
}) {
    const moduleOptions = useMemo(
        () => (modules ?? []).map(normalizeModuleOption).filter(Boolean),
        [modules],
    );

    const [selectedModuleId, setSelectedModuleId] = useState(() => {
        if (initialModuleId) {
            return String(initialModuleId);
        }
        return moduleOptions[0]?.value ?? "";
    });

    useEffect(() => {
        if (initialModuleId) {
            setSelectedModuleId(String(initialModuleId));
        }
    }, [initialModuleId]);

    const {
        data: analytics,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useSoalAnalytics(kategoriSoal, selectedModuleId, {
        enabled: Boolean(kategoriSoal && selectedModuleId),
        refetchOnWindowFocus: false,
    });

    const summary = analytics?.summary ?? {
        total_questions: 0,
        total_responses: 0,
        respondent_count: 0,
    };

    const questions = Array.isArray(analytics?.questions) ? analytics.questions : [];

    return (
        <div className="depth-modal-overlay z-50">
            <div
                className="depth-modal-container flex max-h-[90vh] flex-col overflow-hidden"
                style={{ "--depth-modal-max-width": "64rem" }}
            >
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Analisis Jawaban Praktikan</h2>
                    <div className="flex items-center gap-3">
                        {isFetching ? <span className="text-xs text-depth-secondary">Memuat data…</span> : null}
                        <button
                            type="button"
                            onClick={refetch}
                            className="rounded-depth-md border border-depth bg-depth-interactive px-3 py-1 text-xs font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            disabled={isLoading}
                        >
                            Segarkan
                        </button>
                    </div>
                    <button type="button" onClick={onClose} className="depth-modal-close">
                        <img className="h-7 w-7" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                <div className="px-6 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                            Pilih Modul
                        </label>
                        <select
                            className="w-72 rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-card)]"
                            value={selectedModuleId}
                            onChange={(event) => setSelectedModuleId(event.target.value)}
                        >
                            <option value="">- Pilih Modul -</option>
                            {moduleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center text-sm text-depth-secondary">
                            Memuat analisis jawaban…
                        </div>
                    ) : isError ? (
                        <div className="rounded-depth-md border border-red-400 bg-red-50/80 p-4 text-sm text-red-600 shadow-depth-sm">
                            {error?.message ?? "Gagal memuat analisis jawaban."}
                        </div>
                    ) : !selectedModuleId ? (
                        <div className="flex h-full items-center justify-center text-sm text-depth-secondary">
                            Pilih modul untuk melihat analisis jawaban.
                        </div>
                    ) : questions.length === 0 ? (
                        <div className="rounded-depth-md border border-depth bg-depth-card p-6 text-sm text-depth-secondary shadow-depth-sm">
                            Belum ada data jawaban untuk modul ini.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid gap-3 md:grid-cols-3">
                                <SummaryCard title="Total Pertanyaan" value={summary.total_questions ?? 0} />
                                <SummaryCard
                                    title="Total Jawaban Masuk"
                                    value={summary.total_responses ?? 0}
                                    tone="secondary"
                                />
                                <SummaryCard
                                    title="Praktikan Berpartisipasi"
                                    value={summary.respondent_count ?? 0}
                                    tone="secondary"
                                />
                            </div>

                            <div className="space-y-5">
                                {questions.map((question) => {
                                    const options = Array.isArray(question?.options) ? question.options : [];
                                    const maxPercentage = options.reduce(
                                        (acc, option) => Math.max(acc, Number(option?.percentage ?? 0)),
                                        0,
                                    );

                                    return (
                                        <div
                                            key={question?.soal_id ?? question?.id}
                                            className="space-y-3 rounded-depth-lg border border-depth bg-depth-card p-5 shadow-depth-sm"
                                        >
                                            <div className="space-y-2">
                                                <div className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                                                    Soal
                                                </div>
                                                <p className="text-base font-semibold text-depth-primary">
                                                    {question?.pertanyaan ?? "Pertanyaan belum tersedia."}
                                                </p>
                                                <div className="text-xs text-depth-secondary">
                                                    {question?.total_responses ?? 0} jawaban | {options.length} pilihan
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                {options.map((option) => (
                                                    <OptionBar key={option?.id ?? option?.text} option={option} maxPercentage={maxPercentage} />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
