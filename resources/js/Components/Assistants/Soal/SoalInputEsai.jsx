import { useMemo, useState } from "react";
import ModalEditSoalEssay from "../Modals/ModalEditSoalEssay";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useSoalQuery, soalQueryKey } from "@/hooks/useSoalQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { send } from "@/lib/wayfinder";
import { getSoalController } from "@/lib/soalControllers";
import toast from "react-hot-toast";
import ModalBatchEditSoal from "../Modals/ModalBatchEditSoal";

export default function SoalInputEssay({ kategoriSoal, modul, modules = [], onModalSuccess, onModalValidation, onChangeModul }) {
    const [addSoal, setAddSoal] = useState({ soal: "" });
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [editingSoal, setEditingSoal] = useState(null);
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const soalQuery = useSoalQuery(kategoriSoal, modul);
    const soalList = soalQuery.data ?? [];
    const soalLoading = soalQuery.isLoading;
    const soalError = soalQuery.isError;
    const soalQueryError = soalQuery.error;

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
        onError: (err) => {
            console.error("Error posting soal:", err);
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
                queryClient.invalidateQueries({
                    queryKey: soalQueryKey(kategoriSoal, previousKey),
                });
            }

            if (nextKey && nextKey !== previousKey) {
                queryClient.invalidateQueries({
                    queryKey: soalQueryKey(kategoriSoal, nextKey),
                });
            }
        },
        onError: (err) => {
            console.error("Error updating soal:", err);
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
        onError: (err) => {
            console.error("Error deleting soal:", err);
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
                const desiredText = desiredItem?.soal?.trim() ?? "";

                if (existingItem && desiredText) {
                    if (existingItem.soal !== desiredText || existingItem.modul_id !== targetModulId) {
                        await send(controller.update(existingItem.id), {
                            modul_id: targetModulId,
                            soal: desiredText,
                            oldSoal: existingItem.soal,
                        });
                    }
                } else if (existingItem && !desiredText) {
                    await send(controller.destroy(existingItem.id));
                } else if (!existingItem && desiredText) {
                    await send(controller.store(targetModulId), { soal: desiredText });
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
            console.error("Error batch updating soal:", error);
            toast.error(
                error?.response?.data?.message ??
                    error?.message ??
                    "Gagal memperbarui soal.",
            );
        },
    });

    const handleTambahSoal = () => {
        if (!modul) {
            onModalValidation?.({ message: "Pilih modul terlebih dahulu.", includeModuleNotice: false });
            return;
        }

        if (!addSoal.soal.trim()) {
            onModalValidation?.({
                message: "Isi soal terlebih dahulu sebelum menyimpan.",
                includeModuleNotice: false,
            });
            return;
        }

        postSoalMutation.mutate({ soal: addSoal.soal.trim() });
        setAddSoal({ soal: "" });
    };

    const handleOpenModalDelete = (soalId) => {
        deleteSoalMutation.mutate(soalId);
        toast.success("Soal berhasil dihapus!");
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
                soal: updatedSoal.soal,
                oldSoal: editingSoal?.soal ?? updatedSoal.soal,
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
            .map(
                (item, index) =>
                    `Soal ${index + 1}\n\n${item.soal?.trim() ?? "_(kosong)_"}\n`,
            )
            .join("\n\n");
    }, [soalList]);

    const handleBatchSubmit = async ({ items, modulId }) => {
        const normalizedItems = Array.isArray(items)
            ? items.map((item) => ({
                  soal: (item?.soal ?? "").trim(),
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
                    className="h-48 w-full rounded-depth-lg border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-sm transition duration-200 placeholder:text-depth-secondary focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--depth-color-card)]"
                    rows="8"
                    placeholder="Masukkan soal..."
                    value={addSoal.soal}
                    onChange={(e) => setAddSoal({ soal: e.target.value })}
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    className="rounded-depth-md border border-depth bg-depth-card px-6 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-depth-md disabled:opacity-60"
                    onClick={() => setIsBatchModalOpen(true)}
                    disabled={soalLoading || soalList.length === 0}
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
                <h3 className="text-base font-semibold text-depth-secondary">Daftar Soal</h3>
                {soalLoading && <p className="text-sm text-depth-secondary">Memuat soal...</p>}
                {soalError && (
                    <p className="text-sm text-red-500">
                        {soalQueryError?.message ?? "Gagal memuat soal"}
                    </p>
                )}
                {!soalLoading && !soalError && (
                    <ul className="space-y-4">
                        {soalList.map((soalItem, index) => (
                            <li
                                key={soalItem.id ?? index}
                                className="relative flex items-start justify-between gap-4 rounded-depth-lg border border-depth bg-depth-card p-5 shadow-depth-md transition duration-200 hover:shadow-depth-lg"
                            >
                                <div className="flex-1 space-y-2">
                                    <div className="text-sm font-semibold text-depth-secondary">
                                        Soal {index + 1}
                                    </div>
                                    <pre className="whitespace-pre-wrap break-words rounded-depth-md bg-depth-interactive p-3 text-sm text-depth-primary shadow-depth-inset">
                                        {soalItem.soal}
                                    </pre>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModalEdit(soalItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth bg-depth-interactive shadow-depth-sm transition duration-150 hover:shadow-depth-md"
                                        type="button"
                                    >
                                        <img className="h-4 w-4" src={editIcon} alt="Edit" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModalDelete(soalItem.id)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-red-300 bg-depth-interactive text-red-500 shadow-depth-sm transition duration-150 hover:border-red-400 hover:shadow-depth-md"
                                        type="button"
                                    >
                                        <img className="h-4 w-4" src={trashIcon} alt="Delete" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isModalOpenEdit && (
                <ModalEditSoalEssay
                    soalItem={editingSoal}
                    onClose={handleCloseModalEdit}
                    onSave={handleConfirmEdit}
                />
            )}
            {isBatchModalOpen && (
                <ModalBatchEditSoal
                    title="Batch Edit Soal Essay"
                    initialValue={batchContent}
                    variant="essay"
                    moduleOptions={modules}
                    initialModuleId={modul}
                    onClose={() => setIsBatchModalOpen(false)}
                    onSubmit={handleBatchSubmit}
                />
            )}
        </div>
    );
}
