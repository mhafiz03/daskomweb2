import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function TPReview({ modulId, onNavigate }) {
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
                const [questionResponse, answerResponse] = await Promise.all([
                    api.get(`/api-v1/soal-tp/${modulId}`),
                    api
                        .get(`/api-v1/jawaban-tp/${modulId}`)
                        .then((response) => response.data)
                        .catch((fetchError) => {
                            const status = fetchError?.response?.status;
                            if (status === 403 || status === 404) {
                                return {};
                            }

                            throw fetchError;
                        }),
                ]);

                const questions = Array.isArray(questionResponse?.data) ? questionResponse.data : [];
                const answers = Array.isArray(answerResponse?.jawaban_tp) ? answerResponse.jawaban_tp : [];

                const answerMap = new Map(answers.map((answer) => [answer.soal_id, answer.jawaban ?? "-"]));

                setEntries(
                    questions.map((question, index) => ({
                        id: question.id,
                        number: index + 1,
                        question: question.soal ?? question.pertanyaan ?? "",
                        answer: answerMap.get(question.id) ?? "-",
                    }))
                );
            } catch (loadError) {
                console.error("Failed to load TP review", loadError);
                const message = loadError?.response?.data?.message ?? loadError.message ?? "Gagal memuat review tugas pendahuluan.";
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
                    Review Tugas Pendahuluan
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
                    className="space-y-6 overflow-y-auto"
                    style={{ maxHeight: "calc(80vh - 6rem)" }}
                >
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="relative p-4 bg-softIvory rounded-lg border-4 border-softPearl shadow-lg"
                        >
                            <pre
                                className="p-4 rounded-lg text-sm overflow-y-auto overflow-x-hidden shadow-lg bg-softIvory"
                                style={{ whiteSpace: "pre-wrap" }}
                            >
                                {entry.number}. {entry.question}
                            </pre>

                            <div className="mt-4 p-3 bg-softPearl rounded-lg border-2 shadow-lg border-darkGray">
                                <span className="text-gray-700 text-sm font-semibold">
                                    Jawaban: {entry.answer}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
