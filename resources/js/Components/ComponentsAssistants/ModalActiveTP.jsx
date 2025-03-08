import { useState, useEffect } from "react";
import axios from "axios";
import closeIcon from "../../../assets/modal/iconClose.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";

export default function ModalActiveTP({ onClose }) {
    const [modul, setModul] = useState([]);
    const [loading, setLoading] = useState(false);
    const [config, setConfig] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Ambil data tugas pendahuluan dan modul saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api-v1/tugas-pendahuluan");
                console.log("Data tugas pendahuluan dari backend:", response.data);

                // Set data modul dan tugas pendahuluan
                setModul(response.data.data);

                // Set initial config berdasarkan data tugas pendahuluan
                const initialConfig = {};
                response.data.data.forEach((tugas) => {
                    initialConfig[tugas.id] = tugas.isActive;
                });
                console.log("Initial config:", initialConfig);
                setConfig(initialConfig);

                setShowModal(true);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [onClose]);

    // Fungsi untuk toggle switch on/off
    const toggleSwitch = (key) => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            [key]: !prevConfig[key],
        }));
    };

    // Fungsi untuk menyimpan perubahan ke backend menggunakan Axios
    const handleSave = async () => {
        const dataToSend = {
            data: Object.keys(config).map((key) => ({
                id: parseInt(key, 10),
                isActive: config[key] ? 1 : 0,
            })),
        };

        try {
            const response = await axios.put("/api-v1/tugas-pendahuluan", dataToSend);
            console.log("Response dari backend:", response.data);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 3000);
        } catch (error) {
            console.error("Error saving configuration:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                if (error.response.status === 422) {
                    console.error("Validation errors:", error.response.data.errors);
                }
            }
        }
    };

    // Pisahkan modul menjadi dua grup untuk tampilan tabel
    const configKeys = Object.keys(config);
    const group1 = configKeys.filter((_, index) => index % 2 === 0);
    const group2 = configKeys.filter((_, index) => index % 2 === 1);

    return (
        <>
            {/* Modal Utama */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[1000px] shadow-lg relative">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <img className="w-8" src={editIcon} alt="praktikum" /> Tugas Pendahuluan
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
                        <div className="max-h-[300px] overflow-y-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 px-4 border-b">Module</th>
                                        <th className="text-left py-2 px-4 border-b">Status</th>
                                        <th className="text-left py-2 px-4 border-b">Module</th>
                                        <th className="text-left py-2 px-4 border-b">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group1.map((key, index) => {
                                        const modul1 = modul.find((m) => m.id === parseInt(key));
                                        const modul2 = group2[index] ? modul.find((m) => m.id === parseInt(group2[index])) : null;

                                        return (
                                            <tr key={key} className="even:bg-gray-100">
                                                {/* Group 1 */}
                                                <td className="py-2 px-4 capitalize">
                                                    {modul1?.nama_modul || "N/A"}
                                                </td>
                                                <td className="py-2 px-4">
                                                    <label className="inline-flex items-center cursor-pointer">
                                                        <span className="text-xs font-bold text-gray-700 mr-2">
                                                            {config[key] ? "ON" : "OFF"}
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            checked={config[key]}
                                                            onChange={() => toggleSwitch(key)}
                                                            className="hidden"
                                                        />
                                                        <div
                                                            className={`w-20 h-8 flex items-center rounded-full px-2 transition-all duration-300 ${
                                                                config[key] ? "bg-deepForestGreen" : "bg-fireRed"
                                                            }`}
                                                        >
                                                            <div
                                                                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                                                    config[key] ? "translate-x-10" : "translate-x-0"
                                                                }`}
                                                            ></div>
                                                        </div>
                                                    </label>
                                                </td>

                                                {/* Group 2 */}
                                                <td className="py-2 px-4 capitalize">
                                                    {modul2?.nama_modul || "-"}
                                                </td>
                                                <td className="py-2 px-4">
                                                    {modul2 && (
                                                        <label className="inline-flex items-center cursor-pointer">
                                                            <span className="text-xs font-bold text-gray-700 mr-2">
                                                                {config[group2[index]] ? "ON" : "OFF"}
                                                            </span>
                                                            <input
                                                                type="checkbox"
                                                                checked={config[group2[index]]}
                                                                onChange={() => toggleSwitch(group2[index])}
                                                                className="hidden"
                                                            />
                                                            <div
                                                                className={`w-20 h-8 flex items-center rounded-full px-2 transition-all duration-300 ${
                                                                    config[group2[index]] ? "bg-deepForestGreen" : "bg-fireRed"
                                                                }`}
                                                            >
                                                                <div
                                                                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                                                        config[group2[index]] ? "translate-x-10" : "translate-x-0"
                                                                    }`}
                                                                ></div>
                                                            </div>
                                                        </label>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
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
            )}

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
