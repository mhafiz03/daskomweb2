import { useEffect, useMemo } from "react";

export default function Jurnal({
    isLoading = false,
    errorMessage = null,
    questions = [],
    answers = [],
    setAnswers,
    setQuestionsCount,
    onSubmitTask,
}) {
    useEffect(() => {
        setQuestionsCount(Array.isArray(questions) ? questions.length : 0);
    }, [questions, setQuestionsCount]);

    const groupedQuestions = useMemo(() => {
        if (!Array.isArray(questions)) {
            return { fitb: [], jurnal: [] };
        }

        return {
            fitb: questions.filter((question) => question.questionType === "fitb"),
            jurnal: questions.filter((question) => question.questionType !== "fitb"),
        };
    }, [questions]);

    const handleInputChange = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = () => {
        if (onSubmitTask) {
            onSubmitTask("Jurnal", answers);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-gray-600">Memuat soal jurnal...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-red-600 font-semibold">{errorMessage}</p>
            </div>
        );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-gray-600">Belum ada soal untuk modul ini.</p>
            </div>
        );
    }

    return (
        <div className="mt-[1vh] p-5 transition-all duration-300 max-w-4xl mx-auto rounded-lg">
            <div className="flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-center">
                <h1 className="text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[50%]">
                    Jurnal
                </h1>
            </div>

            <div className="space-y-6 max-h-[55vh] p-4 rounded-lg border-4 bg-softIvory border-softPearl transition-colors duration-300 overflow-y-auto overflow-x-hidden">
                {groupedQuestions.fitb.length > 0 && (
                    <section className="space-y-4">
                        {groupedQuestions.fitb.map((question) => {
                            const index = questions.findIndex((item) => item.id === question.id);

                            if (index === -1) {
                                return null;
                            }

                            return (
                                <div key={question.id ?? `fitb-${index}`} className="space-y-3">
                                    <pre className="text-sm font-semibold text-darkBrown">
                                        {index + 1}. {question.text}
                                    </pre>
                                    <input
                                        type="text"
                                        className="shadow-lg w-full bg-gainsboro p-2 border border-gray-300 rounded-md"
                                        placeholder="Jawaban singkat"
                                        value={answers[index] ?? ""}
                                        onChange={(event) => handleInputChange(index, event.target.value)}
                                    />
                                </div>
                            );
                        })}
                    </section>
                )}

                {groupedQuestions.jurnal.length > 0 && (
                    <section className="space-y-4">
                        {groupedQuestions.jurnal.map((question) => {
                            const index = questions.findIndex((item) => item.id === question.id);

                            if (index === -1) {
                                return null;
                            }
                            return (
                                <div key={question.id ?? `jurnal-${index}`} className="space-y-3">
                                    <pre className="text-sm font-semibold text-darkBrown">
                                        {index + 1}. {question.text}
                                    </pre>
                                    <textarea
                                        className="shadow-lg w-full bg-gainsboro min-h-[96px] p-2 border border-gray-300 rounded-md"
                                        placeholder="Jawaban"
                                        value={answers[index] ?? ""}
                                        onChange={(event) => handleInputChange(index, event.target.value)}
                                    ></textarea>
                                </div>
                            );
                        })}
                    </section>
                )}
            </div>
        </div>
    );
}
