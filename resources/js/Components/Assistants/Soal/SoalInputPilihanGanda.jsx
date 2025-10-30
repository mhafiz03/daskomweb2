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

export default function SoalInputPG({ kategoriSoal, modul, onModalSuccess, onModalValidation }) {
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
        mutationFn: async ({ items }) => {
            if (!controller) {
                throw new Error(`Kategori soal tidak didukung: ${kategoriSoal}`);
            }

            if (!modul) {
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

                    if (hasQuestionChanged || hasOptionChanged || hasCorrectChanged) {
                        await send(controller.update(existingItem.id), {
                            modul_id: existingItem.modul_id,
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

                    await send(controller.store(modul), {
                        pertanyaan: desiredQuestion,
                        options: desiredOptions.map((option) => ({ text: option.text })),
                        correct_option: finalCorrectIndex,
                    });
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, modul) });
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
        const { pertanyaan, options, correctIndex } = formState;

        if (!pertanyaan.trim() || options.some((option) => !option.trim())) {
            onModalValidation();
            return;
        }

        const uniqueOptions = new Set(options.map((option) => option.trim()));
        if (uniqueOptions.size !== options.length) {
            onModalValidation();
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
            return "## Daftar Soal\n\n_Belum ada soal untuk ditampilkan._";
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

    const handleBatchSubmit = async ({ items }) => {
        const normalizedItems = Array.isArray(items)
            ? items.map((item) => ({
                  pertanyaan: (item?.pertanyaan ?? "").trim(),
                  options: (item?.options ?? []).map((option) => ({
                      text: (option?.text ?? "").trim(),
                      isCorrect: Boolean(option?.isCorrect),
                  })),
              }))
            : [];

        await batchUpdateMutation.mutateAsync({ items: normalizedItems });
    };

    return (
        <div>
            <label className="block font-semibold text-lg mb-2">Soal</label>
            <textarea
                className="w-full p-3 border rounded mb-4"
                rows={4}
                placeholder="Masukkan soal..."
                value={formState.pertanyaan}
                onChange={(e) => setFormState((prev) => ({ ...prev, pertanyaan: e.target.value }))}
            />

            <label className="block mb-2 font-medium">Pilihan Jawaban</label>
            <div className="space-y-3">
                {formState.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                        <input
                            type="radio"
                            name="correctOption"
                            checked={formState.correctIndex === index}
                            onChange={() => handleSetCorrect(index)}
                            className="accent-deepForestGreen"
                        />
                        <input
                            type="text"
                            className="flex-1 p-2 border rounded"
                            placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-3 mt-4">
                <button
                    className="text-md py-1 px-8 font-bold border text-white rounded-md shadow-sm bg-softRed disabled:opacity-60"
                    onClick={() => setIsBatchModalOpen(true)}
                    disabled={soalQuery.isLoading || soalList.length === 0}
                >
                    Batch Edit
                </button>
                <button
                    className="text-md py-1 px-8 font-bold border text-white bg-deepForestGreen border-deepForestGreen rounded-md shadow-sm disabled:opacity-70"
                    onClick={handleTambahSoal}
                    disabled={postSoalMutation.isPending}
                >
                    {postSoalMutation.isPending ? "Menyimpan..." : "+ Tambah Soal"}
                </button>
            </div>

            <div className="mt-5">
                <h3 className="font-bold mb-3">Soal yang telah ditambahkan:</h3>
                {soalQuery.isLoading && <p>Memuat soal...</p>}
                {soalQuery.isError && (
                    <p className="text-red-500">
                        {soalQuery.error?.message ?? "Gagal memuat soal"}
                    </p>
                )}
                {!soalQuery.isLoading && !soalQuery.isError && (
                    <ul className="space-y-3">
                        {soalList.map((soalItem, index) => (
                            <li
                                key={soalItem.id ?? index}
                                className="relative p-5 border border-gray-300 rounded-lg bg-softIvory shadow-lg"
                            >
                                <div className="mb-3">
                                    <strong>Soal: {index + 1}</strong>
                                    <pre className="ml-4 mt-1 text-sm text-justify whitespace-pre-wrap break-words">
                                        {soalItem.pertanyaan}
                                    </pre>
                                </div>

                                <div className="mb-2">
                                    <strong>Pilihan:</strong>
                                    <ul className="ml-4 mt-1 space-y-1">
                                        {normalizeOptionsForDisplay(soalItem).map((option, optionIndex) => (
                                            <li
                                                key={option.id ?? `${option.text}-${optionIndex}`}
                                                className={`px-3 py-1 rounded ${
                                                    isOptionCorrect(soalItem, option, optionIndex)
                                                        ? "bg-deepForestGreen text-white"
                                                        : "bg-softIvory border border-gray-200"
                                                }`}
                                            >
                                                <span className="font-semibold mr-2">
                                                    {String.fromCharCode(65 + optionIndex)}.
                                                </span>
                                                {option.text ? (
                                                    option.text
                                                ) : (
                                                    <span className="italic text-gray-500">Belum diisi</span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        onClick={() => handleOpenModalEdit(soalItem)}
                                        className="flex justify-center items-center p-1 border-2 border-darkBrown rounded bg-white"
                                    >
                                        <img className="w-5" src={editIcon} alt="Edit" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModalDelete(soalItem.id)}
                                        className="flex justify-center items-center p-1 border-2 border-fireRed rounded bg-white"
                                    >
                                        <img className="w-5 h-5" src={trashIcon} alt="Delete" />
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
                    onClose={() => setIsBatchModalOpen(false)}
                    onSubmit={handleBatchSubmit}
                />
            )}
        </div>
    );
}
