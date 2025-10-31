import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

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

    const CopyButton = ({ code }) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };

        return (
            <button
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy"}
            className="absolute top-2 right-2 px-2.5 py-1.5 bg-depth-interactive border border-depth rounded-depth-md text-depth-primary hover:bg-[var(--depth-color-primary)] hover:text-white transition-all shadow-depth-sm"
            >
            {copied ? (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <path d="M5 13l4 4L19 7" />
                </svg>
            ) : (
                <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
            )}
            </button>
        );
    };

    if (isLoading) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-depth-secondary">Memuat soal jurnal...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-red-400 font-semibold">{errorMessage}</p>
            </div>
        );
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        return (
            <div className="mt-[1vh] p-5 max-w-4xl mx-auto text-center">
                <p className="text-depth-secondary">Belum ada soal untuk modul ini.</p>
            </div>
        );
    }

    return (
        <div className="-mt-[8vh] p-5 transition-all duration-300 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex bg-[var(--depth-color-primary)] rounded-depth-lg py-3 px-4 mb-6 justify-center shadow-depth-lg">
                <h1 className="text-white text-center font-bold text-2xl">
                    Jurnal
                </h1>
            </div>

            {/* Questions Container */}
            <div className="space-y-8 max-h-[88vh] p-6 rounded-depth-lg border border-depth bg-depth-card overflow-y-auto overflow-x-hidden shadow-depth-lg">
                {/* FITB Questions Section */}
                {groupedQuestions.fitb.length > 0 && (
                    <section className="space-y-6">
                        {groupedQuestions.fitb.map((question) => {
                            const index = questions.findIndex((item) => item.id === question.id);

                            if (index === -1) {
                                return null;
                            }

                            return (
                                <div 
                                    key={question.id ?? `fitb-${index}`} 
                                    className="p-5 rounded-depth-lg border border-depth bg-depth-interactive shadow-depth-md hover:shadow-depth-lg transition-all duration-200"
                                >
                                    {/* Question Number and Text */}
                                    <div className="mb-4">
                                        <div className="flex items-start gap-3 pr-11">
                                            <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-depth-full bg-[var(--depth-color-primary)] text-white font-bold text-sm shadow-depth-sm">
                                                {index + 1}
                                            </span>
                                            <div className="flex-1 text-depth-primary font-medium text-base leading-relaxed prose prose-invert max-w-none max-h-[60vh] overflow-y-auto">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                                    components={{
                                                        code({ node, inline, className, children, ...props }) {
                                                            const match = /language-(\w+)/.exec(className || "");
                                                            const codeString = String(children).replace(/\n$/, "");
                                                            
                                                            return !inline ? (
                                                                <div className="relative my-4">
                                                                    <CopyButton code={codeString} />
                                                                    <SyntaxHighlighter
                                                                        style={vscDarkPlus}
                                                                        language="c"
                                                                        PreTag="div"
                                                                        className="rounded-depth-md shadow-depth-md"
                                                                        {...props}
                                                                    >
                                                                        {codeString}
                                                                    </SyntaxHighlighter>
                                                                </div>
                                                            ) : (
                                                                <code className="bg-depth-card px-1.5 py-0.5 rounded text-sm border border-depth" {...props}>
                                                                    {children}
                                                                </code>
                                                            );
                                                        },
                                                        p: ({ children }) => <p className="mb-2">{children}</p>,
                                                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                                                        ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                                                    }}
                                                >
                                                    {question.text}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pl-11 pr-11">
                                        <textarea
                                            className="w-full bg-depth-card min-h-[80px] p-3 border border-depth rounded-depth-md text-depth-primary placeholder-depth-secondary shadow-depth-sm focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:border-transparent transition-all resize-y"
                                            placeholder="Masukkan jawaban di sini..."
                                            value={answers[index] ?? ""}
                                            onChange={(event) => handleInputChange(index, event.target.value)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Jurnal Questions Section */}
                {groupedQuestions.jurnal.length > 0 && (
                    <section className="space-y-6">
                        {groupedQuestions.jurnal.map((question) => {
                            const index = questions.findIndex((item) => item.id === question.id);

                            if (index === -1) {
                                return null;
                            }

                            return (
                                <div 
                                    key={question.id ?? `jurnal-${index}`} 
                                    className="p-5 rounded-depth-lg border border-depth bg-depth-interactive shadow-depth-md hover:shadow-depth-lg transition-all duration-200"
                                >
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
                                    </div>

                                    {/* Long Answer Textarea */}
                                    <div className="pl-11 pr-11">
                                        <textarea
                                            className="w-full bg-depth-card min-h-[120px] p-3 border border-depth rounded-depth-md text-depth-primary placeholder-depth-secondary shadow-depth-sm focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:border-transparent transition-all resize-y"
                                            placeholder="Tulis jawaban lengkap Anda di sini..."
                                            value={answers[index] ?? ""}
                                            onChange={(event) => handleInputChange(index, event.target.value)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}
            </div>
        </div>
    );
}
