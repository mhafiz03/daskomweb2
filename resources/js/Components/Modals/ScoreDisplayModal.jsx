export default function ScoreDisplayModal({
    isOpen,
    onClose,
    phaseType,
    correctAnswers = 0,
    totalQuestions = 0,
    percentage,
}) {
    if (!isOpen) {
        return null;
    }

    const safeTotal = Math.max(0, Number(totalQuestions) || 0);
    const safeCorrect = Math.max(0, Math.min(Number(correctAnswers) || 0, safeTotal));
    const scorePercentage = Number.isFinite(percentage)
        ? Math.max(0, Math.min(Math.round(percentage), 100))
        : safeTotal > 0
            ? Math.round((safeCorrect / safeTotal) * 100)
            : 0;

    const phaseLabel = phaseType === "tk" ? "Tes Keterampilan" : "Tes Awal";
    
    // Determine grade and color based on percentage
    let gradeColor = 'text-red-600 dark:text-red-400';
    let bgGradient = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))';
    
    if (scorePercentage >= 90) {
        gradeColor = 'text-green-600 dark:text-green-400';
        bgGradient = 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))';
    } else if (scorePercentage >= 80) {
        gradeColor = 'text-blue-600 dark:text-blue-400';
        bgGradient = 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))';
    } else if (scorePercentage >= 70) {
        gradeColor = 'text-cyan-600 dark:text-cyan-400';
        bgGradient = 'linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(8, 145, 178, 0.9))';
    } else if (scorePercentage >= 60) {
        gradeColor = 'text-amber-600 dark:text-amber-400';
        bgGradient = 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[2.25rem] border border-emerald-200/40 bg-gradient-to-br from-emerald-500/25 via-emerald-400/10 to-emerald-600/15 shadow-[0_30px_70px_rgba(15,23,42,0.45)] backdrop-blur-xl">
                <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: bgGradient }}
                />

                <div className="px-8 pb-10 pt-12 text-center">
                    <div className="mb-6 flex justify-center">
                        <div
                            className="grid h-20 w-20 place-items-center rounded-full shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
                            style={{ background: bgGradient }}
                        >
                            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-depth-secondary">Ringkasan Nilai</p>
                        <h2 className="mt-2 text-3xl font-bold text-depth-primary">{phaseLabel}</h2>
                        <p className="mt-3 text-sm text-depth-secondary">
                            Berikut performa kamu pada tahap ini.
                        </p>
                    </div>

                    <div className="mx-auto grid max-w-md gap-6">
                        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-depth bg-depth-interactive/40 p-6">
                            <div className="flex flex-col items-center justify-center gap-1">
                                <span className="text-xs font-semibold tracking-wide text-depth-secondary">Nilai (%)</span>
                                <span className="text-5xl font-black text-depth-primary">{scorePercentage}<span className="text-2xl align-top">%</span></span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-depth-card/80 p-4 shadow-inner">
                                <div className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">Jawaban Benar</div>
                                <div className="text-4xl font-bold text-depth-primary">{safeCorrect}/{safeTotal}</div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-white/40">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${scorePercentage}%`, background: bgGradient }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl bg-depth-interactive/30 p-5 text-sm font-medium text-depth-primary">
                            {scorePercentage >= 90 && "🎉 Luar biasa! Pertahankan performa terbaikmu."}
                            {scorePercentage >= 80 && scorePercentage < 90 && "👏 Bagus sekali! Kamu berada di jalur yang tepat."}
                            {scorePercentage >= 70 && scorePercentage < 80 && "👍 Hasil cukup baik, tinggal sedikit lagi menuju puncak."}
                            {scorePercentage >= 60 && scorePercentage < 70 && "💪 Jangan menyerah, terus asah pemahamanmu."}
                            {scorePercentage < 60 && "📚 Tetap semangat! Pelajari kembali materi dan coba lagi."}
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex min-w-[160px] items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-depth-md transition-all hover:-translate-y-0.5 hover:shadow-depth-lg"
                            style={{ background: bgGradient }}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
