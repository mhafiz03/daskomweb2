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
        <div className="depth-modal-overlay">
            <div className="depth-modal-container max-w-3xl">
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Edit Soal</h2>
                    <button onClick={onClose} type="button" className="depth-modal-close">
                        <img className="h-6 w-6" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                <textarea
                    className="h-64 w-full rounded-depth-lg border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                    rows="10"
                    placeholder="Edit soal..."
                    value={soal}
                    onChange={(e) => setSoal(e.target.value)}
                />

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <label className="text-sm font-semibold text-depth-secondary" htmlFor="modul_id">
                        Modul
                    </label>
                    <select
                        id="modul_id"
                        className="w-full rounded-depth-md border border-depth bg-depth-card p-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 md:w-60"
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
                        {!modulesLoading && !modulesError &&
                            moduls.map((modul) => (
                                <option key={modul.idM} value={String(modul.idM)}>
                                    {modul.judul}
                                </option>
                            ))}
                    </select>

                    <button
                        onClick={handleSave}
                        type="button"
                        className="rounded-depth-md bg-[var(--depth-color-primary)] px-6 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md md:self-end"
                        disabled={modulesLoading}
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
