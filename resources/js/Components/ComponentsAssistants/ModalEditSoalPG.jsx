import { useState } from "react";
import closeIcon from "../../../assets/modal/iconClose.svg"

export default function ModalEditSoalPG({ soalItem, onClose, onConfirm }) {
    const [pengantar, setPengantar] = useState(soalItem.pengantar || " ");
    const [pertanyaan, setPertanyaan] = useState(soalItem.pertanyaan || "");
    const [kodingan, setKodingan] = useState(soalItem.kodingan || "");
    const [pilihan, setPilihan] = useState([
        soalItem.jawaban_benar,
        ...soalItem.jawaban
    ]);
    const [mode, setMode] = useState(soalItem.kodingan && soalItem.kodingan.trim() !== "empty" ? "kode" : "text");

    const handlePilihanChange = (index, value) => {
        const updatedPilihan = [...pilihan];
        updatedPilihan[index] = value;
        setPilihan(updatedPilihan);
    };

    const handleConfirm = () => {
        const updatedSoalItem = {
            ...soalItem,
            pengantar,
            pertanyaan,
            kodingan,
            jawaban_benar: pilihan[0],
            jawaban: pilihan.slice(1)
        };
        onConfirm(updatedSoalItem);
    };

    return (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="modal-content bg-white rounded-lg p-6 w-[1000px] max-h-[90vh] shadow-lg overflow-y-auto relative">
                <span className="border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen mb-4">Edit Soal</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                    <button
                        className="absolute top-4 right-14 border-2 border-darkBrown rounded-md shadow-md text-sm text-darkBrown text-left py-2 font-bold px-8"
                        onClick={() => { setMode(mode === "text" ? "kode" : "text") }}
                    >
                        {mode === "text" ? "Mode Kode" : "Mode Text"}
                    </button>
                </span>
                {mode === "kode" ? (
                    <div>
                        <input
                            type="text"
                            value={pengantar}
                            onChange={(e) => setPengantar(e.target.value)}
                            placeholder="Pengantar, contoh: Perhatikan Soal Berikut"
                            className="input w-full border border-gray-300 rounded-lg p-2 mb-4"
                        />
                        <textarea
                            value={kodingan}
                            rows="10"
                            onChange={(e) => setKodingan(e.target.value)}
                            placeholder="Tulis kode di sini..."
                            className="textarea w-full border border-gray-300 rounded-lg p-2 mb-4 font-mono text-sm whitespace-pre"
                        ></textarea>
                        <textarea
                            value={pertanyaan}
                            rows="4"
                            onChange={(e) => setPertanyaan(e.target.value)}
                            placeholder="Masukkan soal..."
                            className="textarea w-full border border-gray-300 rounded-lg p-2 mb-4"
                        ></textarea>
                    </div>
                ) : (
                    <textarea
                        value={pertanyaan}
                        rows="10"
                        onChange={(e) => setPertanyaan(e.target.value)}
                        placeholder="Masukkan soal..."
                        className="textarea w-full border border-gray-300 rounded-lg p-2 mb-4"
                    ></textarea>
                )}
                <label className="block text-gray-700 font-medium mb-2">Pilihan Jawaban:</label>
                <div className="grid grid-cols-1 gap-2">
                    {pilihan.map((pil, index) => (
                        <input
                            key={index}
                            value={pil}
                            onChange={(e) => handlePilihanChange(index, e.target.value)}
                            placeholder={`Pilihan ${index === 0 ? "benar" : "salah"}`}
                            className={`input w-full rounded-lg border-2 p-2 ${index === 0 ? "border-deepForestGreen" : "border-fireRed"
                                }`}
                        />
                    ))}
                </div>
                <div className="modal-actions flex justify-end gap-4 mt-6">
                    <button
                        onClick={handleConfirm}
                        className="button-confirm px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
