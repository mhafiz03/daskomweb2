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
    variant = "embedded",
    showSubmitButton = false,
    submitLabel = "Simpan Jawaban",
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

    const containerClasses =
        variant === "standalone"
            ? "mx-auto mt-8 max-w-5xl space-y-6 rounded-depth-lg border border-depth bg-depth-card/70 p-6 shadow-depth-lg"
            : "mt-[1vh] p-5 transition-all duration-300 max-w-4xl mx-auto rounded-lg";

    const headerClasses =
        variant === "standalone"
            ? "flex items-center justify-between rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-3 shadow-depth-md"
            : "flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-center";

    const titleClasses =
        variant === "standalone"
            ? "text-lg font-semibold text-white"
            : "text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[50%]";

    const contentClasses =
        variant === "standalone"
            ? "space-y-6 max-h-[60vh] overflow-y-auto rounded-depth-md border border-depth bg-depth-interactive/40 p-5 shadow-inner"
            : "space-y-6 max-h-[55vh] p-4 rounded-lg border-4 bg-softIvory border-softPearl transition-colors duration-300 overflow-y-auto overflow-x-hidden";

    const answerTextareaClasses =
        variant === "standalone"
            ? "w-full rounded-depth-md border border-depth bg-depth-card/80 p-3 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)]"
            : "shadow-lg w-full bg-gainsboro min-h-[96px] p-2 border border-gray-300 rounded-md";

    return (
        <div className={containerClasses}>
            <div className={headerClasses}>
                <h1 className={titleClasses}>Tugas Pendahuluan</h1>
                {variant === "standalone" && (
                    <p className="text-xs font-medium text-white/80">
                        Lengkapi jawabanmu sebelum praktikum dimulai.
                    </p>
                )}
            </div>

            <div className={contentClasses}>
                {questions.map((question, index) => (
                    <div key={question.id ?? index} className="space-y-3">
                        <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--depth-color-primary)] text-sm font-semibold text-white shadow-depth-sm">
                                {index + 1}
                            </span>
                            <p className="flex-1 text-base font-semibold text-depth-primary">
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
                            className={answerTextareaClasses}
                            placeholder="Tulis jawabanmu di sini..."
                            value={answers[index] ?? ""}
                            onChange={(event) => handleInputChange(index, event.target.value)}
                        ></textarea>
                    </div>
                ))}
            </div>

            {showSubmitButton && (
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="inline-flex items-center justify-center rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        {submitLabel}
                    </button>
                </div>
            )}
        </div>
    );
}
