import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import QuestionCommentInput from "./QuestionCommentInput";
import { useImageKitUpload } from "@/hooks/useImageKitUpload";
import { Image } from "@imagekit/react";

SyntaxHighlighter.registerLanguage('c', c);

export default function Jurnal({
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
    const [uploadingIndexes, setUploadingIndexes] = useState({});
    const [uploadProgress, setUploadProgress] = useState({});
    const [previews, setPreviews] = useState({});
    const { upload } = useImageKitUpload();

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

    const triggerFileInput = (index) => {
        const input = document.getElementById(`file-upload-${index}`);
        if (input) {
            input.click();
        }
    };

    const handleFileUpload = async (index, file) => {
        if (!file) {
            return;
        }

        // Check file size (10MB limit)
        if (file.size > 10485760) {
            alert("File size must be less than 10MB");
            return;
        }

        // Check file type (images only)
        if (!file.type.startsWith('image/')) {
            alert("Please upload an image file");
            return;
        }

        setUploadingIndexes(prev => ({ ...prev, [index]: true }));
        setUploadProgress(prev => ({ ...prev, [index]: 0 }));

        try {
            // Create preview
            const previewUrl = URL.createObjectURL(file);
            setPreviews(prev => ({ ...prev, [index]: previewUrl }));

            // Upload to ImageKit
            const uploadResult = await upload(file, 'daskom/jawaban-jurnal', null, true);

            // Store the upload metadata in answers
            const updated = [...answers];
            updated[index] = {
                type: 'file',
                url: uploadResult.url,
                fileId: uploadResult.fileId,
                filePath: uploadResult.filePath,
            };
            setAnswers(updated);

        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload file. Please try again.');
            setPreviews(prev => {
                const newPreviews = { ...prev };
                delete newPreviews[index];
                return newPreviews;
            });
        } finally {
            setUploadingIndexes(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });
            setUploadProgress(prev => {
                const newState = { ...prev };
                delete newState[index];
                return newState;
            });
        }
    };

    const handleDeleteFile = (index) => {
        // Clear the file data
        const updated = [...answers];
        updated[index] = '';
        setAnswers(updated);

        // Clear preview
        setPreviews(prev => {
            const newPreviews = { ...prev };
            if (newPreviews[index]) {
                URL.revokeObjectURL(newPreviews[index]);
                delete newPreviews[index];
            }
            return newPreviews;
        });
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
        <div className="p-5 py-0 transition-all duration-300 w-full ">
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

                            const isFileUploadEnabled = question.enable_file_upload || false;
                            const currentAnswer = answers[index];
                            const isFileAnswer = typeof currentAnswer === 'object' && currentAnswer?.type === 'file';

                            return (
                                <div 
                                    key={question.id ?? `fitb-${index}`} 
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
                                                <QuestionCommentInput
                                                    questionId={question.id ?? question.soalId ?? question.soal_id ?? null}
                                                    tipeSoal={question.questionType === "fitb" ? "fitb" : tipeSoal}
                                                    praktikanId={praktikanId}
                                                    isEnabled={isCommentEnabled}
                                                    className="pl-11"
                                                />
                                            </div>
                                        </div>

                                        {/* Answer Column */}
                                        <div className="flex flex-col gap-4">
                                        {isFileUploadEnabled ? (
                                            <div className="space-y-3">
                                                {!isFileAnswer && !previews[index] ? (
                                                    <div>
                                                        <label
                                                            htmlFor={`file-upload-${index}`}
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-depth rounded-depth-md cursor-pointer bg-depth-card hover:bg-depth-hover transition-all"
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    className="w-10 h-10 mb-3 text-depth-secondary"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                                <p className="mb-2 text-sm text-depth-secondary">
                                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p className="text-xs text-depth-secondary">
                                                                    PNG, JPG, GIF up to 10MB
                                                                </p>
                                                            </div>
                                                        </label>
                                                        <div className="mt-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => triggerFileInput(index)}
                                                                className="inline-flex items-center rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                                            >
                                                                Pilih File
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="relative rounded-depth-md border border-depth bg-depth-card p-3">
                                                        {uploadingIndexes[index] ? (
                                                            <div className="flex flex-col items-center justify-center py-8">
                                                                <div className="w-16 h-16 border-4 border-[var(--depth-color-primary)] border-t-transparent rounded-full animate-spin mb-3"></div>
                                                                <p className="text-sm text-depth-secondary">
                                                                    Uploading... {uploadProgress[index]}%
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {isFileAnswer && currentAnswer.url ? (
                                                                    <Image
                                                                        src={currentAnswer.url}
                                                                        alt="Uploaded answer"
                                                                        transformation={[{ width: "800", quality: "80" }]}
                                                                        className="w-full h-auto rounded-depth-md shadow-depth-sm"
                                                                        loading="lazy"
                                                                    />
                                                                ) : previews[index] ? (
                                                                    <img
                                                                        src={previews[index]}
                                                                        alt="Preview"
                                                                        className="w-full h-auto rounded-depth-md shadow-depth-sm"
                                                                    />
                                                                ) : null}

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFile(index)}
                                                                    className="absolute top-5 right-5 p-2 rounded-depth-full bg-red-500 text-white hover:bg-red-600 shadow-depth-md transition-all"
                                                                    title="Delete image"
                                                                >
                                                                    <svg
                                                                        className="w-5 h-5"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <div className="mt-3 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => triggerFileInput(index)}
                                                                        className="inline-flex items-center rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                                                    >
                                                                        Ganti File
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                                <input
                                                    id={`file-upload-${index}`}
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            handleFileUpload(index, file);
                                                        }
                                                    }}
                                                    disabled={uploadingIndexes[index]}
                                                />
                                            </div>
                                        ) : (
                                            <textarea
                                                className="w-full bg-depth-card h-full   p-3 border border-depth rounded-depth-md text-depth-primary placeholder-depth-secondary shadow-depth-sm focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:border-transparent transition-all "
                                                placeholder="Masukkan jawaban di sini..."
                                                value={answers[index] ?? ""}
                                                onChange={(event) => handleInputChange(index, event.target.value)}
                                            />
                                        )}
                                        </div>
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

                            const isFileUploadEnabled = question.enable_file_upload || false;
                            const currentAnswer = answers[index];
                            const isFileAnswer = typeof currentAnswer === 'object' && currentAnswer?.type === 'file';

                            return (
                                <div 
                                    key={question.id ?? `jurnal-${index}`} 
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
                                                    tipeSoal={question.questionType === "fitb" ? "fitb" : tipeSoal}
                                                    praktikanId={praktikanId}
                                                    isEnabled={isCommentEnabled}
                                                    className="pl-11"
                                                />
                                            </div>
                                        </div>

                                        {/* Answer Column */}
                                        <div className="flex flex-col gap-4">
                                        {isFileUploadEnabled ? (
                                            <div className="space-y-3">
                                                {/* File Upload Area */}
                                                {!isFileAnswer && !previews[index] ? (
                                                    <div>
                                                        <label
                                                            htmlFor={`file-upload-${index}`}
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-depth rounded-depth-md cursor-pointer bg-depth-card hover:bg-depth-hover transition-all"
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg
                                                                    className="w-10 h-10 mb-3 text-depth-secondary"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                                <p className="mb-2 text-sm text-depth-secondary">
                                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                                </p>
                                                                <p className="text-xs text-depth-secondary">
                                                                    PNG, JPG, GIF up to 10MB
                                                                </p>
                                                            </div>
                                                        </label>
                                                        <div className="mt-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => triggerFileInput(index)}
                                                                className="inline-flex items-center rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                                            >
                                                                Pilih File
                                                            </button>
                                                        </div>
                                                        <input
                                                            id={`file-upload-${index}`}
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    handleFileUpload(index, file);
                                                                }
                                                            }}
                                                            disabled={uploadingIndexes[index]}
                                                        />
                                                    </div>
                                                ) : (
                                                    /* Image Preview */
                                                    <div className="relative rounded-depth-md border border-depth bg-depth-card p-3">
                                                        {uploadingIndexes[index] ? (
                                                            <div className="flex flex-col items-center justify-center py-8">
                                                                <div className="w-16 h-16 border-4 border-[var(--depth-color-primary)] border-t-transparent rounded-full animate-spin mb-3"></div>
                                                                <p className="text-sm text-depth-secondary">
                                                                    Uploading... {uploadProgress[index]}%
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {isFileAnswer && currentAnswer.url ? (
                                                                    <Image
                                                                        src={currentAnswer.url}
                                                                        alt="Uploaded answer"
                                                                        transformation={[{ width: "800", quality: "80" }]}
                                                                        className="w-full h-auto rounded-depth-md shadow-depth-sm"
                                                                        loading="lazy"
                                                                    />
                                                                ) : previews[index] ? (
                                                                    <img
                                                                        src={previews[index]}
                                                                        alt="Preview"
                                                                        className="w-full h-auto rounded-depth-md shadow-depth-sm"
                                                                    />
                                                                ) : null}
                                                                
                                                                {/* Delete Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteFile(index)}
                                                                    className="absolute top-5 right-5 p-2 rounded-depth-full bg-red-500 text-white hover:bg-red-600 shadow-depth-md transition-all"
                                                                    title="Delete image"
                                                                >
                                                                    <svg
                                                                        className="w-5 h-5"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                                <div className="mt-3 text-right">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => triggerFileInput(index)}
                                                                        className="inline-flex items-center rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-1.5 text-xs font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                                                    >
                                                                        Ganti File
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            /* Text Input */
                                            <textarea
                                                className="w-full bg-depth-card h-full p-3 border border-depth rounded-depth-md text-depth-primary placeholder-depth-secondary shadow-depth-sm focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:border-transparent transition-all "
                                                placeholder="Tulis jawaban lengkap Anda di sini..."
                                                value={answers[index] ?? ""}
                                                onChange={(event) => handleInputChange(index, event.target.value)}
                                            />
                                        )}
                                        </div>
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
