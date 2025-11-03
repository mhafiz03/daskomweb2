import { Fragment } from 'react';

export default function PraktikumControlModal({ 
    isOpen, 
    onClose, 
    session,
    onAction,
    isPending,
    startDisabled,
    pauseDisabled,
    resumeDisabled,
    nextDisabled,
    exitDisabled,
    startLabel,
    statusLabel,
    currentPhaseLabel,
}) {
    if (!isOpen) {
        return null;
    }

    const isPaused = session?.status === 'paused';
    const isRunning = session?.status === 'running';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="glass-surface relative z-10 w-full max-w-lg rounded-depth-lg p-6 shadow-depth-lg">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-depth-primary">Praktikum Control</h2>
                    <button
                        onClick={onClose}
                        className="rounded-depth-md p-2 text-depth-secondary transition-colors hover:bg-depth-interactive hover:text-depth-primary"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Status Info */}
                <div className="mb-6 space-y-3 rounded-depth-lg border border-depth bg-depth-card/50 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-depth-secondary">Status</span>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            isRunning 
                                ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                                : isPaused
                                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'
                        }`}>
                            {statusLabel}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-depth-secondary">Tahap Saat Ini</span>
                        <span className="font-semibold text-depth-primary">{currentPhaseLabel}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => {
                            onAction('start');
                            onClose();
                        }}
                        disabled={startDisabled}
                        className={`glass-button flex w-full items-center justify-center gap-3 rounded-depth-lg px-6 py-4 text-lg font-semibold shadow-depth-md transition-all ${
                            startDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:-translate-y-0.5 hover:shadow-depth-lg"
                        }`}
                        style={{
                            background: startDisabled
                                ? undefined
                                : "linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))",
                        }}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {startLabel}
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onAction('pause');
                                onClose();
                            }}
                            disabled={pauseDisabled}
                            className={`glass-button flex items-center justify-center gap-2 rounded-depth-lg px-4 py-3 font-semibold shadow-depth-md transition-all ${
                                pauseDisabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:-translate-y-0.5 hover:shadow-depth-lg"
                            }`}
                            style={{
                                background: pauseDisabled
                                    ? undefined
                                    : "linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))",
                            }}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pause
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                onAction('resume');
                                onClose();
                            }}
                            disabled={resumeDisabled}
                            className={`glass-button flex items-center justify-center gap-2 rounded-depth-lg px-4 py-3 font-semibold shadow-depth-md transition-all ${
                                resumeDisabled
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:-translate-y-0.5 hover:shadow-depth-lg"
                            }`}
                            style={{
                                background: resumeDisabled
                                    ? undefined
                                    : "linear-gradient(135deg, rgba(6, 182, 212, 0.9), rgba(8, 145, 178, 0.9))",
                            }}
                        >
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Resume
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            onAction('next');
                            onClose();
                        }}
                        disabled={nextDisabled}
                        className={`glass-button flex w-full items-center justify-center gap-3 rounded-depth-lg px-6 py-4 text-lg font-semibold shadow-depth-md transition-all ${
                            nextDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:-translate-y-0.5 hover:shadow-depth-lg"
                        }`}
                        style={{
                            background: nextDisabled
                                ? undefined
                                : "linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(79, 70, 229, 0.9))",
                        }}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Next Phase
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onAction('exit');
                            onClose();
                        }}
                        disabled={exitDisabled}
                        className={`glass-button flex w-full items-center justify-center gap-3 rounded-depth-lg px-6 py-4 text-lg font-semibold shadow-depth-md transition-all ${
                            exitDisabled
                                ? "cursor-not-allowed opacity-50"
                                : "hover:-translate-y-0.5 hover:shadow-depth-lg"
                        }`}
                        style={{
                            background: exitDisabled
                                ? undefined
                                : "linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))",
                        }}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Exit Praktikum
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full rounded-depth-lg border border-depth bg-depth-card/50 px-6 py-3 font-semibold text-depth-primary transition-all hover:bg-depth-interactive"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
