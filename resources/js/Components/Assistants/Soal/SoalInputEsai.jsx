import { useState } from "react";
import ModalDeleteSoal from "../Modals/ModalDeleteSoal";
import ModalEditSoalEssay from "../Modals/ModalEditSoalEssay";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useSoalQuery, soalQueryKey } from "@/hooks/useSoalQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { send } from "@/lib/wayfinder";
import { getSoalController } from "@/lib/soalControllers";

export default function SoalInputEssay({ kategoriSoal, modul, onModalSuccess, onModalValidation }) {
    const [addSoal, setAddSoal] = useState({ soal: "" });
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [editingSoal, setEditingSoal] = useState(null);

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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: soalQueryKey(kategoriSoal, modul) });
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

    const handleTambahSoal = () => {
        if (!addSoal.soal.trim()) {
            onModalValidation();
            return;
        }

        postSoalMutation.mutate({ soal: addSoal.soal.trim() });
        setAddSoal({ soal: "" });
        onModalSuccess();
    };

    const handleOpenModalDelete = (soalId) => {
        deleteSoalMutation.mutate(soalId);
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
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
        putSoalMutation.mutate({
            soalId: updatedSoal.id,
            payload: {
                modul_id: updatedSoal.modul_id,
                soal: updatedSoal.soal,
            },
        });
        handleCloseModalEdit();
    };

    return (
        <div>
            <label className="block mb-2 font-medium">Soal</label>
            <textarea
                className="w-full p-2 border rounded"
                rows="8"
                placeholder="Masukkan soal..."
                value={addSoal.soal}
                onChange={(e) => setAddSoal({ soal: e.target.value })}
            />

            <div className="flex justify-end space-x-3 mt-3">
                <button
                    className="text-md py-1 px-8 font-bold border text-white rounded-md shadow-sm bg-deepForestGreen border-deepForestGreen"
                    onClick={handleTambahSoal}
                    disabled={postSoalMutation.isPending}
                >
                    {postSoalMutation.isPending ? "Menyimpan..." : "+ Tambah Soal"}
                </button>
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-lg mb-3">Daftar Soal</h3>
                {soalLoading && <p>Memuat soal...</p>}
                {soalError && (
                    <p className="text-red-500">
                        {soalQueryError?.message ?? "Gagal memuat soal"}
                    </p>
                )}
                {!soalLoading && !soalError && (
                    <ul className="space-y-3">
                        {soalList.map((soalItem, index) => (
                            <li
                                key={soalItem.id ?? index}
                                className="border border-gray-300 rounded-lg flex items-baseline bg-softIvory shadow-lg justify-between"
                            >
                                <div className="flex-1 p-4">
                                    <strong>Soal: {index + 1}</strong>
                                    <br />
                                    <pre className="ml-2 text-sm text-justify">{soalItem.soal}</pre>
                                </div>
                                <div className="flex space-x-2 p-2">
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

            {isModalOpenDelete && (
                <ModalDeleteSoal onClose={handleCloseModalDelete} onConfirm={handleCloseModalDelete} />
            )}
            {isModalOpenEdit && (
                <ModalEditSoalEssay
                    soalItem={editingSoal}
                    onClose={handleCloseModalEdit}
                    onSave={handleConfirmEdit}
                />
            )}
        </div>
    );
}
