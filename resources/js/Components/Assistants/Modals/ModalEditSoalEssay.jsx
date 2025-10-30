import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useModulesQuery } from "@/hooks/useModulesQuery";

export default function ModalEditSoalEssay({ onClose, soalItem, onSave }) {
    const [soal, setSoal] = useState(soalItem.soal || "");
    const [selectedModul, setSelectedModul] = useState(
        soalItem.modul_id ? String(soalItem.modul_id) : ""
    );
    const {
        data: moduls = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery();

    useEffect(() => {
        setSoal(soalItem.soal || "");
        setSelectedModul(soalItem.modul_id ? String(soalItem.modul_id) : "");
    }, [soalItem]);

    const handleSave = () => {
        if (!soal.trim()) {
            toast.error("Soal tidak boleh kosong.");
            return;
        }

        if (!selectedModul) {
            toast.error("Pilih modul untuk soal ini.");
            return;
        }

        onSave({
            ...soalItem,
            soal,
            modul_id: Number(selectedModul),
            oldSoal: soalItem.soal,
        });

        toast.success("Soal berhasil diedit!");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[800px] shadow-lg relative">
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen">Edit Soal</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                <textarea
                    className="w-full p-2 border rounded"
                    rows="10"
                    placeholder="Edit soal..."
                    value={soal}
                    onChange={(e) => setSoal(e.target.value)}
                />


                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="font-medium text-lg mb-1" htmlFor="modul_id">
                        Modul
                    </label>
                    <select
                        id="modul_id"
                        className="w-full border border-deepForestGreen rounded-md p-2 shadow-sm"
                        value={selectedModul}
                        onChange={(e) => setSelectedModul(e.target.value)}
                    >
                        <option value="">- Pilih Modul -</option>
                        {modulesLoading && <option disabled>Memuat modul...</option>}
                        {modulesError && (
                            <option disabled>
                                {modulesQueryError?.message ?? "Gagal memuat modul"}
                            </option>
                        )}
                        {!modulesLoading && !modulesError && moduls.length > 0
                            ? moduls.map((modul) => (
                                <option key={modul.idM} value={String(modul.idM)}>
                                    {modul.judul}
                                </option>
                            ))
                            : null}
                    </select>

                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300 md:self-end"
                        disabled={modulesLoading}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
