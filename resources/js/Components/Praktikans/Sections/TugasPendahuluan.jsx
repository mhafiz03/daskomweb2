import { useEffect } from "react";
import QuestionCommentInput from "./QuestionCommentInput";

export default function TugasPendahuluan({
    isLoading = false,
    errorMessage = null,
    questions = [],
    answers = [],
    setAnswers,
    setQuestionsCount,
    onSubmitTask,
    tipeSoal = null,
    praktikanId = null,
    isCommentEnabled = false,
}) {
    useEffect(() => {
        setQuestionsCount(questions.length);
    }, [questions, setQuestionsCount]);

    const handleInputChange = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = () => {
        if (onSubmitTask) {
            onSubmitTask("TugasPendahuluan", answers);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-gray-600">Memuat soal tugas pendahuluan...</p>
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
                <p className="text-gray-600">Belum ada soal tugas pendahuluan untuk modul ini.</p>
            </div>
        );
    }

    return (
        <div className="mt-[1vh] p-5 transition-all duration-300 max-w-4xl mx-auto rounded-lg">
            <div className="flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-center">
                <h1 className="text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[50%]">
                    Tugas Pendahuluan
                </h1>
            </div>

            <div className="space-y-6 max-h-[55vh] p-4 rounded-lg border-4 bg-softIvory border-softPearl transition-colors duration-300 overflow-y-auto overflow-x-hidden">
                {questions.map((question, index) => (
                    <div key={question.id ?? index} className="space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-deepForestGreen text-sm font-semibold text-white">
                                {index + 1}
                            </span>
                            <p className="flex-1 text-base font-semibold text-darkBrown">
                                {question.text}
                            </p>
                        </div>
                        <QuestionCommentInput
                            questionId={question.id ?? question.soalId ?? question.soal_id ?? null}
                            tipeSoal={tipeSoal}
                            praktikanId={praktikanId}
                            isEnabled={isCommentEnabled}
                            className="pl-11"
                        />
                        <textarea
                            className="shadow-lg w-full bg-gainsboro min-h-[96px] p-2 border border-gray-300 rounded-md"
                            placeholder="Jawaban"
                            value={answers[index] ?? ""}
                            onChange={(event) => handleInputChange(index, event.target.value)}
                        ></textarea>
                    </div>
                ))}
            </div>
        </div>
    );
}
