import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TAReview({ modulId, onNavigate }) {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!modulId) {
            setEntries([]);
            setError("Modul tidak ditemukan.");
            return;
        }

        const load = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api
                    .get(`/api-v1/jawaban-ta/${modulId}`)
                    .catch((fetchError) => {
                        const status = fetchError?.response?.status;
                        if (status === 403 || status === 404) {
                            return { data: {} };
                        }

                        throw fetchError;
                    });

                const records = Array.isArray(response?.data?.jawaban_ta) ? response.data.jawaban_ta : [];

                setEntries(
                    records.map((record, index) => ({
                        id: record.soal_id ?? index,
                        number: index + 1,
                        question: record.pertanyaan ?? "",
                        selectedOptionId: record.selected_opsi_id ?? null,
                        correctOptionId: record.opsi_benar_id ?? null,
                        options: Array.isArray(record.options)
                            ? record.options.map((option) => ({
                                  id: option.id,
                                  text: option.text,
                                  isCorrect: option.is_correct ?? false,
                              }))
                            : [],
                    }))
                );
            } catch (loadError) {
                console.error("Failed to load TA review", loadError);
                const message = loadError?.response?.data?.message ?? loadError.message ?? "Gagal memuat review tes awal.";
                setError(message);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [modulId]);

    const handleBack = () => {
        if (typeof onNavigate === "function") {
            onNavigate("ModuleSection");
        }
    };

    return (
        <div className="mt-[1vh] p-5 transition-all duration-300 w-[70vw] max-h-full mx-auto relative right-[-4vw]">
            {/* Header */}
            <div className="flex bg-[var(--depth-color-primary)] rounded-depth-lg py-3 px-4 mb-6 justify-between items-center shadow-depth-lg">
                <h1 className="text-white text-center font-bold text-2xl">
                    Review Tes Awal
                </h1>
                <button
                    onClick={handleBack}
                    className="px-4 py-2 text-sm font-semibold text-white bg-depth-interactive/20 border border-white/30 rounded-depth-md hover:bg-white/10 hover:shadow-depth-sm transition-all duration-200"
                >
                    Kembali
                </button>
            </div>

            {isLoading && (
                <p className="text-depth-secondary text-center">Memuat data review...</p>
            )}

            {error && !isLoading && (
                <p className="text-red-400 text-center font-semibold">{error}</p>
            )}

            {!isLoading && !error && entries.length === 0 && (
                <p className="text-depth-secondary text-center">Belum ada jawaban yang tersimpan untuk modul ini.</p>
            )}

            {!isLoading && !error && entries.length > 0 && (
                <div
                    className="space-y-8 overflow-y-auto p-2"
                    style={{ maxHeight: "calc(80vh - 6rem)" }}
                >
                    {entries.map((entry) => {
                        const isCorrectAnswer = entry.selectedOptionId && entry.selectedOptionId === entry.correctOptionId;
                        
                        return (
                            <div
                                key={entry.id}
                                className="relative p-5 bg-depth-card rounded-depth-lg border border-depth shadow-depth-lg"
                            >
                                {/* Score Badge */}
                                <div className={`absolute -top-3 right-4 px-3 py-1 rounded-depth-full text-xs font-bold shadow-depth-md ${
                                    isCorrectAnswer
                                        ? "bg-green-500 text-white"
                                        : "bg-red-500 text-white"
                                }`}>
                                    Nilai {isCorrectAnswer ? "1.00" : "0.00"} / 1.00
                                </div>

                                {/* Question */}
                                <div className="mb-4 pt-2">
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-depth-full bg-[var(--depth-color-primary)] text-white font-bold text-sm shadow-depth-sm">
                                            {entry.number}
                                        </span>
                                        <p className="flex-1 text-depth-primary font-medium text-base leading-relaxed whitespace-pre-wrap">
                                            {entry.question || "Soal tidak tersedia"}
                                        </p>
                                    </div>
                                </div>

                                {/* Options */}
                                <div className="space-y-3 pl-11">
                                    {entry.options.map((option, optIdx) => {
                                        const isSelected = entry.selectedOptionId === option.id;
                                        const isCorrectOpt = option.isCorrect || option.id === entry.correctOptionId;
                                        const optionLabels = ['A', 'B', 'C', 'D', 'E'];

                                        return (
                                            <div
                                                key={option.id}
                                                className={`flex items-start gap-3 rounded-depth-md border px-4 py-3 text-sm transition-all duration-200 ${
                                                    isCorrectOpt
                                                        ? "border-green-500 bg-green-500/10 shadow-depth-sm"
                                                        : isSelected
                                                        ? "border-red-500 bg-red-500/10 shadow-depth-sm"
                                                        : "border-depth bg-depth-interactive"
                                                }`}
                                            >
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <div
                                                        className={`w-5 h-5 flex items-center justify-center rounded-full border-2 ${
                                                            isSelected 
                                                                ? "bg-depth-primary border-depth-primary" 
                                                                : "bg-transparent border-depth"
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                                                        )}
                                                    </div>
                                                    <span className={`flex items-center justify-center w-6 h-6 rounded-depth-md text-xs font-bold ${
                                                        isCorrectOpt 
                                                            ? "bg-green-500 text-white shadow-depth-sm" 
                                                            : isSelected
                                                            ? "bg-red-500 text-white shadow-depth-sm"
                                                            : "bg-depth-interactive text-depth-secondary"
                                                    }`}>
                                                        {optionLabels[optIdx]}
                                                    </span>
                                                </div>
                                                <span className={`flex-1 leading-relaxed whitespace-pre-wrap ${
                                                    isCorrectOpt || isSelected ? "text-depth-primary font-medium" : "text-depth-primary"
                                                }`}>
                                                    {option.text}
                                                </span>
                                                {isCorrectOpt && (
                                                    <span className="flex-shrink-0 text-green-500 font-semibold text-xs">✓ Benar</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function TAReview({ modulId, onNavigate }) {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!modulId) {
            setEntries([]);
            setError("Modul tidak ditemukan.");
            return;
        }

        const load = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await api
                    .get(`/api-v1/jawaban-ta/${modulId}`)
                    .catch((fetchError) => {
                        const status = fetchError?.response?.status;
                        if (status === 403 || status === 404) {
                            return { data: {} };
                        }

                        throw fetchError;
                    });

                const records = Array.isArray(response?.data?.jawaban_ta) ? response.data.jawaban_ta : [];

                setEntries(
                    records.map((record, index) => ({
                        id: record.soal_id ?? index,
                        number: index + 1,
                        question: record.pertanyaan ?? "",
                        selectedOptionId: record.selected_opsi_id ?? null,
                        correctOptionId: record.opsi_benar_id ?? null,
                        options: Array.isArray(record.options)
                            ? record.options.map((option) => ({
                                  id: option.id,
                                  text: option.text,
                                  isCorrect: option.is_correct ?? false,
                              }))
                            : [],
                    }))
                );
            } catch (loadError) {
                console.error("Failed to load TA review", loadError);
                const message = loadError?.response?.data?.message ?? loadError.message ?? "Gagal memuat review tes awal.";
                setError(message);
                setEntries([]);
            } finally {
                setIsLoading(false);
            }
        };

        load();
    }, [modulId]);

    const handleBack = () => {
        if (typeof onNavigate === "function") {
            onNavigate("ModuleSection");
        }
    };

    return (
        <div className="mt-[1vh] p-5 transition-all duration-300 w-[70vw] max-h-full mx-auto rounded-lg relative right-[-4vw]">
            <div className="flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-between items-center">
                <h1 className="text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                    Review Tes Awal
                </h1>
                <button
                    onClick={handleBack}
                    className="px-4 py-1 text-sm font-semibold text-white bg-darkOliveGreen rounded-md hover:bg-deepForestGreenDark"
                >
                    Kembali
                </button>
            </div>

            {isLoading && (
                <p className="text-gray-600 text-center">Memuat data review...</p>
            )}

            {error && !isLoading && (
                <p className="text-red-600 text-center font-semibold">{error}</p>
            )}

            {!isLoading && !error && entries.length === 0 && (
                <p className="text-gray-600 text-center">Belum ada jawaban yang tersimpan untuk modul ini.</p>
            )}

            {!isLoading && !error && entries.length > 0 && (
                <div
                    className="space-y-8 overflow-y-auto"
                    style={{ maxHeight: "calc(80vh - 6rem)" }}
                >
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="relative p-4 bg-softIvory rounded-lg border-4 border-softPearl shadow-lg"
                        >
                            <span
                                className={`absolute -top-[25px] right-0 text-sm underline ${
                                    entry.selectedOptionId && entry.selectedOptionId === entry.correctOptionId
                                        ? "text-green-700"
                                        : "text-red-600"
                                }`}
                            >
                                Nilai {entry.selectedOptionId && entry.selectedOptionId === entry.correctOptionId ? "1.00" : "0.00"} / 1.00
                            </span>

                            <pre
                                className={`p-4 rounded-lg text-sm overflow-y-auto overflow-x-hidden shadow-lg ${determineMode(
                                    entry.question
                                )}`}
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {entry.number}. {entry.question || "Soal tidak tersedia"}
                            </pre>

                            <div className="mt-3 p-1">
                                {entry.options.map((option) => {
                                    const isSelected = entry.selectedOptionId === option.id;
                                    const isCorrect = option.isCorrect || option.id === entry.correctOptionId;

                                    return (
                                        <div
                                            key={option.id}
                                            className={`flex items-center space-x-3 mb-2 p-2 rounded ${
                                                isCorrect
                                                    ? "bg-green-100 border border-green-400"
                                                    : isSelected
                                                    ? "bg-red-100 border border-red-400"
                                                    : "bg-softIvory border border-transparent"
                                            }`}
                                        >
                                            <div
                                                className={`w-4 h-4 flex items-center justify-center rounded-full border-2 ${
                                                    isSelected ? "bg-black border-black" : "bg-softIvory border-gray-400"
                                                }`}
                                            />
                                            <span className="text-gray-800">{option.text}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
