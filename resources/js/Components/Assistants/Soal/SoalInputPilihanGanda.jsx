import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { send } from "@/lib/wayfinder";
import { useSoalQuery, soalQueryKey } from "@/hooks/useSoalQuery";
import { getSoalController } from "@/lib/soalControllers";
import ModalEditSoalPG from "../Modals/ModalEditSoalPG";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import toast from "react-hot-toast";
import ModalBatchEditSoal from "../Modals/ModalBatchEditSoal";
import SoalCommentsButton from "./SoalCommentsButton";

const OPTION_COUNT = 4;
const EMPTY_OPTIONS = Array.from({ length: OPTION_COUNT }, () => "");

const isOptionCorrect = (soalItem, option, optionIndex) => {
    if (typeof option?.is_correct === "boolean") {
        return option.is_correct;
    }

    if (option?.id && soalItem?.opsi_benar_id) {
        return option.id === soalItem.opsi_benar_id;
    }

    if (typeof soalItem?.correct_option === "number") {
        return soalItem.correct_option === optionIndex;
    }

    return false;
};

const normalizeOptionsForDisplay = (soalItem) => {
    const options = soalItem?.options ?? [];
    const normalized = options.map((option) => ({
        id: option?.id ?? null,
        text: option?.text ?? "",
        is_correct: option?.is_correct,
    }));

    while (normalized.length < OPTION_COUNT) {
        normalized.push({ id: null, text: "", is_correct: false });
    }

    return normalized;
};

