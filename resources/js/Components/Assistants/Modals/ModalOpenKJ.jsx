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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-6 w-[800px] shadow-lg relative">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-300">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <img className="w-8" src={editIcon} alt="praktikum" /> LOCK / UNLOCK
                        </h2>
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 flex justify-center items-center"
                        >
                            <img className="w-9" src={closeIcon} alt="closeIcon" />
                        </button>
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 px-4 border-b">Module</th>
                                    <th className="text-left py-2 px-4 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modulesLoading ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-4">Loading...</td>
                                    </tr>
                                ) : modulesError ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-4 text-red-500">
                                            {modulesQueryError?.message ?? "Gagal memuat modul"}
                                        </td>
                                    </tr>
                                ) : (
                                    modul.map((m) => (
                                        <tr key={m.idM} className="even:bg-gray-100">
                                            <td className="py-2 px-4">{m.judul}</td>
                                            <td className="py-2 px-4">
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
        </>
    );
}
