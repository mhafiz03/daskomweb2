import { useState, useEffect } from "react";
import closeIcon from "../../../assets/modal/iconClose.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";

export default function ModalOpenKJ({ onClose }) {
    const [config, setConfig] = useState({});
    const [modul, setModul] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        const fetchModules = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api-v1/modul");
                if (!response.ok) throw new Error("Failed to fetch modules");
                const data = await response.json();
                const modules = Array.isArray(data.data) ? data.data : [];
                setModul(modules);

                const initialConfig = modules.reduce((acc, mod) => {
                    acc[mod.idM] = false;
                    return acc;
                }, {});
                setConfig(initialConfig);
            } catch (error) {
                console.error("Error fetching modules:", error);
                setModul([]);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    const toggleSwitch = async (idM) => {
        const newStatus = !config[idM];

        setConfig((prevConfig) => ({
            ...prevConfig,
            [idM]: newStatus,
        }));

        try {
            const response = await fetch(`/modul/${idM}/update`, { // @dhiya , aku ga tau ini kudu ke mana, hehe, controller juga blm ada ;). lup
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isActive: newStatus ? 1 : 0 }),
            });

            if (!response.ok) throw new Error("Gagal update status");
            console.log(`Modul ${idM} status diupdate ke ${newStatus ? "ON" : "OFF"}`);
        } catch (error) {
            console.error("Error updating module:", error);
            setConfig((prevConfig) => ({
                ...prevConfig,
                [idM]: !newStatus,
            }));
        }
    };

    const handleSave = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
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

                    {/* Switch Options - Scrollable Table */}
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
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={config[m.idM]}
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

                    {/* Save Button */}
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
