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
    const [values, setValues] = useState({
        modul_id: '',
    });
    const [modul, setModul] = useState([]);
    const [loading, setLoading] = useState(false);
    const [soalList, setSoalList] = useState([]);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api-v1/modul");
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched modules:", data.data);
                setModul(Array.isArray(data.data) ? data.data : []); // ini kudu array gaes tong di ubah
            } else {
                console.error('Failed to fetch modules:', response.statusText);
                setModul([]);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModul([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchModules();
    }, []);

    const handleChange = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        setValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const handleOpenModalSave = () => {
        // Validasi apakah soal sudah lengkap
        if (!soalList.some(soal => !soal.soal || soal.pilihan?.some(p => p === ""))) {
            setIsModalSaveOpen(true);
        } else {
            setIsModalValidationOpen(true);
        }
    };

    const handleCloseModalSave = () => {
        setIsModalSaveOpen(false);
        // Reset dropdown ke default
        setKategoriSoal("");
        setModul("");
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

    const addSoal = (soalBaru) => {
        setSoalList([...soalList, soalBaru]);
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
                        <option value="Pendahuluan">Tes Pendahuluan</option>
                        <option value="TesAwal">Tes Awal</option>
                        <option value="Jurnal">Jurnal</option>
                        <option value="Mandiri">Mandiri</option>
                        <option value="Keterampilan">Tes Keterampilan</option>
                    </select>
                </div>
                <div className="w-2/3">
                    <select
                        className="w-full border-2 border-darkBrown rounded-md shadow-md"
                        value={values.modul_id}
                        id="modul_id"
                        onChange={handleChange}
                    >
                        <option value="">- Pilih Modul -</option>
                        {console.log("Modul data:", modul)}
                        {modul.length > 0 ? (
                            modul.map((k, index) => (
                                <option key={k.idM ?? `modul-${index}`} value={k.idM}>
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
            {kategoriSoal === "Pendahuluan" && modul && (
                <SoalInputEssay
                    kategoriSoal={kategoriSoal}
                    modul={modul}
                    onModalSuccess={handleOpenModalAddSuccesSoal}
                    onModalValidation={() => setIsModalValidationOpen(true)}
                    addSoal={addSoal}
                />
            )}

            {kategoriSoal === "TesAwal" && modul && (
                <SoalInputPG
                    kategoriSoal={kategoriSoal}
                    modul={modul}
                    onModalSuccess={handleOpenModalAddSuccesSoal}
                    onModalValidation={() => setIsModalValidationOpen(true)}
                    addSoal={addSoal}
                />
            )}

            {kategoriSoal === "Jurnal" && modul && (
                <SoalInputEssay
                    kategoriSoal={kategoriSoal}
                    modul={modul}
                    onModalSuccess={handleOpenModalAddSuccesSoal}
                    onModalValidation={() => setIsModalValidationOpen(true)}
                    addSoal={addSoal}
                />
            )}

            {kategoriSoal === "Mandiri" && modul && (
                <SoalInputEssay
                    kategoriSoal={kategoriSoal}
                    modul={modul}
                    onModalSuccess={handleOpenModalAddSuccesSoal}
                    onModalValidation={() => setIsModalValidationOpen(true)}
                    addSoal={addSoal}
                />
            )}

            {kategoriSoal === "Keterampilan" && modul && (
                <SoalInputPG
                    kategoriSoal={kategoriSoal}
                    modul={modul}
                    onModalSuccess={handleOpenModalAddSuccesSoal}
                    onModalValidation={() => setIsModalValidationOpen(true)}
                    addSoal={addSoal}
                />
            )}

            {/* Modal Save Soal */}
            {isModalSaveOpen && <ModalSaveSoal onClose={handleCloseModalSave} />}
            {/* Modal Validasi Soal */}
            {isModalValidationOpen && <ModalValidationAddSoal onClose={handleCloseModalValidation} />}
            {/* Modal Sukses Tambah Soal */}
            {isModalSuccesOpenAddSoal && <ModalSuccesAddSoal onClose={handleCloseModalAddSuccesSoal} />}
        </div>
    );
}
