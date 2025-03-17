import { useState, useEffect } from "react";
import axios from "axios";
import closeIcon from "../../../assets/modal/iconClose.svg";

export default function ButtonAddPlotting({ onClose, fetchKelas }) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(0); // 0 untuk false, 1 untuk true
    const [asisten, setAsisten] = useState([]); // State untuk data asisten
    const [loading, setLoading] = useState(false); // State untuk loading
    const [error, setError] = useState(null); // State untuk error

    // State untuk menyimpan data input
    const [formData, setFormData] = useState({
        kelas: "",
        hari: "",
        shift: "",
        totalGroup: "",
        isEnglish: 0, // Default 0 (false)
    });

    // Fetch data asisten saat komponen dimount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token"); // Ambil token dari localStorage
                const response = await axios.get("/api-v1/asisten", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Sertakan token di header
                    },
                });
                console.log("Response dari backend:", response.data);

                if (response.data.success) {
                    setAsisten(response.data.asisten);
                    console.log("Data asisten di state:", response.data.asisten);
                } else {
                    setError(response.data.message || "Gagal mengambil data asisten.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                if (error.response && error.response.status === 403) {
                    setError("Akses ditolak. Pastikan Anda memiliki izin yang diperlukan.");
                } else {
                    setError("Terjadi kesalahan saat mengambil data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle perubahan input
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    // Handle toggle switch
    const toggleSwitch = () => {
        const newValue = isSwitchOn === 0 ? 1 : 0; // Toggle antara 0 dan 1
        setIsSwitchOn(newValue);
        setFormData({
            ...formData,
            isEnglish: newValue,
        });
    };

    // Handle submit data
    const handleSave = async () => {
        // Validasi input
        if (!formData.kelas || !formData.hari || !formData.shift || !formData.totalGroup) {
            alert("Harap isi semua field yang diperlukan.");
            return;
        }

        try {
            // Kirim data ke backend
            const response = await axios.post("/api-v1/kelas", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Kirim token
                },
            });

            if (response.data.status === 'success') {
                // Tampilkan modal sukses
                setShowSuccessModal(true);

                // Tutup modal setelah 3 detik
                setTimeout(() => {
                    setShowSuccessModal(false);
                    onClose(); // Tutup modal tambah data
                    fetchKelas(); // Refresh data kelas
                }, 3000);
            } else {
                alert("Gagal menyimpan data kelas: " + response.data.message);
            }
        } catch (error) {
            console.error("Failed to save kelas:", error);
            alert("Gagal menyimpan data kelas. Silakan coba lagi.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Utama */}
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen">Tambah Jadwal</h2>
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
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Kelas"
                            value={formData.kelas}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="hari" className="block text-black text-sm font-medium">
                            Hari
                        </label>
                        <input
                            id="hari"
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Hari"
                            value={formData.hari}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="shift" className="block text-black text-sm font-medium">
                            Shift
                        </label>
                        <input
                            id="shift"
                            type="number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Shift"
                            value={formData.shift}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="totalGroup" className="block text-black text-sm font-medium">
                            Kelompok
                        </label>
                        <input
                            id="totalGroup"
                            type="number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Kelompok"
                            value={formData.totalGroup}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Daftar Checkbox (Hanya Nama dan Kode Asisten) */}
                <div className="max-h-60 overflow-y-auto border-t border-gray-300 pt-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : asisten.length > 0 ? (
                        asisten.map((asisten) => (
                            <div
                                key={asisten.id} // Gunakan id asisten sebagai key
                                className="flex items-center gap-2 p-2 border rounded-md mb-2"
                            >
                                <input
                                    type="checkbox"
                                    id={`checkbox-${asisten.id}`} // Gunakan id asisten untuk id checkbox
                                    className="w-4 h-4"
                                />
                                <label
                                    htmlFor={`checkbox-${asisten.id}`} // Gunakan id asisten untuk htmlFor
                                    className="text-gray-700"
                                >
                                    {asisten.nama} | {asisten.kode}
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">Tidak ada data asisten yang tersedia.</p>
                    )}
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

                {/* Switch On/Off */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        isEnglish
                    </label>
                    <div
                        onClick={toggleSwitch}
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isSwitchOn === 1 ? "bg-deepForestGreen" : "bg-fireRed"
                            }`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isSwitchOn === 1 ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </div>
                </div>
            </div>

            {/* Modal Notifikasi */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-darkGreen text-center p-3">
                            Jadwal berhasil dibuat!
                        </h2>
                    </div>
                </div>
            )}
        </div>
    );
}
