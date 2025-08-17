import { useState, useEffect } from "react";
import ModalDeleteSoal from "./ModalDeleteSoal";
import ModalEditSoalPG from "./ModalEditSoalPG";
import ModalSaveSoal from "./ModalSaveSoal";
import trashIcon from "../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";
import axios from 'axios';

export default function SoalInputPG({ kategoriSoal, modul, onModalSuccess, onModalValidation, }) {
    const [addSoal, setAddSoal] = useState({
        pengantar: "",
        kodingan: "",
        pertanyaan: "",
        pilihan: ["", "", "", ""],
    });
    const [soalList, setSoalList] = useState([]);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [editingSoal, setEditingSoal] = useState(null);
    const [mode, setMode] = useState("text");
    const [soalCounter, setSoalCounter] = useState(1); // jgn di ilangin buat counter global untuk soal

    const fetchSoal = async () => {
        if (modul && kategoriSoal) {
            try {
                const response = await axios.get(`/api-v1/soal-${kategoriSoal}/${modul}`);
                if (response.data.data) {
                    console.log("Fetched soal:", response.data.data);
                    setSoalList(response.data.data);
                } else {
                    setSoalList([]);
                    console.log("Failed fetching data", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching soal:", error);
            }
        }
    };

    const postSoal = async (soalBaru) => {
        try {
            const response = await axios.post(`/api-v1/soal-${kategoriSoal}/${modul}`, {
                ...soalBaru
            });
            if (response.data && response.data.status === "success") {
                console.log("Success posting soal:", response.data.data);
                setSoalList(prev => [...prev, response.data.data]);
            }
            console.log('Message:', response.statusText);
        } catch (error) {
            console.error("Error posting soal:", error);
        }
    };

    const putSoal = async (soalId, editSoal) => {
        try {
            const response = await axios.put(`/api-v1/soal-${kategoriSoal}/${soalId}`, {
                ...editSoal
            });
            if (response.data && response.data.status === "success") {
                console.log("Success editing soal:", response.data.data);
                setSoalList(soalList.map((prev) => prev.id === response.data.data.id ? response.data.data : prev));
            }
            console.log('Message:', response.statusText);
        } catch (error) {
            console.error("Error posting soal:", error);
        }
    };

    const deleteSoal = async (soalId) => {
        try {
            const response = await axios.delete(`/api-v1/soal-${kategoriSoal}/${soalId}`);
            if (response.data && response.data.status === "success") {
                console.log("Success deleting soal:", response.statusText);
            }
            console.log('Message:', response.statusText);
        } catch (error) {
            console.error("Error posting soal:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddSoal(prev => ({ ...prev, [name]: value }));
    };

    const handlePilihanChange = (i, val) => {
        setAddSoal(prev => {
            const pilihan = [...prev.pilihan];
            pilihan[i] = val;
            return { ...prev, pilihan };
        });
    };

    const handleTambahSoal = () => {
        if (!addSoal.pertanyaan.trim() || addSoal.pilihan.some(pil => !pil.trim())) {
            onModalValidation();
            return;
        }
        // Check for duplicate choices
        const pilihanSet = new Set(addSoal.pilihan.map(pil => pil.trim()));
        if (pilihanSet.size !== addSoal.pilihan.length) {
            onModalValidation();
            return;
        }

        const payload = {
            modul_id: Number(modul),
            pengantar: mode === "kode" ? addSoal.pengantar : "",
            kodingan: mode === "kode" ? addSoal.kodingan : "",
            pertanyaan: addSoal.pertanyaan,
            jawaban_benar: addSoal.pilihan[0],
            jawaban_salah1: addSoal.pilihan[1],
            jawaban_salah2: addSoal.pilihan[2],
            jawaban_salah3: addSoal.pilihan[3],
        };

        postSoal(payload);

        // Reset form
        setAddSoal({
            pengantar: "",
            kodingan: "",
            pertanyaan: "",
            pilihan: ["", "", "", ""],
        });
        setSoalCounter(soalCounter + 1);
        onModalSuccess();
    };

    const handleOpenModalDelete = (soalId) => {
        console.log("Menghapuskan soal ID:", soalId);
        deleteSoal(soalId);
        setSoalList(soalList.filter((item) => item.id !== soalId));
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleOpenModalEdit = (soalItem) => {
        setEditingSoal(soalItem);
        setIsModalOpenEdit(true);
    };

    const handleConfirmEdit = (updatedSoal) => {
        putSoal(updatedSoal.id, {
            modul_id: updatedSoal.modul_id,
            pengantar: updatedSoal.pengantar,
            kodingan: updatedSoal.kodingan,
            pertanyaan: updatedSoal.pertanyaan,
            jawaban_benar: updatedSoal.jawaban_benar,
            jawaban_salah1: updatedSoal.jawaban[0],
            jawaban_salah2: updatedSoal.jawaban[1],
            jawaban_salah3: updatedSoal.jawaban[2],
        });
        setIsModalOpenEdit(false);
    };

    const handleCloseModalEdit = () => {
        setEditingSoal(null);
        setIsModalOpenEdit(false);
    };

    useEffect(() => {
        fetchSoal();
    }, [modul, kategoriSoal]);

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="font-semibold text-lg">Soal</label>
                <button
                    className="border-2 border-darkBrown rounded-md shadow-md text-sm text-darkBrown text-left py-1 font-bold px-8"
                    onClick={() => { setMode(mode === "text" ? "kode" : "text") }}
                >
                    {mode === "text" ? "Mode Kode" : "Mode Text"}
                </button>
            </div>

            {mode === "kode" ? (
                <div>
                    <input
                        type="text"
                        className="w-full p-2 mb-2 border rounded"
                        placeholder="Pengantar, contoh: Perhatikan Soal Berikut"
                        value={addSoal.pengantar}
                        name="pengantar"
                        onChange={handleChange}
                    />
                    <textarea
                        className="w-full p-2 mb-2 border rounded font-mono text-sm whitespace-pre overflow-auto max-h-64 resize-none"
                        rows="10"
                        placeholder="Tulis kode di sini..."
                        value={addSoal.kodingan}
                        name="kodingan"
                        onChange={handleChange}
                    ></textarea>
                    <textarea
                        className="w-full p-2 border rounded overflow-auto max-h-64 resize-none"
                        rows="4"
                        placeholder="Masukkan soal..."
                        value={addSoal.pertanyaan}
                        name="pertanyaan"
                        onChange={handleChange}
                    ></textarea>
                </div>
            ) : (
                <div>
                    <textarea
                        className="w-full p-2 mb-2 border rounded overflow-auto max-h-64 resize-none"
                        rows="4"
                        placeholder={"Masukkan soal..."}
                        value={addSoal.pertanyaan}
                        name="pertanyaan"
                        onChange={handleChange}
                    ></textarea>
                </div>
            )}

            <label className="block mb-2 font-medium">Pilihan Jawaban</label>
            {addSoal.pilihan.map((pil, index) => (
                <input
                    key={index}
                    type="text"
                    className={`w-full p-2 mb-2 border-2 rounded ${index === 0 ? "border-deepForestGreen" : "border-fireRed"
                        }`}
                    placeholder={`Pilihan ${String.fromCharCode(65 + index)}`}
                    value={pil ?? ""}
                    onChange={(e) => handlePilihanChange(index, e.target.value)}
                />
            ))}

            <div className="flex justify-end space-x-3 mt-3">
                <button
                    className="text-md py-1 px-8 font-bold border text-white bg-deepForestGreen border-deepForestGreen rounded-md shadow-sm" //  bg-redredDark border-redredDark
                    onClick={handleTambahSoal}
                >
                    + Tambah Soal
                </button>
                {/* {soalList.length > 0 && (
                    <button
                        className="text-md py-1 px-8 font-bold border text-white bg-deepForestGreen border-deepForestGreen rounded-md shadow-sm"
                        onClick={handleSaveSoal}
                    >
                        Save Soal
                    </button>
                )} */}
            </div>

            <div className="mt-5">
                <h3 className="font-bold mb-3">Soal yang telah ditambahkan:</h3>
                <ul className="space-y-3">
                    {soalList.map((soalItem, index) => (
                        <li key={index} className="relative p-7 border border-gray-300 rounded-lg bg-softIvory shadow-lg">
                            {soalItem.kodingan && soalItem.kodingan !== "empty" ? (
                                <>
                                    <div>
                                        <div className="mb-2">
                                            <strong>Soal: {index + 1}</strong>
                                            <p className="ml-4">{soalItem.pengantar}</p>
                                        </div>
                                        <div className="mb-2">
                                            <pre className="ml-4 bg-gray-200 p-2 rounded font-mono text-sm">
                                                {soalItem.kodingan}
                                            </pre>
                                        </div>
                                        <div className="mb-2">
                                            <p className="ml-4">{soalItem.pertanyaan}</p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mb-2">
                                    <strong>Soal: {index + 1} </strong>
                                    <p className="ml-4">{soalItem.pertanyaan}</p>
                                </div>
                            )}

                            <div className="mb-2">
                                <strong>Pilihan:</strong>
                                <ul className="ml-4">
                                    <li key="A" className="border bg-deepForestGreen text-white rounded-md">{`A. ${soalItem.jawaban_benar}`}</li>
                                    {soalItem.jawaban.map((pilihan, idx) => (
                                        <li key={66 + idx}>{`${String.fromCharCode(66 + idx)}. ${pilihan}`}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                    onClick={() => handleOpenModalEdit(soalItem)}
                                    className="flex justify-center items-center p-1 border-2 border-darkBrown rounded bg-white"
                                >
                                    <img className="w-5" src={editIcon} alt="Edit" />
                                </button>
                                <button
                                    onClick={() => handleOpenModalDelete(soalItem.id)}
                                    className="flex justify-center items-center p-1 border-2 border-fireRed rounded bg-white"
                                >
                                    <img className="w-5 h-5" src={trashIcon} alt="Delete" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {isModalOpenDelete && (<ModalDeleteSoal onClose={handleCloseModalDelete} />)}
            {isModalOpenEdit && (<ModalEditSoalPG soalItem={editingSoal} onClose={handleCloseModalEdit} onConfirm={handleConfirmEdit} />)}
        </div>
    );
}
