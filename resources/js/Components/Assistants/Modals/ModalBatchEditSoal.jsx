import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import closeIcon from "../../../../assets/modal/iconClose.svg";

const tabs = [
    { key: "text", label: "Text" },
    { key: "preview", label: "Preview" },
    { key: "split", label: "Side by Side" },
];

const proseClassName =
    "prose max-w-none prose-headings:text-darkGreen prose-strong:text-darkBrown prose-li:marker:text-darkBrown whitespace-pre-wrap break-words";

export default function ModalBatchEditSoal({
    title,
    initialValue,
    variant = "essay",
    onClose,
    onSubmit,
    moduleOptions = [],
    initialModuleId = "",
}) {
    const [activeTab, setActiveTab] = useState("text");
    const [content, setContent] = useState(initialValue ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const normalizedModuleOptions = useMemo(
        () =>
            (moduleOptions ?? [])
                .map((option) => {
                    const value = option?.idM ?? option?.id ?? option?.value ?? option?.uuid ?? option?.ID;
                    if (value === undefined || value === null) {
                        return null;
                    }

                    return {
                        value: String(value),
                        label: option?.judul ?? option?.name ?? option?.label ?? option?.title ?? String(value),
                    };
                })
                .filter(Boolean),
        [moduleOptions],
    );

    const [selectedModuleId, setSelectedModuleId] = useState(() => {
        if (initialModuleId) {
            return String(initialModuleId);
        }

        return normalizedModuleOptions[0]?.value ?? "";
    });

    useEffect(() => {
        setContent(initialValue ?? "");
    }, [initialValue]);

    useEffect(() => {
        if (initialModuleId) {
            setSelectedModuleId(String(initialModuleId));
        } else if (normalizedModuleOptions.length > 0) {
            setSelectedModuleId((prev) => prev || normalizedModuleOptions[0]?.value || "");
        }
    }, [initialModuleId, normalizedModuleOptions]);

    const markdownComponents = useMemo(
        () => ({
            code({ inline, className, children, ...props }) {

                return (
                    <SyntaxHighlighter
                        style={oneDark}
                        language='c'
                        showLineNumbers
                        PreTag="div"
                        customStyle={{
                            borderRadius: "0.75rem",
                            background: "#111827",
                            padding: "1.25rem",
                        }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                );
            },
        }),
        [],
    );

    const previewItems = useMemo(() => {
        if (variant === "pg") {
            return parsePgMarkdown(content);
        }
        return parseEssayMarkdown(content);
    }, [content, variant]);

    const renderPreviewContent = () => {
        if (!previewItems.length) {
            return <p className="text-darkBrown italic">Tidak ada konten untuk ditampilkan.</p>;
        }

        if (variant === "pg") {
            return (
                <ul className="space-y-3">
                    {previewItems.map((item, index) => (
                        <li
                            key={`pg-preview-${index}`}
                            className="relative p-5 border border-gray-300 rounded-lg bg-softIvory shadow-lg"
                        >
                            <div className="mb-3">
                                <strong>Soal: {index + 1}</strong>
                                <div className={`ml-4 mt-1 text-sm text-justify ${proseClassName}`}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                        components={markdownComponents}
                                    >
                                        {item.pertanyaan || "_(kosong)_"}
                                    </ReactMarkdown>
                                </div>
                            </div>
                            <div className="mb-2">
                                <strong>Pilihan:</strong>
                                <ul className="ml-4 mt-1 space-y-1">
                                    {item.options.map((option, optionIndex) => (
                                        <li
                                            key={`pg-option-${index}-${optionIndex}`}
                                            className={`px-3 py-1 rounded ${
                                                option.isCorrect
                                                    ? "bg-deepForestGreen text-white"
                                                    : "bg-softIvory border border-gray-200"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                            <div className={`flex-1 ${proseClassName}`}>
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                                    components={markdownComponents}
                                                >
                                                    {option.text || "_(kosong)_"}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            );
        }

        return (
            <ul className="space-y-3">
                {previewItems.map((item, index) => (
                    <li
                        key={`essay-preview-${index}`}
                        className="border border-gray-300 rounded-lg flex items-baseline bg-softIvory shadow-lg justify-between"
                    >
                        <div className="flex-1 p-4">
                            <strong>Soal: {index + 1}</strong>
                            <br />
                            <div className={`ml-2 text-sm text-justify ${proseClassName}`}>
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={markdownComponents}
                                >
                                    {item.soal || "_(kosong)_"}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    const previewPanel = (
        <div className="min-h-[400px] overflow-y-auto border border-darkBrown rounded-md p-4 bg-softIvory">
            {renderPreviewContent()}
        </div>
    );

    const renderTextEditor = (className = "") => (
        <textarea
            className={`w-full h-full min-h-[400px] border border-darkBrown rounded-md p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-deepForestGreen ${className}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Masukkan deskripsi soal dalam format Markdown..."
        />
    );

    const handleSubmit = async () => {
        if (!onSubmit) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        try {
        await onSubmit({
            rawContent: content,
            items: previewItems,
            modulId: selectedModuleId,
        });
        onClose();
    } catch (error) {
            console.error("Batch edit submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
                <div className="flex items-center justify-between border-b border-softGray px-6 py-4">
                    <h2 className="text-2xl font-bold text-darkGreen">{title}</h2>
                    <button onClick={onClose} className="p-1 hover:opacity-70">
                        <img className="w-8" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                {normalizedModuleOptions.length > 0 && (
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-6 py-3 border-b border-softGray bg-softIvory">
                        <span className="text-sm font-semibold text-darkBrown">Modul</span>
                        <select
                            className="w-full md:w-auto border border-darkBrown rounded-md px-3 py-2 shadow-sm"
                            value={selectedModuleId}
                            onChange={(event) => setSelectedModuleId(event.target.value)}
                        >
                            {normalizedModuleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="flex gap-2 border-b border-softGray px-6 py-3">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                                activeTab === tab.key
                                    ? "bg-deepForestGreen text-white shadow"
                                    : "bg-softIvory text-darkBrown hover:bg-softGray"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {activeTab === "text" && renderTextEditor()}
                    {activeTab === "preview" && previewPanel}
                    {activeTab === "split" && (
                        <div className="grid gap-4 md:grid-cols-2">
                            {renderTextEditor("md:min-h-[500px]")}
                            <div className="min-h-[500px] overflow-y-auto border border-darkBrown rounded-md p-4 bg-softIvory">
                                {renderPreviewContent()}
                            </div>
                        </div>
                    )}
                </div>
                {typeof onSubmit === "function" && (
                    <div className="border-t border-softGray px-6 py-4 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="px-5 py-2 rounded-md bg-deepForestGreen text-white font-semibold disabled:opacity-60"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

const parseEssayMarkdown = (markdown) => {
    if (!markdown) {
        return [];
    }

    const regex = /^Soal\s+\d+\s*\n([\s\S]*?)(?=^Soal\s+\d+|\Z)/gm;
    const matches = Array.from(markdown.matchAll(regex));

    if (!matches.length) {
        return [];
    }

    return matches.map((match) => {
        const body = match[1].trim();

        return {
            soal: body || "",
        };
    });
};

const parsePgMarkdown = (markdown) => {
    if (!markdown) {
        return [];
    }

    const regex = /^Soal\s+\d+\s*\n([\s\S]*?)(?=^Soal\s+\d+|\Z)/gm;
    const matches = Array.from(markdown.matchAll(regex));

    if (!matches.length) {
        return [];
    }

    return matches.map((match) => {
        const body = match[1].trim();

        const questionMatch = body.match(/Pertanyaan:\s*\n([\s\S]*?)(?=\nPilihan:|\Z)/);
        const question = questionMatch ? questionMatch[1].trim() : "";

        const optionsMatch = body.match(/Pilihan:\s*\n([\s\S]*)/);
        const optionsSection = optionsMatch ? optionsMatch[1].trim() : "";

        const options = optionsSection
            .split(/\n+/)
            .filter((line) => line.trim().startsWith("-"))
            .map((line) => {
                const stripped = line.replace(/^-+\s*/, "").trim();
                const indicatorMatch = stripped.match(/^\[(x|\s)\]\s*/i);
                const isCorrect = indicatorMatch ? indicatorMatch[1].toLowerCase() === "x" : false;
                const text = indicatorMatch
                    ? stripped.replace(/^\[(x|\s)\]\s*/i, "").trim()
                    : stripped;
                return {
                    text,
                    isCorrect,
                };
            });

        return {
            pertanyaan: question,
            options,
        };
    });
};