export default function SoalInputPG({ kategoriSoal, modul, modules = [], onModalSuccess, onModalValidation, onChangeModul }) {
    const [formState, setFormState] = useState({
        pertanyaan: "",
        options: [...EMPTY_OPTIONS],
        correctIndex: 0,
    });
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [editingSoal, setEditingSoal] = useState(null);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const soalQuery = useSoalQuery(kategoriSoal, modul);
    const soalList = soalQuery.data ?? [];

    const controller = getSoalController(kategoriSoal);

    const postSoalMutation = useMutation({
        mutationFn: async (payload) => {
            if (!controller) {
                throw new Error(`Kategori soal tidak didukung: ${kategoriSoal}`);
            }

            const { data } = await send(controller.store(modul), payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, modul) });
            if (typeof onModalSuccess === "function") {
                onModalSuccess();
            }
        },
    });

    const putSoalMutation = useMutation({
        mutationFn: async ({ soalId, payload }) => {
            if (!controller) {
                throw new Error(`Kategori soal tidak didukung: ${kategoriSoal}`);
            }

            const { data } = await send(controller.update(soalId), payload);
            return data;
        },
        onSuccess: (_, variables) => {
            const previousKey = variables?.previousModulKey ?? modul;
            const nextKey = variables?.nextModulKey ?? previousKey;

            if (previousKey) {
                queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, previousKey) });
            }

            if (nextKey && nextKey !== previousKey) {
                queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, nextKey) });
            }
        },
    });

    const deleteSoalMutation = useMutation({
        mutationFn: async (soalId) => {
            if (!controller) {
                throw new Error(`Kategori soal tidak didukung: ${kategoriSoal}`);
            }

            await send(controller.destroy(soalId));
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, modul) });
        },
    });

    const batchUpdateMutation = useMutation({
        mutationFn: async ({ items, modulId }) => {
            if (!controller) {
                throw new Error(`Kategori soal tidak didukung: ${kategoriSoal}`);
            }

            const targetModulId = Number(modulId ?? modul);
            if (!targetModulId || Number.isNaN(targetModulId)) {
                throw new Error("Modul belum dipilih.");
            }

            const existingItems = soalList ?? [];
            const maxLength = Math.max(existingItems.length, items?.length ?? 0);

            for (let i = 0; i < maxLength; i += 1) {
                const existingItem = existingItems[i] ?? null;
                const desiredItem = items?.[i] ?? null;
                const desiredQuestion = desiredItem?.pertanyaan?.trim() ?? "";
                const desiredOptions = (desiredItem?.options ?? []).map((option) => ({
                    text: (option?.text ?? "").trim(),
                    isCorrect: Boolean(option?.isCorrect),
                }));

                if (existingItem && desiredQuestion) {
                    if (desiredOptions.length !== OPTION_COUNT) {
                        throw new Error(`Soal ${i + 1} harus memiliki ${OPTION_COUNT} pilihan.`);
                    }

                    if (desiredOptions.some((option) => option.text.length === 0)) {
                        throw new Error(`Semua pilihan pada Soal ${i + 1} harus diisi.`);
                    }

                    const existingOptions = normalizeOptionsForDisplay(existingItem);
                    const payloadOptions = desiredOptions.map((option, optionIndex) => ({
                        id: existingOptions[optionIndex]?.id ?? null,
                        text: option.text,
                    }));
                    const correctIndex = desiredOptions.findIndex((option) => option.isCorrect);
                    const finalCorrectIndex = correctIndex >= 0 ? correctIndex : 0;
                    const existingCorrectIndexRaw = existingOptions.findIndex((option, optionIndex) =>
                        isOptionCorrect(existingItem, option, optionIndex),
                    );
                    const existingCorrectIndex = existingCorrectIndexRaw >= 0 ? existingCorrectIndexRaw : 0;

                    const hasQuestionChanged = existingItem.pertanyaan !== desiredQuestion;
                    const hasOptionChanged = payloadOptions.some(
                        (option, optionIndex) =>
                            option.text !== (existingOptions[optionIndex]?.text ?? ""),
                    );
                    const hasCorrectChanged =
                        finalCorrectIndex !== (existingCorrectIndex >= 0 ? existingCorrectIndex : 0);

                    if (
                        hasQuestionChanged ||
                        hasOptionChanged ||
                        hasCorrectChanged ||
                        existingItem.modul_id !== targetModulId
                    ) {
                        await send(controller.update(existingItem.id), {
                            modul_id: targetModulId,
                            pertanyaan: desiredQuestion,
                            options: payloadOptions,
                            correct_option: finalCorrectIndex,
                        });
                    }
                } else if (existingItem && !desiredQuestion) {
                    await send(controller.destroy(existingItem.id));
                } else if (!existingItem && desiredQuestion) {
                    if (desiredOptions.length !== OPTION_COUNT) {
                        throw new Error(`Soal ${i + 1} harus memiliki ${OPTION_COUNT} pilihan.`);
                    }

                    if (desiredOptions.some((option) => option.text.length === 0)) {
                        throw new Error(`Semua pilihan pada Soal ${i + 1} harus diisi.`);
                    }

                    const correctIndex = desiredOptions.findIndex((option) => option.isCorrect);
                    const finalCorrectIndex = correctIndex >= 0 ? correctIndex : 0;

                    await send(controller.store(targetModulId), {
                        pertanyaan: desiredQuestion,
                        options: desiredOptions.map((option) => ({ text: option.text })),
                        correct_option: finalCorrectIndex,
                    });
                }
            }
        },
        onSuccess: (_, variables) => {
            const targetModulId = String(variables?.modulId ?? modul ?? "");
            const currentModulId = String(modul ?? "");

            if (currentModulId) {
                queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, currentModulId) });
            }

            if (targetModulId && targetModulId !== currentModulId) {
                queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, targetModulId) });
            }

            toast.success("Soal berhasil diperbarui.");
        },
        onError: (error) => {
            console.error("Error batch updating soal PG:", error);
            toast.error(
                error?.response?.data?.message ??
                error?.message ??
                "Gagal memperbarui soal.",
            );
        },
    });

    const handleOptionChange = (index, value) => {
        setFormState((prev) => {
            const updated = [...prev.options];
            updated[index] = value;
            return { ...prev, options: updated };
        });
    };

    const handleSetCorrect = (index) => {
        setFormState((prev) => ({ ...prev, correctIndex: index }));
    };

    const handleTambahSoal = () => {
        if (!modul) {
            onModalValidation?.({ message: "Pilih modul terlebih dahulu.", includeModuleNotice: false });
            return;
        }

        const { pertanyaan, options, correctIndex } = formState;

        if (!pertanyaan.trim()) {
            onModalValidation?.({ message: "Pertanyaan tidak boleh kosong." });
            return;
        }

        if (options.some((option) => !option.trim())) {
            onModalValidation?.({ message: "Semua pilihan jawaban harus diisi." });
            return;
        }

        const uniqueOptions = new Set(options.map((option) => option.trim()));
        if (uniqueOptions.size !== options.length) {
            onModalValidation?.({ message: "Teks pilihan tidak boleh duplikat." });
            return;
        }

        postSoalMutation.mutate({
            pertanyaan: pertanyaan.trim(),
            options: options.map((option) => ({ text: option.trim() })),
            correct_option: correctIndex,
        });

        setFormState({
            pertanyaan: "",
            options: [...EMPTY_OPTIONS],
            correctIndex: 0,
        });

    };

    const handleOpenModalDelete = (soalId) => {
        deleteSoalMutation.mutate(soalId);
        toast.success('Soal berhasil dihapus!');
    };

    const handleOpenModalEdit = (soalItem) => {
        setEditingSoal(soalItem);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setEditingSoal(null);
        setIsModalOpenEdit(false);
    };

    const handleConfirmEdit = (updatedSoal) => {
        const previousModulKey =
            editingSoal?.modul_id !== undefined && editingSoal?.modul_id !== null
                ? String(editingSoal.modul_id)
                : modul;
        const parsedNextModulId =
            updatedSoal.modul_id !== undefined && updatedSoal.modul_id !== null
                ? Number(updatedSoal.modul_id)
                : Number.NaN;
        const nextModulId = Number.isNaN(parsedNextModulId)
            ? editingSoal?.modul_id ?? (modul ? Number(modul) : undefined)
            : parsedNextModulId;
        const nextModulKey =
            nextModulId !== undefined && nextModulId !== null
                ? String(nextModulId)
                : previousModulKey;

        if (nextModulId === undefined || nextModulId === null) {
            toast.error("Pilih modul untuk soal ini.");
            return;
        }

        putSoalMutation.mutate({
            soalId: updatedSoal.id,
            payload: {
                modul_id: nextModulId,
                pertanyaan: updatedSoal.pertanyaan,
                options: updatedSoal.options,
                correct_option: updatedSoal.correct_option,
            },
            previousModulKey,
            nextModulKey,
        });

        handleCloseModalEdit();
    };

    const batchContent = useMemo(() => {
        if (!Array.isArray(soalList) || soalList.length === 0) {
            return "Daftar Soal\n\n_Belum ada soal untuk ditampilkan._";
        }

        return soalList
            .map((soalItem, index) => {
                const options = normalizeOptionsForDisplay(soalItem);
                const optionsMarkdown = options
                    .map((option, optionIndex) => {
                        const isCorrect = isOptionCorrect(soalItem, option, optionIndex);
                        const indicator = isCorrect ? "[x]" : "[ ]";
                        const text = option.text?.trim() || "_(kosong)_";
                        return `- ${indicator} ${text}`;
                    })
                    .join("\n");

                const pertanyaan = soalItem.pertanyaan?.trim() ?? "_(kosong)_";

                return `Soal ${index + 1}\n\nPertanyaan:\n${pertanyaan}\n\nPilihan:\n${optionsMarkdown}`;
            })
            .join("\n\n");
    }, [soalList]);

    const handleBatchSubmit = async ({ items, modulId }) => {
        const normalizedItems = Array.isArray(items)
            ? items.map((item) => ({
                pertanyaan: (item?.pertanyaan ?? "").trim(),
                options: (item?.options ?? []).map((option) => ({
                    text: (option?.text ?? "").trim(),
                    isCorrect: Boolean(option?.isCorrect),
                })),
            }))
            : [];

        const targetModulId = modulId ?? modul;
        await batchUpdateMutation.mutateAsync({ items: normalizedItems, modulId: targetModulId });

        if (targetModulId && onChangeModul && String(targetModulId) !== String(modul ?? "")) {
            onChangeModul(String(targetModulId));
        }
    };

    return (
        <div className="space-y-6 text-depth-primary">
            <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                    Soal
                </label>
                <textarea
                    className="w-full rounded-depth-lg border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-sm transition duration-200 placeholder:text-depth-secondary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--depth-color-card)]"
                    rows={4}
                    placeholder="Masukkan soal..."
                    value={formState.pertanyaan}
                    onChange={(e) =>
                        setFormState((prev) => ({ ...prev, pertanyaan: e.target.value }))
                    }
                />
            </div>

            <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                    Pilihan Jawaban
                </label>
                <div className="space-y-3">
                    {formState.options.map((option, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 rounded-depth-lg border border-depth bg-depth-card p-3 shadow-depth-sm transition-colors duration-200"
                        >
                            <input
                                type="radio"
                                name="correctOption"
                                checked={formState.correctIndex === index}
                                onChange={() => handleSetCorrect(index)}
                                className="h-4 w-4 accent-[var(--depth-color-primary)]"
                            />
                            <input
                                type="text"
                                className="flex-1 rounded-depth-md border border-transparent bg-depth-interactive p-3 text-sm text-depth-primary shadow-depth-inset transition duration-200 placeholder:text-depth-secondary focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button
                    className="rounded-depth-md border border-depth bg-depth-card px-6 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-depth-md disabled:opacity-60"
                    onClick={() => setIsBatchModalOpen(true)}
                    disabled={soalQuery.isLoading || soalList.length === 0}
                >
                    Batch Edit
                </button>
                <button
                    className="rounded-depth-md bg-[var(--depth-color-primary)] px-6 py-2 text-sm font-semibold text-white shadow-depth-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-depth-md focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--depth-color-card)] disabled:opacity-70"
                    onClick={handleTambahSoal}
                    disabled={postSoalMutation.isPending}
                >
                    {postSoalMutation.isPending ? "Menyimpan..." : "+ Tambah Soal"}
                </button>
            </div>

            <div className="space-y-4">
                <h3 className="text-base font-semibold text-depth-secondary">
                    Soal yang telah ditambahkan:
                </h3>
                {soalQuery.isLoading && (
                    <p className="text-sm text-depth-secondary">Memuat soal...</p>
                )}
                {soalQuery.isError && (
                    <p className="text-sm text-red-500">
                        {soalQuery.error?.message ?? "Gagal memuat soal"}
                    </p>
                )}
                {!soalQuery.isLoading && !soalQuery.isError && (
                    <ul className="space-y-4">
                        {soalList.map((soalItem, index) => (
                            <li
                                key={soalItem.id ?? index}
                                className="relative rounded-depth-lg border border-depth bg-depth-card p-5 shadow-depth-md transition duration-200 hover:shadow-depth-lg"
                            >
                                <div className="mb-4 space-y-2">
                                    <div className="text-sm font-semibold text-depth-secondary">
                                        Soal {index + 1}
                                    </div>
                                    <pre className="whitespace-pre-wrap break-words rounded-depth-md bg-depth-interactive p-3 text-sm text-depth-primary shadow-depth-inset">
                                        {soalItem.pertanyaan}
                                    </pre>
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                                        Pilihan
                                    </div>
                                    <ul className="space-y-2">
                                        {normalizeOptionsForDisplay(soalItem).map((option, optionIndex) => {
                                            const isCorrect = isOptionCorrect(soalItem, option, optionIndex);

                                            return (
                                                <li
                                                    key={option.id ?? `${option.text}-${optionIndex}`}
                                                    className={`flex items-center gap-2 rounded-depth-md border border-transparent px-3 py-2 text-sm shadow-depth-sm transition duration-150 ${isCorrect
                                                        ? "border-[var(--depth-color-primary)] bg-[var(--depth-color-primary)] text-white shadow-depth-md"
                                                        : "bg-depth-interactive text-depth-primary"
                                                        }`}
                                                >
                                                    {option.text ? (
                                                        option.text
                                                    ) : (
                                                        <span className="italic text-depth-secondary">
                                                            Belum diisi
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                <div className="absolute right-4 top-4 flex gap-2">
                                    <button
                                        onClick={() => handleOpenModalDelete(soalItem.id)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth bg-depth-interactive text-red-500 shadow-depth-sm transition duration-150 hover:border-red-400 hover:shadow-depth-md"
                                        type="button"
                                    >
                                        <img className="h-4 w-4" src={trashIcon} alt="Delete" />
                                    </button>
                                    <SoalCommentsButton
                                        kategoriSoal={kategoriSoal}
                                        modulId={soalItem?.modul_id ?? (modul ? Number(modul) : null)}
                                        soalId={soalItem?.id}
                                        variant="icon"
                                    />
                                    <button
                                        onClick={() => handleOpenModalEdit(soalItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth bg-depth-interactive shadow-depth-sm transition duration-150 hover:border-blue-400 hover:shadow-depth-md"
                                        type="button"
                                    >
                                        <img className="edit-icon-filter h-4 w-4" src={editIcon} alt="Edit" />
                                    </button>
                                    
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {isModalOpenEdit && (
                <ModalEditSoalPG
                    soalItem={editingSoal}
                    onClose={handleCloseModalEdit}
                    onConfirm={handleConfirmEdit}
                />
            )}
            {isBatchModalOpen && (
                <ModalBatchEditSoal
                    title="Batch Edit Soal Pilihan Ganda"
                    initialValue={batchContent}
                    variant="pg"
                    moduleOptions={modules}
                    initialModuleId={modul}
                    onClose={() => setIsBatchModalOpen(false)}
                    onSubmit={handleBatchSubmit}
                />
            )}
        </div>
    );
}
