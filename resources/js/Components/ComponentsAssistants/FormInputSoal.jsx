import { useState, useEffect } from 'react';
import SoalInputPG from "./SoalInputPilihanGanda";
import SoalInputEssay from "./SoalInputEsai";
import ModalSaveSoal from "./ModalSaveSoal";
import ModalValidationAddSoal from "./ModalValidationAddSoal";
import ModalSuccesAddSoal from "./ModalSuccessAddSoal";

export default function SoalInputForm() {
    const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
    const [isModalValidationOpen, setIsModalValidationOpen] = useState(false);
    const [isModalSuccesOpenAddSoal, setIsModalSuccesOpenAddSoal] = useState(false);
    const [kategoriSoal, setKategoriSoal] = useState("");
    const [selectedModul, setSelectedModul] = useState('');
    const [moduls, setModuls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [soalList, setSoalList] = useState([]);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api-v1/modul");
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched modules:", data.data);
                setModuls(Array.isArray(data.data) ? data.data : []); // ini kudu array gaes tong di ubah
            } else {
                console.error('Failed to fetch modules:', response.statusText);
                setModuls([]);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModuls([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchModules();
    }, []);

    useEffect(() => {
    }, [selectedModul]);

    const handleModulChange = (e) => {
        const value = e.target.value;
        setSelectedModul(value);
    };

    const handleCloseModalSave = () => {
        setIsModalSaveOpen(false);
        // Reset dropdown ke default
        setKategoriSoal("");
        setModuls("");
    };

    const handleCloseModalValidation = () => {
        setIsModalValidationOpen(false);
    };

    const handleOpenModalAddSuccesSoal = () => {
        setIsModalSuccesOpenAddSoal(true);
    };

    const handleCloseModalAddSuccesSoal = () => {
        setIsModalSuccesOpenAddSoal(false);
    };

    return (
        <div className="p-6">
            {/* Pilih kategori soal dan modul */}
            <div className="flex justify-start gap-4 mb-4">
                <div className="w-1/3">
                    <select
                        className="w-full border-2 border-darkBrown rounded-md shadow-md"
                        value={kategoriSoal}
                        onChange={(e) => setKategoriSoal(e.target.value)}
                    >
                        <option value="">- Pilih Kategori Soal -</option>
                        <option value="tp">Tes Pendahuluan</option>
                        <option value="ta">Tes Awal</option>
                        <option value="fitb">Fill in the blank</option>
                        <option value="jurnal">Jurnal</option>
                        <option value="tm">Mandiri</option>
                        <option value="tk">Tes Keterampilan</option>
                    </select>
                </div>
                <div className="w-2/3">
                    <select
                        className="w-full border-2 border-darkBrown rounded-md shadow-md"
                        id="modul_id"
                        onChange={handleModulChange}
                    >
                        <option value="">- Pilih Modul -</option>
                        {moduls.length > 0 ? (
                            moduls.map((k) => (
                                <option key={k.idM} value={k.idM}>
                                    {k.judul}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading...</option>
                        )}
                    </select>
                </div>
            </div>

            {/* Input soal berdasarkan kategori soal */}
            {(() => {
                if (!kategoriSoal) return null;
                const essayTypes = ["tp", "fitb", "jurnal", "tm"];
                const pgTypes = ["ta", "tk"];
                if (essayTypes.includes(kategoriSoal) && selectedModul) {
                    return (
                        <SoalInputEssay
                            kategoriSoal={kategoriSoal}
                            modul={selectedModul}
                            onModalSuccess={handleOpenModalAddSuccesSoal}
                            onModalValidation={() => setIsModalValidationOpen(true)}
                        />
                    );
                }
                if (pgTypes.includes(kategoriSoal) && selectedModul) {
                    return (
                        <SoalInputPG
                            kategoriSoal={kategoriSoal}
                            modul={selectedModul}
                            onModalSuccess={handleOpenModalAddSuccesSoal}
                            onModalValidation={() => setIsModalValidationOpen(true)}
                        />
                    );
                }
                return null;
            })()}

            {isModalSaveOpen && <ModalSaveSoal onClose={handleCloseModalSave} />}
            {/* Modal Validasi Soal */}
            {isModalValidationOpen && <ModalValidationAddSoal onClose={handleCloseModalValidation} />}
            {/* Modal Sukses Tambah Soal */}
            {isModalSuccesOpenAddSoal && <ModalSuccesAddSoal onClose={handleCloseModalAddSuccesSoal} />}
        </div>
    );
}
