import { useState, useEffect } from "react";
import axios from "axios";
import closeIcon from "../../../assets/modal/iconClose.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";

export default function ModalKonfigurasi({ onClose }) {
    const [isTugasPendahuluanOn, setIsTugasPendahuluanOn] = useState(false);
    const [isRegistrasiAsistenOn, setIsRegistrasiAsistenOn] = useState(false);
    const [isRegistrasiPraktikanOn, setIsRegistrasiPraktikanOn] = useState(false);
    const [isTugasBesarOn, setIsTugasBesarOn] = useState(false);
    const [isPollingAsistenOn, setIsPollingAsistenOn] = useState(false);
    const [kodeAsisten, setKodeAsisten] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    // Fetch configuration saat modal dibuka
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await axios.get("/api-v1/config");
                console.log("Data dari backend:", response.data);

                const savedConfig = response.data.config;
                if (savedConfig) {
                    // Langsung gunakan nilai boolean dari BE
                    setIsTugasPendahuluanOn(savedConfig.tp_activation);
                    setIsRegistrasiAsistenOn(savedConfig.registrationAsisten_activation);
                    setIsRegistrasiPraktikanOn(savedConfig.registrationPraktikan_activation);
                    setIsTugasBesarOn(savedConfig.tubes_activation);
                    setIsPollingAsistenOn(savedConfig.polling_activation);
                    setKodeAsisten(savedConfig.kode_asisten || "");

                    setShowConfigModal(true);
                } else {
                    console.error("No config data found in response");
                }
            } catch (error) {
                console.error("Error fetching config:", error);
                setModalMessage("Gagal memuat konfigurasi. Silakan coba lagi.");
                setIsSuccess(false);
            }
        };

        fetchConfig();
    }, [onClose]);

    // Toggle switch handler
    const toggleSwitch = (key) => {
        switch (key) {
            case "tp_activation":
                setIsTugasPendahuluanOn((prev) => !prev);
                break;
            case "registrationAsisten_activation":
                setIsRegistrasiAsistenOn((prev) => !prev);
                break;
            case "registrationPraktikan_activation":
                setIsRegistrasiPraktikanOn((prev) => !prev);
                break;
            case "tubes_activation":
                setIsTugasBesarOn((prev) => !prev);
                break;
            case "polling_activation":
                setIsPollingAsistenOn((prev) => !prev);
                break;
            default:
                break;
        }
    };

    // Handle save configuration
    const handleSave = async () => {
        const config = {
            tp_activation: isTugasPendahuluanOn ? 1 : 0,
            registrationAsisten_activation: isRegistrasiAsistenOn ? 1 : 0,
            registrationPraktikan_activation: isRegistrasiPraktikanOn ? 1 : 0,
            tubes_activation: isTugasBesarOn ? 1 : 0,
            polling_activation: isPollingAsistenOn ? 1 : 0,
            kode_asisten: kodeAsisten || null,
        };

        try {
            const response = await axios.put("/api-v1/config", config);
            if (response.data.success) {
                setModalMessage("Konfigurasi berhasil diperbarui.");
                setIsSuccess(true);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 3000);
            }
        } catch (error) {
            console.error("Error saving config:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                if (error.response.status === 422) {
                    setModalMessage("Validasi gagal: " + JSON.stringify(error.response.data.errors));
                } else if (error.response.status === 404) {
                    setModalMessage("Data konfigurasi tidak ditemukan.");
                } else if (error.response.status === 500) {
                    setModalMessage("Terjadi kesalahan di server. Silakan coba lagi.");
                } else {
                    setModalMessage("Gagal menyimpan konfigurasi. Silakan coba lagi.");
                }
            } else {
                setModalMessage("Gagal terhubung ke server.");
            }
            setIsSuccess(false);
        }
    };

    return (
        <>
            {/* Modal Utama */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4 border-b border-deepForestGreen">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <img className="w-8" src={editIcon} alt="praktikum" /> Configuration
                            </h2>
                            {/* Tombol X untuk tutup */}
                            <button onClick={onClose} className="absolute top-2 right-2 flex justify-center items-center">
                                <img className="w-9" src={closeIcon} alt="closeIcon" />
                            </button>
                        </div>

                        {/* Switch Options */}
                        <div className="space-y-4">
                            {[
                                { key: "tp_activation", label: "Tugas Pendahuluan", value: isTugasPendahuluanOn },
                                { key: "registrationAsisten_activation", label: "Registrasi Asisten", value: isRegistrasiAsistenOn },
                                { key: "registrationPraktikan_activation", label: "Registrasi Praktikan", value: isRegistrasiPraktikanOn },
                                { key: "tubes_activation", label: "Tugas Besar", value: isTugasBesarOn },
                                { key: "polling_activation", label: "Polling Asisten", value: isPollingAsistenOn },
                            ].map((item) => (
                                <div key={item.key} className="flex justify-between items-center">
                                    <span className="capitalize">{item.label}</span>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <span className="text-xs font-bold text-gray-700 mr-2">
                                            {item.value ? "ON" : "OFF"}
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={item.value}
                                            onChange={() => toggleSwitch(item.key)}
                                            className="hidden"
                                        />
                                        <div
                                            className={`w-20 h-8 flex items-center rounded-full px-2 transition-all duration-300 ${
                                                item.value ? "bg-green-500" : "bg-redredDark"
                                            }`}
                                        >
                                            <div
                                                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                                    item.value ? "translate-x-10" : "translate-x-0"
                                                }`}
                                            ></div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Kode Asisten */}
                        <div className="text-right text-sm font-semibold text-dustyBlue mt-5">
                            Edit by {kodeAsisten}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className="mt-4 w-full py-2 bg-darkGreen text-white font-semibold rounded-lg shadow-md shadow-darkGreen hover:bg-darkGreen transition"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Notifikasi Berhasil */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-4 w-80 shadow-lg text-center">
                        <h3 className="text-lg font-semibold">Berhasil Disimpan</h3>
                        <p className="text-gray-500 mt-2">Konfigurasi telah berhasil disimpan.</p>
                    </div>
                </div>
            )}

            {/* Modal Notifikasi Error */}
            {!isSuccess && modalMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-4 w-80 shadow-lg text-center">
                        <h3 className="text-lg font-semibold">Gagal</h3>
                        <p className="text-gray-500 mt-2">{modalMessage}</p>
                        <button
                            onClick={() => setModalMessage("")}
                            className="mt-4 w-full py-2 bg-darkGreen text-white font-semibold rounded-lg shadow-md shadow-darkGreen hover:bg-darkGreen transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
