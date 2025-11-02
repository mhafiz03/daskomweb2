import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useModulesQuery } from "@/hooks/useModulesQuery";

const determineIsCorrect = (soalItem, option, optionIndex) => {
    if (typeof option?.is_correct === "boolean") {
        return option.is_correct;
    }

    if (option?.id && soalItem?.opsi_benar_id) {
        return option.id === soalItem.opsi_benar_id;
    }

    if (typeof soalItem?.correct_option === "number") {
        return soalItem.correct_option === optionIndex;
    }

    return false;
};

const OPTION_COUNT = 4;

const ensureOptionStructure = (soalItem) => {
    const sourceOptions = soalItem?.options ?? [];

    const normalized = sourceOptions.slice(0, OPTION_COUNT).map((option, index) => ({
        id: option?.id ?? null,
        text: option?.text ?? "",
        is_correct: determineIsCorrect(soalItem, option, index),
    }));

    while (normalized.length < OPTION_COUNT) {
        normalized.push({ id: null, text: "", is_correct: false });
    }

    return normalized;
};

export default function ModalEditSoalPG({ soalItem, onClose, onConfirm }) {
    const initialOptions = useMemo(
        () => ensureOptionStructure(soalItem),
        [soalItem],
    );

    const [pertanyaan, setPertanyaan] = useState(soalItem.pertanyaan || "");
    const [options, setOptions] = useState(initialOptions);
    const [correctIndex, setCorrectIndex] = useState(() => {
        const index = initialOptions.findIndex((option) => option.is_correct);
        return index >= 0 ? index : 0;
    });

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
        setPertanyaan(soalItem.pertanyaan || "");
        setSelectedModul(soalItem.modul_id ? String(soalItem.modul_id) : "");
    }, [soalItem]);

    const handleOptionChange = (index, value) => {
        setOptions((prev) =>
            prev.map((option, optIndex) =>
                optIndex === index ? { ...option, text: value } : option,
            ),
        );
    };

    const handleConfirm = () => {
        if (!pertanyaan.trim()) {
            toast.error("Pertanyaan tidak boleh kosong.");
            return;
        }

        if (options.some((option) => !option.text.trim())) {
            toast.error("Semua opsi jawaban harus diisi.");
            return;
        }

        const uniqueTexts = new Set(options.map((option) => option.text.trim()));
        if (uniqueTexts.size !== options.length) {
            toast.error("Teks opsi tidak boleh duplikat.");
            return;
        }


        if (!selectedModul) {
            toast.error("Pilih modul untuk soal ini.");
            return;
        }

        onConfirm({
            ...soalItem,
            pertanyaan: pertanyaan.trim(),
            options: options.map((option) => ({
                id: option.id,
                text: option.text.trim(),
            })),
            correct_option: correctIndex,
            modul_id: Number(selectedModul),
        });

        toast.success("Soal berhasil diperbarui.");
        onClose();
    };

    return (
        <div className="depth-modal-overlay">
            <div className="depth-modal-container max-w-3xl overflow-y-auto">
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Edit Soal</h2>
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
                    <button onClick={onClose} type="button" className="depth-modal-close">
                        <img className="h-6 w-6" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-depth-secondary" htmlFor="pertanyaan">
                        Pertanyaan
                    </label>
                    <textarea
                        id="pertanyaan"
                        value={pertanyaan}
                        rows={6}
                        onChange={(e) => setPertanyaan(e.target.value)}
                        placeholder="Masukkan soal..."
                        className="w-full rounded-depth-lg border border-depth bg-depth-card p-3 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                    />
                </div>

                <div className="mt-6 space-y-3">
                    <label className="text-sm font-medium text-depth-secondary">
                        Pilihan Jawaban
                    </label>
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 rounded-depth-md border border-depth bg-depth-card p-3 shadow-depth-sm"
                            >
                                <input
                                    type="radio"
                                    name="correctOption"
                                    checked={correctIndex === index}
                                    onChange={() => setCorrectIndex(index)}
                                    className="h-4 w-4 rounded border-depth text-[var(--depth-color-primary)] focus:ring-[var(--depth-color-primary)]"
                                />
                                <input
                                    value={option.text}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                                    className="flex-1 rounded-depth-md border border-transparent bg-depth-interactive p-3 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center justify-end">
                    <button
                        onClick={handleConfirm}
                        type="button"
                        className="rounded-depth-md bg-[var(--depth-color-primary)] px-6 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
