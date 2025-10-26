import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";

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

        onConfirm({
            ...soalItem,
            pertanyaan: pertanyaan.trim(),
            options: options.map((option) => ({
                id: option.id,
                text: option.text.trim(),
            })),
            correct_option: correctIndex,
        });

        toast.success("Soal berhasil diperbarui.");
        onClose();
    };

    return (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-white rounded-lg p-6 w-[800px] max-h-[90vh] shadow-lg overflow-y-auto relative">
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen pb-2">
                    <h2 className="text-2xl font-bold text-darkGreen">Edit Soal</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                <label className="block text-gray-700 font-medium mb-2">Pertanyaan</label>
                <textarea
                    value={pertanyaan}
                    rows={6}
                    onChange={(e) => setPertanyaan(e.target.value)}
                    placeholder="Masukkan soal..."
                    className="w-full border border-gray-300 rounded-lg p-3 mb-6"
                />

                <label className="block text-gray-700 font-medium mb-2">Pilihan Jawaban</label>
                <div className="space-y-3">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <input
                                type="radio"
                                name="correctOption"
                                checked={correctIndex === index}
                                onChange={() => setCorrectIndex(index)}
                                className="accent-deepForestGreen"
                            />
                            <input
                                value={option.text}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                                className="flex-1 rounded-lg border border-gray-300 p-2"
                            />
                        </div>
                    ))}
                </div>

                <div className="modal-actions flex justify-end gap-4 mt-6">
                    <button
                        onClick={handleConfirm}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
