import { useState } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";

export default function ModalEditSoalEssay({ onClose, soalItem, onSave }) {
    const [soal, setSoal] = useState(soalItem.soal || "");

    const handleSave = () => {
        if (!soal.trim()) {
            toast.error("Soal tidak boleh kosong.");
            return;
        }

        onSave({
            ...soalItem,
            soal,
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

                <div className="mt-4 text-right">
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
