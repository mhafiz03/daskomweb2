import { useEffect, useMemo, useRef, useState } from 'react';

const STAR_VALUES = [1, 2, 3, 4, 5];

const formatAssistantOption = (assistant) => {
    if (!assistant) {
        return '';
    }

    const code = assistant.kode ?? assistant.code ?? '';
    const name = assistant.nama ?? assistant.name ?? '';

    if (!code && !name) {
        return '';
    }

    if (!name) {
        return code;
    }

    if (!code) {
        return name;
    }

    return `${code} — ${name}`;
};

export default function FeedbackModal({
    isOpen,
    onClose,
    onSubmit,
    isPending,
    praktikumId,
    assistantOptions = [],
    defaultAssistantId = null,
    modulLabel = null,
}) {
    const [feedback, setFeedback] = useState('');
    const [ratingPraktikum, setRatingPraktikum] = useState(0);
    const [ratingAsisten, setRatingAsisten] = useState(0);
    const [selectedAssistantId, setSelectedAssistantId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const defaultId = defaultAssistantId ?? null;
        const normalizedDefaultId = defaultId !== null && defaultId !== undefined ? String(defaultId) : null;
        setSelectedAssistantId(normalizedDefaultId);

        if (normalizedDefaultId) {
            const defaultAssistant = assistantOptions.find((assistant) => String(assistant?.id) === normalizedDefaultId);
            setSearchTerm(formatAssistantOption(defaultAssistant));
        } else {
            setSearchTerm('');
        }
    }, [assistantOptions, defaultAssistantId, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setIsDropdownOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!dropdownRef.current) {
                return;
            }

            if (!dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredAssistants = useMemo(() => {
        if (!searchTerm) {
            return assistantOptions;
        }

        const normalizedQuery = searchTerm.toLowerCase();

        return assistantOptions.filter((assistant) => {
            const candidate = formatAssistantOption(assistant).toLowerCase();

            return candidate.includes(normalizedQuery);
        });
    }, [assistantOptions, searchTerm]);

    const resetForm = () => {
        setFeedback('');
        setRatingPraktikum(0);
        setRatingAsisten(0);
        const normalizedDefaultId = defaultAssistantId !== null && defaultAssistantId !== undefined ? String(defaultAssistantId) : null;
        setSelectedAssistantId(normalizedDefaultId);
        const assistant = assistantOptions.find((option) => String(option?.id) === normalizedDefaultId);
        setSearchTerm(formatAssistantOption(assistant));
    };

    const handleAssistantSelect = (assistantId) => {
        const resolvedId = assistantId !== null && assistantId !== undefined ? String(assistantId) : null;
        setSelectedAssistantId(resolvedId);

        const selectedAssistant = assistantOptions.find((assistant) => String(assistant?.id) === resolvedId);
        setSearchTerm(formatAssistantOption(selectedAssistant));
        setIsDropdownOpen(false);
    };

    const handleSubmit = async () => {
        const trimmedFeedback = feedback.trim();

        if (trimmedFeedback.length < 10 || !selectedAssistantId) {
            return;
        }

        await onSubmit({
            feedback: trimmedFeedback,
            rating_praktikum: ratingPraktikum,
            rating_asisten: ratingAsisten,
            asisten_id: selectedAssistantId !== null ? Number(selectedAssistantId) : null,
            praktikum_id: praktikumId,
        });

        resetForm();
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    const isSubmitDisabled = feedback.trim().length < 10 || isPending || !selectedAssistantId;

    const renderRatingGroup = (label, description, value, onChange) => (
        <div className="mb-6">
            <label className="mb-3 block text-sm font-semibold text-depth-primary">
                {label}
            </label>
            <div className="flex gap-2">
                {STAR_VALUES.map((star) => (
                    <button
                        key={`${label}-${star}`}
                        type="button"
                        onClick={() => onChange(star)}
                        className="transition-transform hover:scale-110"
                    >
                        <svg
                            className={`h-8 w-8 ${
                                star <= value
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-none text-gray-400 dark:text-gray-600'
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                        </svg>
                    </button>
                ))}
            </div>
            {value > 0 && (
                <p className="mt-2 text-xs text-depth-secondary">
                    {description(value)}
                </p>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            />
            
            {/* Modal */}
            <div className="glass-surface relative z-10 w-full max-w-2xl rounded-depth-lg p-6 shadow-depth-lg rounded-lg">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-depth-primary">Feedback Praktikum</h2>
                    <p className="mt-1 text-sm text-depth-secondary">Berikan feedback tentang praktikum hari ini</p>
                    {modulLabel && (
                        <p className="mt-2 text-xs font-medium text-depth-tertiary">
                            Modul Praktikum: <span className="text-depth-primary">{modulLabel}</span>
                        </p>
                    )}
                </div>

                {/* Assistant Selector */}
                <div className="mb-6" ref={dropdownRef}>
                    <label className="mb-3 block text-sm font-semibold text-depth-primary">
                        Pilih Asisten Penanggung Jawab
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setIsDropdownOpen(true);
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="Cari asisten berdasarkan kode atau nama"
                            className="w-full rounded-depth-lg border border-depth bg-depth-card px-4 py-3 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        />
                        {isDropdownOpen && (
                            <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                                {filteredAssistants.length === 0 ? (
                                    <div className="px-4 py-3 text-sm text-depth-secondary">
                                        Asisten tidak ditemukan.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-[color:var(--depth-border)]">
                                        {filteredAssistants.map((assistant) => (
                                            <li key={`assistant-option-${assistant.id}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleAssistantSelect(assistant.id)}
                                                    className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-depth-interactive ${
                                                        String(assistant.id) === selectedAssistantId ? 'bg-depth-interactive/80 font-semibold' : 'text-depth-primary'
                                                    }`}
                                                >
                                                    <span>{formatAssistantOption(assistant)}</span>
                                                    {String(assistant.id) === selectedAssistantId && (
                                                        <svg
                                                            className="h-4 w-4 text-[var(--depth-color-primary)]"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                    {selectedAssistantId && (
                        <p className="mt-2 text-xs text-depth-secondary">
                            Asisten terpilih: {formatAssistantOption(assistantOptions.find((assistant) => String(assistant?.id) === selectedAssistantId))}
                        </p>
                    )}
                </div>

                {/* Ratings */}
                {renderRatingGroup(
                    'Rating Praktikum (Opsional)',
                    (value) => `Anda memberikan ${value} dari 5 bintang untuk praktikum`,
                    ratingPraktikum,
                    setRatingPraktikum
                )}

                {renderRatingGroup(
                    'Rating Asisten (Opsional)',
                    (value) => `Anda memberikan ${value} dari 5 bintang untuk asisten`,
                    ratingAsisten,
                    setRatingAsisten
                )}

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

                {/* Action Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={`glass-button inline-flex min-w-[160px] items-center justify-center gap-2 rounded-depth-lg px-6 py-3 font-semibold shadow-depth-md transition-all ${
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
