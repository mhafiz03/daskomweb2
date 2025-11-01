export default function ScoreDisplayModal({ 
    isOpen, 
    onClose, 
    score,
    phaseType, // 'ta' or 'tk'
    totalQuestions,
}) {
    if (!isOpen) {
        return null;
    }

    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const phaseLabel = phaseType === 'ta' ? 'Tes Awal' : 'Tes Keterampilan';
    
    // Determine grade and color based on percentage
    let grade = 'E';
    let gradeColor = 'text-red-600 dark:text-red-400';
    let bgGradient = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))';
    
    if (percentage >= 90) {
        grade = 'A';
        gradeColor = 'text-green-600 dark:text-green-400';
        bgGradient = 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))';
    } else if (percentage >= 80) {
        grade = 'B';
        gradeColor = 'text-blue-600 dark:text-blue-400';
        bgGradient = 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))';
    } else if (percentage >= 70) {
        grade = 'C';
        gradeColor = 'text-cyan-600 dark:text-cyan-400';
        bgGradient = 'linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(8, 145, 178, 0.9))';
    } else if (percentage >= 60) {
        grade = 'D';
        gradeColor = 'text-amber-600 dark:text-amber-400';
        bgGradient = 'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="glass-surface relative z-10 w-full max-w-md rounded-depth-xl p-8 shadow-depth-xl text-center">
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                    <div 
                        className="rounded-full p-4"
                        style={{
                            background: bgGradient,
                        }}
                    >
                        <svg className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                </div>

                {/* Title */}
                <h2 className="mb-2 text-3xl font-bold text-depth-primary">
                    Nilai {phaseLabel}
                </h2>
                <p className="mb-8 text-depth-secondary">
                    Berikut adalah hasil nilai Anda
                </p>

                {/* Score Display */}
                <div className="mb-6 space-y-4">
                    {/* Grade */}
                    <div className="flex items-center justify-center">
                        <div className={`text-8xl font-bold ${gradeColor}`}>
                            {grade}
                        </div>
                    </div>

                    {/* Score Stats */}
                    <div className="rounded-depth-lg border border-depth bg-depth-card/50 p-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-depth-secondary">Jawaban Benar</span>
                                <span className="text-lg font-bold text-depth-primary">
                                    {score} / {totalQuestions}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-depth-secondary">Persentase</span>
                                <span className="text-lg font-bold text-depth-primary">
                                    {percentage}%
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${percentage}%`,
                                    background: bgGradient,
                                }}
                            />
                        </div>
                    </div>

                    {/* Encouragement Message */}
                    <div className="mt-6 rounded-depth-lg bg-depth-interactive/30 p-4">
                        <p className="text-sm font-medium text-depth-primary">
                            {percentage >= 90 && "🎉 Luar biasa! Kerja yang sangat baik!"}
                            {percentage >= 80 && percentage < 90 && "👏 Bagus sekali! Terus pertahankan!"}
                            {percentage >= 70 && percentage < 80 && "👍 Cukup baik, terus tingkatkan!"}
                            {percentage >= 60 && percentage < 70 && "💪 Ayo semangat, kamu bisa lebih baik!"}
                            {percentage < 60 && "📚 Jangan menyerah, terus belajar!"}
                        </p>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="glass-button w-full rounded-depth-lg px-6 py-3 font-semibold shadow-depth-md transition-all hover:-translate-y-0.5 hover:shadow-depth-lg"
                    style={{
                        background: bgGradient,
                    }}
                >
                    Tutup
                </button>
            </div>
        </div>
    );
}
