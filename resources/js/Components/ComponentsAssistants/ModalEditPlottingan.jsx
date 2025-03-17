import { useState, useEffect } from "react";
import axios from "axios";
import closeIcon from "../../../assets/modal/iconClose.svg";

export default function ModalEditPlotting({ onClose, kelas }) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [formData, setFormData] = useState({
        kelas: "",
        hari: "",
        shift: "",
        totalGroup: "",
    });

    useEffect(() => {
        if (kelas) {
            setFormData({
                kelas: kelas.kelas || "",
                hari: kelas.hari || "",
                shift: kelas.shift || "",
                totalGroup: kelas.totalGroup || "",
            });
            setIsSwitchOn(kelas.isEnglish || false); // Set nilai isEnglish dari data kelas
        }
    }, [kelas]);

    const handleSave = async () => {
        try {
            const token = localStorage.getItem("token");
            const dataToSend = {
                kelas: formData.kelas,
                hari: formData.hari,
                shift: parseInt(formData.shift),
                totalGroup: parseInt(formData.totalGroup),
                isEnglish: isSwitchOn, // Kirim nilai isEnglish
            };

            console.log("Data yang dikirim:", dataToSend); // Debugging

            const response = await axios.put(
                `/api-v1/kelas/${kelas.id}`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    onClose(); // Tutup modal setelah berhasil
                }, 3000);
            } else {
                console.error("Gagal mengupdate data:", response.data.message);
            }
        } catch (error) {
            console.error("Error updating data:", error);
            if (error.response) {
                console.error("Response error:", error.response.data);
            }
        }
    };

    const toggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Utama */}
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen">Edit Jadwal</h2>
                    {/* Tombol X untuk tutup */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                </div>

                {/* Input Informasi Jadwal */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label htmlFor="kelas" className="block text-black text-sm font-medium">
                            Kelas
                        </label>
                        <input
                            id="kelas"
                            type="text"
                            value={formData.kelas}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Kelas"
                        />
                    </div>
                    <div>
                        <label htmlFor="hari" className="block text-black text-sm font-medium">
                            Hari
                        </label>
                        <input
                            id="hari"
                            type="text"
                            value={formData.hari}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Hari"
                        />
                    </div>
                    <div>
                        <label htmlFor="shift" className="block text-black text-sm font-medium">
                            Shift
                        </label>
                        <input
                            id="shift"
                            type="number"
                            value={formData.shift}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Shift"
                        />
                    </div>
                    <div>
                        <label htmlFor="totalGroup" className="block text-black text-sm font-medium">
                            Kelompok
                        </label>
                        <input
                            id="totalGroup"
                            type="number"
                            value={formData.totalGroup}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Kelompok"
                        />
                    </div>
                </div>

                {/* Switch isEnglish */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        isEnglish
                    </label>
                    <div
                        onClick={toggleSwitch}
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isSwitchOn ? "bg-deepForestGreen" : "bg-fireRed"
                            }`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isSwitchOn ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300 mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>

            {/* Modal Notifikasi */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-darkGreen text-center p-3">
                            Jadwal berhasil diedit!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
}
