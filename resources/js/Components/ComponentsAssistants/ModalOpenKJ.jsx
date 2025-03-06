import { useState, useEffect } from "react";
import closeIcon from "../../../assets/modal/iconClose.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";
import { usePage } from "@inertiajs/react";

export default function ModalOpenKJ({ onClose, modules}) {
    const [showSuccess, setShowSuccess] = useState(false);
    const [modul, setModul] = useState(modules || []);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({}); // State untuk menyimpan status isUnlocked setiap modul
    const { flash, errors } = usePage().props;

    // Inisialisasi config saat modul berubah
    useEffect(() => {
        if (modul.length > 0) {
            const initialConfig = modul.reduce((acc, mod) => {
                acc[mod.idM] = mod.isUnlocked === 1; // Konversi ke boolean
                return acc;
            }, {});
            setConfig(initialConfig);
        }
    }, [modul]);

    // Fetch data modul jika prop modules tidak disediakan
    useEffect(() => {
        if (!modules || modules.length === 0) {
            const fetchModules = async () => {
                setLoading(true);
                try {
                    const response = await fetch("/api-v1/modul");
                    if (!response.ok) throw new Error("Gagal mengambil data modul");
                    const data = await response.json();
                    const modules = Array.isArray(data.data) ? data.data : [];
                    setModul(modules);
                } catch (error) {
                    console.error("Error fetching modules:", error);
                    setModul([]); // Reset modul jika terjadi error
                } finally {
                    setLoading(false); // Matikan loading state
                }
            };
            fetchModules();
        }
    }, [modules]);

    // Fungsi untuk toggle status isUnlocked
    const toggleSwitch = async (idM) => {
        const newStatus = !config[idM]; // Toggle status

        // Update config state secara lokal
        setConfig((prevConfig) => ({
            ...prevConfig,
            [idM]: newStatus,
        }));

        try {
            // Ambil CSRF token dari meta tag
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

            // Kirim request ke backend
            const response = await fetch(`/api-v1/modul/update-status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": csrfToken,
                },
                body: JSON.stringify([{ id: idM, isUnlocked: newStatus ? 1 : 0 }]), // Format payload sesuai dengan controller
            });

            if (!response.ok) throw new Error("Gagal update status");
            console.log(`Modul ${idM} status diupdate ke ${newStatus ? "UNLOCKED" : "LOCKED"}`);

            // Update modul di state lokal
            setModul((prevModul) =>
                prevModul.map((mod) =>
                    mod.idM === idM ? { ...mod, isUnlocked: newStatus ? 1 : 0 } : mod
                )
            );
        } catch (error) {
            console.error("Error updating module:", error);
            // Rollback perubahan jika terjadi error
            setConfig((prevConfig) => ({
                ...prevConfig,
                [idM]: !newStatus,
            }));
        }
    };

    // Fungsi untuk menangani simpan dan tampilkan modal sukses
    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose(); // Tutup modal setelah 3 detik
        }, 3000);
    };

    return (
        <>
            {/* Modal Utama */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-[800px] shadow-lg relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <img className="w-8" src={editIcon} alt="praktikum" /> LOCK / UNLOCK
                        </h2>
                        {/* Tombol X untuk tutup */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 flex justify-center items-center"
                        >
                            <img className="w-9" src={closeIcon} alt="closeIcon" />
                        </button>
                    </div>

                    {/* Tabel Daftar Modul */}
                    <div className="max-h-[350px] overflow-y-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 px-4 border-b">Module</th>
                                    <th className="text-left py-2 px-4 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : (
                                    modul.map((m) => (
                                        <tr key={m.idM} className="even:bg-gray-100">
                                            <td className="py-2 px-4">{m.judul}</td>
                                            <td className="py-2 px-4">
                                                {/* Switch untuk toggle status */}
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={config[m.idM] || false}
                                                        onChange={() => toggleSwitch(m.idM)}
                                                        className="hidden"
                                                    />
                                                    <div
                                                        className={`w-20 h-8 flex items-center rounded-full px-2 transition-all duration-300 ${config[m.idM] ? "bg-deepForestGreen" : "bg-fireRed"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${config[m.idM] ? "translate-x-10" : "translate-x-0"
                                                                }`}
                                                        ></div>
                                                    </div>
                                                </label>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Tombol Simpan */}
                    <div className="flex justify-center mt-5">
                        <button
                            onClick={handleSave}
                            className="w-1/4 py-2 bg-deepForestGreen text-white font-semibold rounded-lg shadow-md hover:bg-darkGreen transition"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Notifikasi Berhasil */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-4 w-80 shadow-lg text-center">
                        <h3 className="text-xl font-bold text-deepForestGreen">Berhasil Disimpan</h3>
                        <p className="text-darkBrown-500 mt-2">Konfigurasi telah berhasil disimpan.</p>
                    </div>
                </div>
            )}
        </>
    );
}
