import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Modal from "./Modal";
import { api } from "@/lib/api";

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const safeFetch = async (url) => {
    try {
        const { data } = await api.get(url);
        return data;
    } catch (error) {
        const status = error?.response?.status;
        if (status === 404 || status === 403) {
            return error?.response?.data ?? {
                status: "error",
                message: error?.response?.data?.message ?? error?.message ?? "Gagal memuat jawaban.",
            };
        }

        throw error;
    }
};

const normaliseEssayAnswers = (payload, key) => {
    if (!payload) {
        return { items: [], message: null };
    }

    if (Array.isArray(payload[key])) {
        return {
            items: payload[key],
            message: null,
        };
    }

    const fallbackMessage = payload?.message ?? payload?.messages ?? null;

    return {
        items: [],
        message: fallbackMessage,
    };
};

const normaliseChoiceAnswers = (payload, key) => {
    if (!payload) {
        return { items: [], message: null };
    }

    if (Array.isArray(payload[key])) {
        return {
            items: payload[key].map((item, index) => ({
                ...item,
                index,
                options: normalizeArray(item.options),
            })),
            message: null,
        };
    }

    const fallbackMessage = payload?.message ?? payload?.messages ?? null;

    return {
        items: [],
        message: fallbackMessage,
    };
};

const ANSWER_QUERY_KEY = "praktikan-answer-detail";

export default function ModalPraktikanAnswers({ isOpen, onClose, modulId, modulTitle }) {
    const answersQuery = useQuery({
        queryKey: [ANSWER_QUERY_KEY, modulId],
        enabled: isOpen && Boolean(modulId),
        queryFn: async () => {
            if (!modulId) {
                return null;
            }

            const [tp, ta, jurnal, mandiri, tk] = await Promise.all([
                safeFetch(`/api-v1/jawaban-tp/${modulId}`),
                safeFetch(`/api-v1/jawaban-ta/${modulId}`),
                safeFetch(`/api-v1/jawaban-jurnal/${modulId}`),
                safeFetch(`/api-v1/jawaban-tm/${modulId}`),
                safeFetch(`/api-v1/jawaban-tk/${modulId}`),
            ]);

            return {
                tp: normaliseEssayAnswers(tp, "jawaban_tp"),
                ta: normaliseChoiceAnswers(ta, "jawaban_ta"),
                jurnal: normaliseEssayAnswers(jurnal, "jawaban_jurnal"),
                mandiri: normaliseEssayAnswers(mandiri, "jawaban_mandiri"),
                tk: normaliseChoiceAnswers(tk, "jawaban_tk"),
            };
        },
        onError: (error) => {
            const message = error?.response?.data?.message ?? error?.message ?? "Gagal memuat jawaban.";
            toast.error(message);
        },
    });

    const sections = useMemo(() => {
        if (!answersQuery.data) {
            return [];
        }

        return [
            {
                key: "tp",
                title: "Tugas Pendahuluan",
                type: "essay",
                payload: answersQuery.data.tp,
            },
            {
                key: "ta",
                title: "Tes Awal",
                type: "choice",
                payload: answersQuery.data.ta,
            },
            {
                key: "jurnal",
                title: "Jurnal",
                type: "essay",
                payload: answersQuery.data.jurnal,
            },
            {
                key: "mandiri",
                title: "Mandiri",
                type: "essay",
                payload: answersQuery.data.mandiri,
            },
            {
                key: "tk",
                title: "Tes Keterampilan",
                type: "choice",
                payload: answersQuery.data.tk,
            },
        ];
    }, [answersQuery.data]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} width="w-full">
            <div className="space-y-5">
                <header className="space-y-1">
                    <h2 className="text-lg font-semibold text-darkGray">Jawaban Praktikum</h2>
                    <p className="text-sm text-mediumGray">Modul: <span className="font-medium text-darkGray">{modulTitle ?? `Modul ${modulId}`}</span></p>
                </header>

                {answersQuery.isLoading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-12 text-mediumGray">
                        <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-darkGray border-t-transparent" />
                        Memuat jawaban praktikan...
                    </div>
                )}

                {answersQuery.isError && !answersQuery.isLoading && (
                    <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-500">
                        {answersQuery.error?.response?.data?.message ?? answersQuery.error?.message ?? "Gagal memuat jawaban."}
                    </div>
                )}

                {!answersQuery.isLoading && !answersQuery.isError && sections.map((section) => (
                    <SectionAnswers key={section.key} section={section} />
                ))}
            </div>
        </Modal>
    );
}

const SectionAnswers = ({ section }) => {
    const { title, payload, type } = section;
    const items = payload?.items ?? [];
    const message = payload?.message ?? null;

    return (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-3">
                <h3 className="text-base font-semibold text-darkGray">{title}</h3>
            </header>

            {message && (
                <div className="mb-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-600">
                    {message}
                </div>
            )}

            {items.length === 0 && !message && (
                <p className="text-sm text-mediumGray">Belum ada jawaban yang tersimpan.</p>
            )}

            {items.length > 0 && (
                <div className="space-y-3">
                    {items.map((item, index) => (
                        <AnswerCard key={item.id ?? item.soal_id ?? index} item={item} index={index} type={type} />
                    ))}
                </div>
            )}
        </section>
    );
};

const AnswerCard = ({ item, index, type }) => {
    if (type === "choice") {
        const selectedId = Number(item?.selected_opsi_id ?? 0);
        const correctId = Number(item?.opsi_benar_id ?? 0);

        return (
            <article className="rounded-depth-md border border-slate-200 bg-softGray p-4 shadow-depth-sm">
                <header className="mb-2 space-y-1">
                    <div className="text-xs font-semibold uppercase tracking-wide text-mediumGray">
                        Soal {index + 1}
                    </div>
                    {item?.pertanyaan && <p className="text-sm font-medium text-darkGray">{item.pertanyaan}</p>}
                </header>
                <ul className="space-y-2">
                    {item.options.map((option) => {
                        const isSelected = Number(option.id) === selectedId;
                        const isCorrect = Number(option.id) === correctId;

                        const toneClass = isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-600"
                            : isSelected
                                ? "border-amber-300 bg-amber-50 text-amber-600"
                                : "border-slate-200 bg-white text-darkGray";

                        return (
                            <li
                                key={option.id}
                                className={`rounded-lg border px-3 py-2 text-sm shadow-sm transition ${toneClass}`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <span>{option.text}</span>
                                    <div className="flex shrink-0 items-center gap-2 text-xs font-semibold uppercase">
                                        {isCorrect && <span>Benar</span>}
                                        {isSelected && !isCorrect && <span className="text-amber-600">Jawabanmu</span>}
                                        {isSelected && isCorrect && <span>Jawabanmu</span>}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </article>
        );
    }

    const answerText = item?.jawaban ?? "-";
    const questionLabel = item?.soal_text ?? item?.pertanyaan ?? null;

    return (
        <article className="rounded-depth-md border border-slate-200 bg-softGray p-4 shadow-depth-sm">
            <header className="mb-2 space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wide text-mediumGray">
                    Soal {index + 1}
                </div>
                {questionLabel && <p className="text-sm font-medium text-darkGray">{questionLabel}</p>}
            </header>
            <div className="rounded-depth-md border border-slate-200 bg-white px-3 py-2 text-sm text-darkGray shadow-inner">
                {answerText}
            </div>
        </article>
    );
};
