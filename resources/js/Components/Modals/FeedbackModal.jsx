import { useState } from 'react';

export default function FeedbackModal({ 
    isOpen, 
    onClose, 
    onSubmit,
    isPending,
    praktikumId,
}) {
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);

    const handleSubmit = async () => {
        if (feedback.trim().length < 10) {
            return;
        }
        
        await onSubmit({ feedback, rating });
        setFeedback('');
        setRating(0);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    const isSubmitDisabled = feedback.trim().length < 10 || isPending;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="glass-surface relative z-10 w-full max-w-2xl rounded-depth-xl p-6 shadow-depth-xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-depth-primary">Feedback Praktikum</h2>
                        <p className="mt-1 text-sm text-depth-secondary">Berikan feedback tentang praktikum hari ini</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-depth-md p-2 text-depth-secondary transition-colors hover:bg-depth-interactive hover:text-depth-primary"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Rating */}
                <div className="mb-6">
                    <label className="mb-3 block text-sm font-semibold text-depth-primary">
                        Rating Praktikum (Opsional)
                    </label>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="transition-transform hover:scale-110"
                            >
                                <svg 
                                    className={`h-8 w-8 ${
                                        star <= rating 
                                            ? 'fill-amber-400 text-amber-400' 
                                            : 'fill-none text-gray-400 dark:text-gray-600'
                                    }`}
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                            </button>
                        ))}
                    </div>
                    {rating > 0 && (
                        <p className="mt-2 text-xs text-depth-secondary">
                            Anda memberikan {rating} dari 5 bintang
                        </p>
                    )}
                </div>

                {/* Feedback Text */}
                <div className="mb-6">
                    <label htmlFor="feedback" className="mb-2 block text-sm font-semibold text-depth-primary">
                        Feedback / Laporan Praktikan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={8}
                        className="w-full rounded-depth-lg border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        placeholder="Bagikan pengalaman Anda selama praktikum, kendala yang dihadapi, saran untuk perbaikan, atau hal lain yang ingin disampaikan..."
                    />
                    <div className="mt-2 flex items-center justify-between text-xs">
                        <span className={`${
                            feedback.trim().length < 10 
                                ? 'text-red-500' 
                                : 'text-green-600 dark:text-green-400'
                        }`}>
                            {feedback.trim().length < 10 
                                ? `Minimal 10 karakter (${10 - feedback.trim().length} lagi)` 
                                : 'Feedback sudah cukup'}
                        </span>
                        <span className="text-depth-secondary">
                            {feedback.length} karakter
                        </span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-depth-lg border border-depth bg-depth-card/50 px-6 py-3 font-semibold text-depth-primary transition-all hover:bg-depth-interactive"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={`glass-button flex flex-1 items-center justify-center gap-2 rounded-depth-lg px-6 py-3 font-semibold shadow-depth-md transition-all ${
                            isSubmitDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:-translate-y-0.5 hover:shadow-depth-lg"
                        }`}
                        style={{
                            background: isSubmitDisabled
                                ? undefined
                                : "linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))",
                        }}
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {isPending ? 'Mengirim...' : 'Kirim Feedback'}
                    </button>
                </div>
            </div>
        </div>
    );
}
