import { useState, useEffect } from 'react';
import SoalInputPG from "../Soal/SoalInputPilihanGanda";
import SoalInputEssay from "../Soal/SoalInputEsai";
import ModalSaveSoal from "../Modals/ModalSaveSoal";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import toast from "react-hot-toast";

export default function SoalInputForm() {
    const [isModalSaveOpen, setIsModalSaveOpen] = useState(false);
    const [kategoriSoal, setKategoriSoal] = useState("");
    const [selectedModul, setSelectedModul] = useState("");
    const {
        data: moduls = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery();

    useEffect(() => {
    }, [selectedModul]);

    const handleModulChange = (e) => {
        const value = e.target.value;
        setSelectedModul(value);
    };

    const handleCloseModalSave = () => {
        setIsModalSaveOpen(false);
        setKategoriSoal("");
        setSelectedModul("");
    };

    const handleValidationError = ({ message, includeModuleNotice = false } = {}) => {
        const baseMessage = message ?? "Soal belum ditambahkan!!";
        const notice = includeModuleNotice ? " Pastikan memilih modul terlebih dahulu." : "";
        toast.error(`${baseMessage}${notice}`.trim());
    };

    const handleSuccessNotification = () => {
        toast.success("Soal berhasil ditambahkan!!");
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
                        {modulesLoading && <option disabled>Loading...</option>}
                        {modulesError && (
                            <option disabled>
                                {modulesQueryError?.message ?? "Gagal memuat modul"}
                            </option>
                        )}
                        {!modulesLoading && !modulesError && moduls.length > 0 ? (
                            moduls.map((k) => (
                                <option key={k.idM} value={k.idM}>
                                    {k.judul}
                                </option>
                            ))
                        ) : null}
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
                            modules={moduls}
                            onModalSuccess={handleSuccessNotification}
                            onModalValidation={handleValidationError}
                            onChangeModul={setSelectedModul}
                        />
                    );
                }
                if (pgTypes.includes(kategoriSoal) && selectedModul) {
                    return (
                        <SoalInputPG
                            kategoriSoal={kategoriSoal}
                            modul={selectedModul}
                            onModalSuccess={handleSuccessNotification}
                            onModalValidation={handleValidationError}
                            modules={moduls}
                            onChangeModul={setSelectedModul}
                        />
                    );
                }
                return null;
            })()}

            {isModalSaveOpen && <ModalSaveSoal onClose={handleCloseModalSave} />}
        </div>
    );
}
