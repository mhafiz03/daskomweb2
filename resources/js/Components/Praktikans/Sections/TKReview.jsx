import { useEffect, useState } from "react";
import { api } from "@/lib/api";

const determineMode = (questionText) => {
    if (!questionText) {
        return "bg-softIvory";
    }

    const simpleKeywords = [";", "{", "}", "#", "//"];
    return simpleKeywords.some((keyword) => questionText.includes(keyword)) ? "bg-gray-200" : "bg-softIvory";
};

export default function TKReview({ modulId, onNavigate }) {
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
                    .get(`/api-v1/jawaban-tk/${modulId}`)
                    .then((res) => res.data)
                    .catch((fetchError) => {
                        const status = fetchError?.response?.status;
                        if (status === 403 || status === 404) {
                            return {};
                        }

                        throw fetchError;
                    });

                const records = Array.isArray(response?.jawaban_tk) ? response.jawaban_tk : [];

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
                console.error("Failed to load TK review", loadError);
                const message = loadError?.response?.data?.message ?? loadError.message ?? "Gagal memuat review tes keterampilan.";
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
                    Review Tes Keterampilan
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
