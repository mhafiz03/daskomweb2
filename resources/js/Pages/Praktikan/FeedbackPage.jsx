import { useEffect, useMemo, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import toast from "react-hot-toast";

import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import { api } from "@/lib/api";

const STAR_VALUES = [1, 2, 3, 4, 5];

const formatAssistantOption = (assistant) => {
    if (!assistant) {
        return "";
    }

    const code = assistant.kode ?? assistant.code ?? "";
    const name = assistant.nama ?? assistant.name ?? "";

    if (!code && !name) {
        return "";
    }

    if (!name) {
        return code;
    }

    if (!code) {
        return name;
    }

    return `${code} — ${name}`;
};

const ratingDescription = (value, subject) => `Anda memberikan ${value} dari 5 bintang untuk ${subject}`;

export default function FeedbackPage({ auth, modulId: initialModulId = null, assistantId: initialAssistantId = null }) {
    const praktikanData = auth?.praktikan ?? auth?.user ?? null;
    const praktikanId = praktikanData?.id ?? null;
    const normalizedModulId = initialModulId ? String(initialModulId) : null;
    const normalizedAssistantId = initialAssistantId ? String(initialAssistantId) : null;

    const [feedback, setFeedback] = useState("");
    const [ratingPraktikum, setRatingPraktikum] = useState(0);
    const [ratingAsisten, setRatingAsisten] = useState(0);
    const [selectedAssistantId, setSelectedAssistantId] = useState(normalizedAssistantId);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dropdownRef = useRef(null);

    const { data: assistantOptions = [] } = useAsistensQuery();
    const { data: modules = [] } = useModulesQuery();

    const modulData = useMemo(() => {
        if (!normalizedModulId) {
            return null;
        }

        return (
            modules.find((module) => String(module?.idM ?? module?.id) === normalizedModulId) ?? null
        );
    }, [modules, normalizedModulId]);

    const modulLabel = modulData?.judul ?? modulData?.name ?? (normalizedModulId ? `Modul #${normalizedModulId}` : null);

    useEffect(() => {
        if (normalizedAssistantId) {
            const assistant = assistantOptions.find((option) => String(option?.id) === normalizedAssistantId);
            if (assistant) {
                setSearchTerm(formatAssistantOption(assistant));
            }
        }
    }, [assistantOptions, normalizedAssistantId]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!dropdownRef.current || dropdownRef.current.contains(event.target)) {
                return;
            }
            setIsDropdownOpen(false);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const filteredAssistants = useMemo(() => {
        if (!searchTerm) {
            return assistantOptions;
        }

        const query = searchTerm.toLowerCase();
        return assistantOptions.filter((assistant) => formatAssistantOption(assistant).toLowerCase().includes(query));
    }, [assistantOptions, searchTerm]);

    const handleAssistantSelect = (assistantId) => {
        const resolvedId = assistantId !== null && assistantId !== undefined ? String(assistantId) : null;
        setSelectedAssistantId(resolvedId);
        const assistant = assistantOptions.find((option) => String(option?.id) === resolvedId);
        setSearchTerm(formatAssistantOption(assistant));
        setIsDropdownOpen(false);
    };

    const handleSubmit = async () => {
        const trimmedFeedback = feedback.trim();

        if (!normalizedModulId) {
            toast.error("Modul feedback tidak ditemukan.");
            return;
        }

        if (!praktikanId) {
            toast.error("Data praktikan tidak valid.");
            return;
        }

        if (trimmedFeedback.length < 10 || !selectedAssistantId) {
            toast.error("Lengkapi feedback dan pilih asisten penanggung jawab.");
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post("/api-v1/laporan-praktikan", {
                praktikan_id: praktikanId,
                modul_id: Number(normalizedModulId),
                laporan: trimmedFeedback,
                pesan: trimmedFeedback,
                rating: ratingPraktikum || null,
                rating_praktikum: ratingPraktikum || null,
                rating_asisten: ratingAsisten || null,
                asisten_id: selectedAssistantId ? Number(selectedAssistantId) : null,
            });

            toast.success("Feedback berhasil dikirim. Terima kasih!");
            router.visit(route("praktikum"));
        } catch (error) {
            toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal mengirim feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSubmitDisabled =
        !normalizedModulId ||
        !selectedAssistantId ||
        feedback.trim().length < 10 ||
        isSubmitting;

    return (
        <>
            <PraktikanAuthenticated
                user={praktikanData}
                praktikan={praktikanData}
                customWidth="w-[80%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Feedback Praktikum
                    </h2>
                }
            >
                <Head title="Feedback Praktikum" />

                <div className="mt-[6vh] flex flex-col gap-6">
                    <div className="rounded-depth-lg border border-depth bg-depth-card/80 p-6 shadow-depth-lg">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-depth-primary">Bagikan Pengalamanmu</h1>
                                <p className="mt-2 text-sm text-depth-secondary">
                                    Feedback ini membantu tim asisten meningkatkan kualitas praktikum.
                                </p>
                                {modulLabel && (
                                    <p className="mt-2 text-xs font-medium text-depth-tertiary">
                                        Modul Praktikum: <span className="text-depth-primary">{modulLabel}</span>
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => router.visit(route("praktikum"))}
                                className="rounded-depth-md border border-depth px-4 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                Kembali ke Praktikum
                            </button>
                        </div>

                        {!normalizedModulId && (
                            <div className="mb-6 rounded-depth-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                Modul untuk feedback belum ditentukan. Kembali ke halaman praktikum untuk memilih modul.
                            </div>
                        )}

                        <div className="mb-6" ref={dropdownRef}>
                            <label className="mb-3 block text-sm font-semibold text-depth-primary">
                                Pilih Asisten Penanggung Jawab <span className="text-red-500">*</span>
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
                                            <div className="px-4 py-3 text-sm text-depth-secondary">Asisten tidak ditemukan.</div>
                                        ) : (
                                            <ul className="divide-y divide-[color:var(--depth-border)]">
                                                {filteredAssistants.map((assistant) => (
                                                    <li key={`assistant-option-${assistant.id}`}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAssistantSelect(assistant.id)}
                                                            className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition hover:bg-depth-interactive ${
                                                                String(assistant.id) === selectedAssistantId
                                                                    ? "bg-depth-interactive/80 font-semibold"
                                                                    : "text-depth-primary"
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
                                    Asisten terpilih:{" "}
                                    {formatAssistantOption(assistantOptions.find((assistant) => String(assistant?.id) === selectedAssistantId))}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-3 block text-sm font-semibold text-depth-primary">
                                    Rating Praktikum (Opsional)
                                </label>
                                <div className="flex gap-2">
                                    {STAR_VALUES.map((star) => (
                                        <button
                                            key={`praktikum-rating-${star}`}
                                            type="button"
                                            onClick={() => setRatingPraktikum(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`h-8 w-8 ${star <= ratingPraktikum ? "fill-amber-400 text-amber-400" : "fill-none text-gray-400 dark:text-gray-600"}`}
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
                                {ratingPraktikum > 0 && (
                                    <p className="mt-2 text-xs text-depth-secondary">
                                        {ratingDescription(ratingPraktikum, "praktikum")}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-3 block text-sm font-semibold text-depth-primary">
                                    Rating Asisten (Opsional)
                                </label>
                                <div className="flex gap-2">
                                    {STAR_VALUES.map((star) => (
                                        <button
                                            key={`assistant-rating-${star}`}
                                            type="button"
                                            onClick={() => setRatingAsisten(star)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <svg
                                                className={`h-8 w-8 ${star <= ratingAsisten ? "fill-amber-400 text-amber-400" : "fill-none text-gray-400 dark:text-gray-600"}`}
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
                                {ratingAsisten > 0 && (
                                    <p className="mt-2 text-xs text-depth-secondary">
                                        {ratingDescription(ratingAsisten, "asisten")}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-6">
                            <label htmlFor="feedback" className="mb-2 block text-sm font-semibold text-depth-primary">
                                Feedback / Laporan Praktikan <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(event) => setFeedback(event.target.value)}
                                rows={8}
                                className="w-full rounded-depth-lg border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                placeholder="Bagikan pengalaman Anda selama praktikum, kendala yang dihadapi, saran perbaikan, atau hal lain yang ingin disampaikan..."
                            />
                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span className={feedback.trim().length < 10 ? "text-red-500" : "text-green-600 dark:text-green-400"}>
                                    {feedback.trim().length < 10
                                        ? `Minimal 10 karakter (${Math.max(0, 10 - feedback.trim().length)} lagi)`
                                        : "Feedback sudah cukup"}
                                </span>
                                <span className="text-depth-secondary">{feedback.length} karakter</span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                                className={`glass-button inline-flex min-w-[160px] items-center justify-center gap-2 rounded-depth-lg px-6 py-3 font-semibold shadow-depth-md transition-all ${
                                    isSubmitDisabled ? "cursor-not-allowed opacity-50" : "hover:-translate-y-0.5 hover:shadow-depth-lg"
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
                                {isSubmitting ? "Mengirim..." : "Kirim Feedback"}
                            </button>
                        </div>
                    </div>
                </div>
            </PraktikanAuthenticated>

            <PraktikanUtilities />
        </>
    );
}
