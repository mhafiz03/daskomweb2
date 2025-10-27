import { useEffect } from "react";

const determineMode = (questionText) => {
    if (!questionText) {
        return "bg-softIvory";
    }

    const simpleKeywords = [";", "{", "}", "#", "//"];
    return simpleKeywords.some((keyword) => questionText.includes(keyword)) ? "bg-gray-200" : "bg-softIvory";
};

export default function TesAwal({
    isLoading = false,
    errorMessage = null,
    questions = [],
    answers = [],
    setAnswers,
    setQuestionsCount,
    onSubmitTask,
}) {
    useEffect(() => {
        setQuestionsCount(questions.length);
    }, [questions, setQuestionsCount]);

    const handleOptionChange = (index, optionId) => {
        const updated = [...answers];
        updated[index] = optionId;
        setAnswers(updated);
    };

    const handleSubmit = () => {
        if (onSubmitTask) {
            onSubmitTask("TesAwal", answers);
        }
    };

    if (isLoading) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-gray-600">Memuat soal tes awal...</p>
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
                <p className="text-gray-600">Belum ada soal tes awal untuk modul ini.</p>
            </div>
        );
    }

    return (
        <div className="mt-[1vh] p-5 transition-all duration-300 max-w-4xl mx-auto rounded-lg">
            <div className="flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-center">
                <h1 className="text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[50%]">
                    Tes Awal
                </h1>
            </div>

    
            <div className="space-y-6 max-h-[56vh] p-4 rounded-lg border-4 bg-softIvory border-softPearl transition-colors duration-300 overflow-y-auto overflow-x-hidden">
                {questions.map((question, index) => (
                    <div key={question.id ?? index} className="space-y-3">
                        <pre
                            className={`p-4 rounded-lg text-sm overflow-y-auto overflow-x-hidden shadow-lg ${determineMode(
                                question.text
                            )}`}
                            style={{ whiteSpace: "pre-wrap" }}
                        >
                            {index + 1}. {question.text}
                        </pre>

                        <div className="mt-3 space-y-2">
                            {(question.options ?? []).map((option) => {
                                const isSelected = answers[index] === option.id;

                                return (
                                    <label
                                        key={option.id}
                                        className={`flex items-center gap-3 rounded-md border px-3 py-2 text-sm transition ${
                                            isSelected
                                                ? "border-deepForestGreen bg-emerald-50"
                                                : "border-transparent bg-white hover:border-dustyBlue"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`tes-awal-${question.id}`}
                                            value={option.id}
                                            checked={isSelected}
                                            onChange={() => handleOptionChange(index, option.id)}
                                            className="h-4 w-4 border-gray-300 text-deepForestGreen focus:ring-deepForestGreen"
                                        />
                                        <span className="text-gray-800">{option.text}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-5 flex justify-end">
                <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-deepForestGreen text-white font-bold rounded-md shadow hover:bg-deepForestGreenDark"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}
