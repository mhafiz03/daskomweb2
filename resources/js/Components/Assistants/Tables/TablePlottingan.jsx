import React, { useMemo, useState } from "react";
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
    const [message, setMessage] = useState("");
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
            setMessage("");
        },
        onError: (err) => {
            const responseMessage = err?.response?.data?.message ?? "Gagal menghapus kelas. Silakan coba lagi.";
            setMessage(responseMessage);
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
        <div className="mt-5">
            {/* Header dengan div */}
            <div className="bg-deepForestGreen rounded-lg py-2 px-2 mb-2">
                <div className="grid grid-cols-5 gap-1">
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Kelas</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Hari</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Shift</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Kelompok</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Review</h1>
                    </div>
                </div>
            </div>

            {/* Kontainer untuk scroll tabel */}
            <div className="overflow-x-auto lg:max-h-[48rem] md:max-h-96">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500">Memuat data...</div>
                ) : isError ? (
                    <div className="text-center py-10 text-red-500">Error: {error?.message ?? "Gagal memuat data"}</div>
                ) : kelas.length > 0 ? (
                    <div className="grid grid-cols-5 gap-1 bg-softIvory">
                        {kelas.map((kelasItem) => (
                            <React.Fragment key={kelasItem.id}>
                                <div className="flex items-center justify-center h-full py-1 px-4 text-darkBrown border border-forestGreen">
                                    {kelasItem.kelas}
                                </div>
                                <div className="flex items-center justify-center h-full py-1 px-4 text-darkBrown border border-forestGreen">
                                    {kelasItem.hari}
                                </div>
                                <div className="flex items-center justify-center h-full py-1 px-4 text-darkBrown border border-forestGreen">
                                    {kelasItem.shift}
                                </div>
                                <div className="flex items-center justify-center h-full py-1 px-4 text-darkBrown border border-forestGreen">
                                    {kelasItem.totalGroup}
                                </div>
                                <div className="flex items-center justify-center h-full py-1 px-2 border border-forestGreen space-x-2">
                                    <button
                                        onClick={() => handleOpenModalDelete(kelasItem)}
                                        className="flex justify-center items-center p-1 border-2 border-fireRed rounded"
                                    >
                                        <img className="w-4" src={trashIcon} alt="delete icon" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModalEdit(kelasItem)}
                                        className="flex justify-center items-center p-1 border-2 border-darkBrown rounded"
                                    >
                                        <img className="w-4" src={editIcon} alt="edit icon" />
                                    </button>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">Tidak ada data kelas yang tersedia</div>
                )}
            </div>

            {/* Modal components */}
            {isModalOpenDelete && (
                <ModalDeletePlottingan
                    onClose={handleCloseModalDelete}
                    onConfirm={handleConfirmDelete}
                    message={message}
                    isError={message.includes("Gagal")}
                />
            )}

            {isModalOpenEdit && (
                <ModalEditPlotting onClose={handleCloseModalEdit} kelas={selectedKelas} />
            )}
        </div>
    );
}
