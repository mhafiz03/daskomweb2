import { useEffect } from "react";
import QuestionCommentInput from "./QuestionCommentInput";

export default function Mandiri({
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
        setQuestionsCount(Array.isArray(questions) ? questions.length : 0);
    }, [questions, setQuestionsCount]);

    const handleInputChange = (index, value) => {
        const updated = [...answers];
        updated[index] = value;
        setAnswers(updated);
    };

    const handleSubmit = () => {
        if (onSubmitTask) {
            onSubmitTask("Mandiri", answers);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-[1vh] p-5 text-center">
                <p className="text-depth-secondary">Memuat soal mandiri...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mt-[1vh] p-5 text-center">
                <p className="text-red-400 font-semibold">{errorMessage}</p>
            </div>
        );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        return (
            <div className="mt-[1vh] p-5 text-center">
                <p className="text-depth-secondary">Belum ada soal mandiri untuk modul ini.</p>
            </div>
        );
    }

    return (
        <div className=" p-5 py-0 transition-all duration-300 w-full mx-auto">
            {/* Header */}
            <div className="flex bg-[var(--depth-color-primary)] rounded-depth-lg py-3 px-4 mb-6 justify-center shadow-depth-lg">
                <h1 className="text-white text-center font-bold text-2xl">
                    Mandiri
                </h1>
            </div>

            {/* Questions Container */}
            <div className="space-y-8 max-h-[88vh] p-6 rounded-depth-lg border border-depth bg-depth-card overflow-y-auto overflow-x-hidden shadow-depth-lg">
                {questions.map((question, index) => (
                    <div 
                        key={question.id ?? index} 
                        className="p-5 rounded-depth-lg border border-depth bg-depth-interactive shadow-depth-md hover:shadow-depth-lg transition-all duration-200"
                    >
                        {/* Question and Answer Side by Side */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Question Column */}
                            <div className="flex flex-col gap-4">
                                {/* Question Number and Text */}
                                <div className="mb-4">
                                    <div className="flex items-start gap-3 pr-11">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-depth-full bg-[var(--depth-color-primary)] text-white font-bold text-sm shadow-depth-sm">
                                            {index + 1}
                                        </span>
                                        <p className="flex-1 text-depth-primary font-medium text-lg leading-relaxed whitespace-pre-wrap">
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
                                </div>
                            </div>

                            {/* Answer Column */}
                            <div className="flex flex-col gap-4">
                                {/* Answer Textarea */}
                                <textarea
                                    className="w-full bg-depth-card h-full p-3 border border-depth rounded-depth-md text-depth-primary placeholder-depth-secondary shadow-depth-sm focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:border-transparent transition-all resize-y"
                                    placeholder="Tulis jawaban Anda di sini..."
                                    value={answers[index] ?? ""}
                                    onChange={(event) => handleInputChange(index, event.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
