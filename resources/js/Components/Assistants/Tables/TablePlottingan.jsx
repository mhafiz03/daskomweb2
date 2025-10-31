import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ModalDeletePlottingan from "../Modals/ModalDeletePlottingan";
import ModalEditPlotting from "../Modals/ModalEditPlottingan";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useKelasQuery, KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function TablePlottingan() {
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState(null);
    const queryClient = useQueryClient();

    // Urutan hari untuk sorting
    const dayOrder = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];

    // Fungsi untuk sorting data kelas
    const sortKelas = (data) => {
        return [...data].sort((a, b) => {
            // Urutkan berdasarkan hari
            const dayA = dayOrder.indexOf(a.hari);
            const dayB = dayOrder.indexOf(b.hari);

            if (dayA !== dayB) {
                return dayA - dayB;
            }

            // Jika hari sama, urutkan berdasarkan shift
            return a.shift - b.shift;
        });
    };

    const {
        data: kelasData = [],
        isLoading,
        isError,
        error,
    } = useKelasQuery();

    const kelas = useMemo(() => sortKelas(kelasData), [kelasData]);

    const deleteKelasMutation = useMutation({
        mutationFn: async (kelasId) => {
            await api.delete(`/api-v1/kelas/${kelasId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            toast.success("Kelas berhasil dihapus.");
        },
        onError: (err) => {
            const responseMessage = err?.response?.data?.message ?? "Gagal menghapus kelas. Silakan coba lagi.";
            toast.error(responseMessage);
        },
        onSettled: () => {
            setIsModalOpenDelete(false);
            setSelectedKelas(null);
        },
    });

    const handleOpenModalDelete = (kelasItem) => {
        setSelectedKelas(kelasItem); // Pastikan kelasItem memiliki properti id
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleConfirmDelete = async () => {
        deleteKelasMutation.mutate(selectedKelas.id);
    };

    const handleOpenModalEdit = (kelas) => {
        setSelectedKelas(kelas);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
    };

    // const handleOpenModalPlot = (kelas) => {
    //     setSelectedKelas(kelas);
    //     setIsModalOpenPlot(true);
    // };

    // const handleCloseModalPlot = () => {
    //     setIsModalOpenPlot(false);
    // };

    return (
        <div className="space-y-4">
            <div className="rounded-depth-lg border border-depth bg-depth-card p-3 shadow-depth-md">
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold uppercase tracking-wide text-white">
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Kelas</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Hari</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Shift</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Kelompok</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Aksi</div>
                </div>
            </div>

            <div className="rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                {isLoading ? (
                    <div className="px-6 py-10 text-center text-depth-secondary">Memuat data...</div>
                ) : isError ? (
                    <div className="px-6 py-10 text-center text-red-500">
                        Error: {error?.message ?? "Gagal memuat data"}
                    </div>
                ) : kelas.length > 0 ? (
                    <div className="divide-y divide-[color:var(--depth-border)]">
                        {kelas.map((kelasItem) => (
                            <div
                                key={kelasItem.id}
                                className="grid grid-cols-5 items-center gap-2 px-4 py-3 text-sm text-depth-primary"
                            >
                                <span className="text-center font-semibold">{kelasItem.kelas}</span>
                                <span className="text-center text-depth-secondary">{kelasItem.hari}</span>
                                <span className="text-center text-depth-secondary">{kelasItem.shift}</span>
                                <span className="text-center text-depth-secondary">{kelasItem.totalGroup}</span>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModalEdit(kelasItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth bg-depth-interactive shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    >
                                        <img className="edit-icon-filter h-4 w-4" src={editIcon} alt="edit icon" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModalDelete(kelasItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-red-400/60 bg-red-400/15 text-red-500 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    >
                                        <img className="h-4 w-4" src={trashIcon} alt="delete icon" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-10 text-center text-depth-secondary">
                        Tidak ada data kelas yang tersedia.
                    </div>
                )}
            </div>

            {isModalOpenDelete && (
                <ModalDeletePlottingan
                    onClose={handleCloseModalDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {isModalOpenEdit && (
                <ModalEditPlotting onClose={handleCloseModalEdit} kelas={selectedKelas} />
            )}
        </div>
    );
}
