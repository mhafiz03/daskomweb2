import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalDeletePlottingan from "./ModalDeletePlottingan";
import ModalEditPlotting from "./ModalEditPlottingan";
import trashIcon from "../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";

export default function TablePlottingan() {
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [message, setMessage] = useState("");
    const [kelas, setKelas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedKelas, setSelectedKelas] = useState(null);

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

    // Fetch data dari backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("/api-v1/kelas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') {
                // Sort data setelah diterima dari API
                const sortedData = sortKelas(response.data.kelas);
                setKelas(sortedData);
            } else {
                setError(response.data.message || "Gagal mengambil data kelas.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Terjadi kesalahan saat mengambil data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModalDelete = (kelasItem) => {
        setSelectedKelas(kelasItem); // Pastikan kelasItem memiliki properti id
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`/api-v1/kelas/${selectedKelas.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchData(); // Refresh data setelah penghapusan
        } catch (error) {
            console.error("Failed to delete kelas:", error);
            setMessage("Gagal menghapus kelas. Silakan coba lagi.");
        } finally {
            setIsModalOpenDelete(false);
        }
    };

    const handleOpenModalEdit = (kelas) => {
        setSelectedKelas(kelas);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        fetchData(); // Refresh data setelah modal ditutup
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
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Memuat data...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">Error: {error}</div>
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
