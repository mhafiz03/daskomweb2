import { useEffect, useState } from "react";
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
    const [lastEditedBy, setLastEditedBy] = useState("-");

    const queryClient = useQueryClient();

    const {
        data: configuration,
        isLoading,
    } = useConfigurationQuery({
        onError: (err) => {
            toast.error(err?.message ?? "Gagal memuat konfigurasi. Silakan coba lagi.");
            onClose();
        },
    });

    useEffect(() => {
        if (!configuration) {
            return;
        }

        setIsTugasPendahuluanOn(Boolean(configuration.tp_activation));
        setIsRegistrasiAsistenOn(Boolean(configuration.registrationAsisten_activation));
        setIsRegistrasiPraktikanOn(Boolean(configuration.registrationPraktikan_activation));
        setIsTugasBesarOn(Boolean(configuration.tubes_activation));
        setIsPollingAsistenOn(Boolean(configuration.polling_activation));
        setLastEditedBy(configuration.kode_asisten || "-");
    }, [configuration]);

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
        };

        updateConfigurationMutation.mutate(config);
    };

    return (
        <>
            {/* Modal Utama */}
            <div className="depth-modal-overlay">
                <div className="depth-modal-container max-w-xl">
                    {/* Header */}
                    <div className="depth-modal-header">
                        <h2 className="depth-modal-title flex items-center gap-2">
                            <img className="edit-icon-filter h-6 w-6" src={editIcon} alt="praktikum" /> Configuration
                        </h2>
                        {/* Tombol X untuk tutup */}
                        <button onClick={onClose} type="button" className="depth-modal-close">
                            <img className="h-6 w-6" src={closeIcon} alt="closeIcon" />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="py-10 text-center font-semibold text-depth-secondary">
                            Memuat konfigurasi...
                        </div>
                    ) : (
                        <>
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
                                        <span className="capitalize text-depth-primary">{item.label}</span>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <span className="text-xs font-bold text-depth-primary mr-2">
                                                {item.value ? "ON" : "OFF"}
                                            </span>
                                            <input
                                                type="checkbox"
                                                checked={item.value}
                                                onChange={() => toggleSwitch(item.key)}
                                                className="hidden"
                                            />
                                            <div
                                                className={`w-20 h-8 flex items-center rounded-depth-full px-2 transition-all duration-300 shadow-depth-sm ${
                                                    item.value ? "bg-[var(--depth-color-primary)]" : "bg-red-500"
                                                }`}
                                            >
                                                <div
                                                    className={`w-6 h-6 bg-white rounded-depth-full shadow-depth-md transform transition-transform ${
                                                        item.value ? "translate-x-10" : "translate-x-0"
                                                    }`}
                                                ></div>
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Kode Asisten */}
                            <div className="text-right text-sm font-semibold text-depth-secondary mt-5">
                                Last edited by {lastEditedBy}
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                disabled={updateConfigurationMutation.isPending}
                                className="mt-4 w-full rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updateConfigurationMutation.isPending ? "Menyimpan..." : "Simpan"}
                            </button>
                        </>
                    )}
                </div>
            </div>

        </>
    );
}
