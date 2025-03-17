import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalDeletePlottingan from "./ModalDelatePlottingan";
import ModalEditPlotting from "./ModalEditPlottingan";
import ModalPlotTeam from "./ModalPlotTeam";
import trashIcon from "../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";

export default function TablePlottingan() {
    const [isModalOpenDelate, setIsModalOpenDelate] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenPlot, setIsModalOpenPlot] = useState(false);
    const [message, setMessage] = useState("");
    const [kelas, setKelas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedKelas, setSelectedKelas] = useState(null);

    // Fetch data dari backend
    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token"); // Ambil token dari localStorage
            const response = await axios.get("/api-v1/kelas", {
                headers: {
                    Authorization: `Bearer ${token}`, // Sertakan token di header
                },
            });
            console.log("Response dari backend:", response.data);

            if (response.data.status === 'success') {
                setKelas(response.data.kelas);
                console.log("Data kelas di state:", response.data.kelas);
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

    const handleOpenModalDelate = (kelasItem) => {
        setSelectedKelas(kelasItem); // Pastikan kelasItem memiliki properti id
        setIsModalOpenDelate(true);
    };

    const handleCloseModalDelate = () => {
        setIsModalOpenDelate(false);
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
            setIsModalOpenDelate(false);
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

    const handleOpenModalPlot = (kelas) => {
        setSelectedKelas(kelas);
        setIsModalOpenPlot(true);
    };

    const handleCloseModalPlot = () => {
        setIsModalOpenPlot(false);
    };

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
            <div className="overflow-x-auto max-h-96">
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
                                        onClick={() => handleOpenModalDelate(kelasItem)}
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
                                    <button
                                        onClick={() => handleOpenModalPlot(kelasItem)}
                                        className="flex justify-center items-center p-1 border-2 border-deepForestGreen text-deepForestGreen font-semibold rounded"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="w-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
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
            {isModalOpenDelate && (
                <ModalDeletePlottingan
                    onClose={handleCloseModalDelate}
                    onConfirm={handleConfirmDelete} // Teruskan fungsi handleConfirmDelete
                    message={message}
                    isError={message.includes("Gagal")}
                />
            )}

            {isModalOpenEdit && (
                <ModalEditPlotting onClose={handleCloseModalEdit} kelas={selectedKelas} />
            )}
            {isModalOpenPlot && (
                <ModalPlotTeam onClose={handleCloseModalPlot} kelas={selectedKelas} />
            )}
        </div>
    );
}
