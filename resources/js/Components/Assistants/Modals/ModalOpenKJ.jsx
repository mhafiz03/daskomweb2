import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import { send } from "@/lib/wayfinder";
import { update as updateModul } from "@/actions/App/Http/Controllers/API/ModulController";

export default function ModalOpenKJ({ onClose, modules }) {
    const [modul, setModul] = useState(modules || []);
    const [config, setConfig] = useState({});

    const shouldFetchModules = !modules || modules.length === 0;

    const {
        data: fetchedModules = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery({
        enabled: shouldFetchModules,
    });

    // Ambil data modul saat komponen dimuat
    useEffect(() => {
        const sourceModules = shouldFetchModules ? fetchedModules : modules;
        if (Array.isArray(sourceModules)) {
            setModul(sourceModules);
        }
    }, [modules, fetchedModules, shouldFetchModules]);

    // Inisialisasi config saat modul berubah
    useEffect(() => {
        if (modul.length > 0) {
            const initialConfig = modul.reduce((acc, mod) => {
                acc[mod.idM] = !!mod.isUnlocked; // Set nilai awal isUnlocked
                return acc;
            }, {});
            setConfig(initialConfig);
        }
    }, [modul]);

    // Toggle status isUnlocked
    const toggleSwitch = (idM) => {
        setConfig((prevConfig) => ({
            ...prevConfig,
            [idM]: !prevConfig[idM], // Toggle nilai isUnlocked
        }));
    };

    // Simpan perubahan
    const handleSave = async () => {
        if (modul.length === 0) {
            console.error("Data modul belum diambil");
            return;
        }

        const updatePromises = modul.map((mod) => {
            const payload = {
                id: parseInt(mod.idM, 10),
                judul: mod.judul,
                deskripsi: mod.deskripsi || "",
                isEnglish: mod.isEnglish,
                isUnlocked: config[mod.idM] ? 1 : 0, // Pastikan nilai isUnlocked sesuai toggle
                modul_link: mod.modul_link,
                ppt_link: mod.ppt_link,
                video_link: mod.video_link,
            };

            console.log("Payload untuk modul ID", mod.idM, ":", payload);

            return send(updateModul(mod.idM), payload);
        });

        try {
            await Promise.all(updatePromises);
            toast.success("Konfigurasi modul berhasil disimpan.");
            onClose?.();
        } catch (error) {
            console.error("Error saving configuration:", error);
            if (error.response) {
                console.error("Response error:", error.response.data);
            }
            toast.error(error?.response?.data?.message ?? "Gagal menyimpan konfigurasi modul.");
        }
    };

    return (
        <>
            <div className="depth-modal-overlay">
                <div className="depth-modal-container max-w-4xl">
                    <div className="depth-modal-header">
                        <h2 className="depth-modal-title flex items-center gap-2">
                            <img className="h-6 w-6" src={editIcon} alt="praktikum" /> LOCK / UNLOCK
                        </h2>
                        <button
                            onClick={onClose}
                            type="button"
                            className="depth-modal-close"
                        >
                            <img className="h-6 w-6" src={closeIcon} alt="closeIcon" />
                        </button>
                    </div>

                    <div className="max-h-[450px] overflow-y-auto rounded-depth-md border border-depth bg-depth-card shadow-depth-sm">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 bg-depth-card z-10">
                                <tr>
                                    <th className="text-left py-3 px-4 border-b border-depth text-depth-primary font-semibold">Module</th>
                                    <th className="text-left py-3 px-4 border-b border-depth text-depth-primary font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modulesLoading ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-6 text-depth-secondary">Loading...</td>
                                    </tr>
                                ) : modulesError ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-6 text-red-500">
                                            {modulesQueryError?.message ?? "Gagal memuat modul"}
                                        </td>
                                    </tr>
                                ) : (
                                    modul.map((m) => (
                                        <tr key={m.idM} className="hover:bg-depth-interactive transition-colors">
                                            <td className="py-3 px-4 border-b border-depth/50 text-depth-primary">{m.judul}</td>
                                            <td className="py-3 px-4 border-b border-depth/50">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={config[m.idM] || false}
                                                        onChange={() => toggleSwitch(m.idM)}
                                                        className="hidden"
                                                    />
                                                    <div
                                                        className={`w-20 h-8 flex items-center rounded-depth-full px-2 transition-all duration-300 shadow-depth-sm ${config[m.idM] ? "bg-[var(--depth-color-primary)]" : "bg-red-500"
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-6 h-6 bg-white rounded-depth-full shadow-depth-md transform transition-transform ${config[m.idM] ? "translate-x-10" : "translate-x-0"
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

                    <div className="flex justify-center mt-5">
                        <button
                            onClick={handleSave}
                            className="w-full rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md sm:w-auto sm:px-8"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
