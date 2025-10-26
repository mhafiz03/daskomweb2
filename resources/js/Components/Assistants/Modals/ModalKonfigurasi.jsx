import { useState } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useConfigurationQuery, CONFIG_QUERY_KEY } from "@/hooks/useConfigurationQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { send } from "@/lib/wayfinder";
import { update as updateConfigurationRoute } from "@/actions/App/Http/Controllers/API/ConfigurationController";

export default function ModalKonfigurasi({ onClose }) {
    const [isTugasPendahuluanOn, setIsTugasPendahuluanOn] = useState(false);
    const [isRegistrasiAsistenOn, setIsRegistrasiAsistenOn] = useState(false);
    const [isRegistrasiPraktikanOn, setIsRegistrasiPraktikanOn] = useState(false);
    const [isTugasBesarOn, setIsTugasBesarOn] = useState(false);
    const [isPollingAsistenOn, setIsPollingAsistenOn] = useState(false);
    const [kodeAsisten, setKodeAsisten] = useState("");

    const [showConfigModal, setShowConfigModal] = useState(false);
    const queryClient = useQueryClient();

    useConfigurationQuery({
        onSuccess: (config) => {
            if (config) {
                setIsTugasPendahuluanOn(Boolean(config.tp_activation));
                setIsRegistrasiAsistenOn(Boolean(config.registrationAsisten_activation));
                setIsRegistrasiPraktikanOn(Boolean(config.registrationPraktikan_activation));
                setIsTugasBesarOn(Boolean(config.tubes_activation));
                setIsPollingAsistenOn(Boolean(config.polling_activation));
                setKodeAsisten(config.kode_asisten || "");
                setShowConfigModal(true);
            }
        },
        onError: (err) => {
            toast.error(err?.message ?? "Gagal memuat konfigurasi. Silakan coba lagi.");
            setShowConfigModal(false);
        },
    });

    const getErrorMessage = (err) => {
        const response = err?.response;
        if (response) {
            if (response.status === 422) {
                const errors = response.data?.errors ?? {};
                const messages = Object.values(errors).flat();
                if (messages.length > 0) {
                    return messages[0];
                }
                return response.data?.message ?? "Validasi gagal.";
            }
            if (response.status === 404) {
                return "Data konfigurasi tidak ditemukan.";
            }
            if (response.status === 500) {
                return "Terjadi kesalahan di server. Silakan coba lagi.";
            }
            return response.data?.message ?? "Gagal menyimpan konfigurasi. Silakan coba lagi.";
        }

        return err?.message ?? "Gagal terhubung ke server.";
    };

    const updateConfigurationMutation = useMutation({
        mutationFn: async (configPayload) => {
            const { data } = await send(updateConfigurationRoute(), configPayload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEY });
            toast.success("Konfigurasi berhasil diperbarui.");
            onClose();
        },
        onError: (err) => {
            toast.error(getErrorMessage(err));
        },
    });

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

        updateConfigurationMutation.mutate(config);
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
                                                item.value ? "bg-deepForestGreen" : "bg-fireRed"
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
                            disabled={updateConfigurationMutation.isPending}
                            className="mt-4 w-full py-2 bg-darkGreen text-white font-semibold rounded-lg shadow-md shadow-darkGreen hover:bg-darkGreen transition disabled:opacity-50"
                        >
                            {updateConfigurationMutation.isPending ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}
