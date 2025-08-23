import { useEffect, useState } from "react";
import ModalDeleteSoal from "./ModalDeleteSoal";
import ModalEditSoalEssay from "./ModalEditSoalEssay";
// import ModalSaveSoal from "./ModalSaveSoal";
import trashIcon from "../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../assets/nav/Icon-Edit.svg";
import axios from "axios";

export default function SoalInputEssay({ kategoriSoal, modul, onModalSuccess, onModalValidation }) {
    const [addSoal, setAddSoal] = useState({
        pengantar: "", // tp gak ada, tapi jurnal, fitb, & mandiri ada
        kodingan: "", // tp gak ada, tapi jurnal, fitb, & mandiri ada
        soal: "",
        is_essay: false, // buat tp doang
        is_program: false, // buat tp doang
        is_sulit: false, // buat jurnal doang
    });
    const [soalList, setSoalList] = useState([]);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [selectedNomor, setSelectedNomor] = useState(null);
    // const [isModalOpenSuccess, setIsModalOpenSuccess] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [editingSoal, setEditingSoal] = useState(null);


    const fetchSoal = async () => {
        if (modul && kategoriSoal) {
            try {
                const response = await axios.get(`/api-v1/soal-${kategoriSoal}/${modul}`);
                if (response.data && response.statusText === "OK") setSoalList(response.data.data);
                else setSoalList([]);
                console.log("Message:", response.data.message);
            } catch (error) {
                console.error("Error fetching soal:", error);
                setSoalList([])
            }
        }
    };

    const postSoal = async (soalBaru) => {
        try {
            const response = await axios.post(`/api-v1/soal-${kategoriSoal}/${modul}`, { ...soalBaru });
            if (response.data && response.statusText === "OK") {
                console.log("Success posting soal:", response.data.data);
                setSoalList(prev => [...prev, response.data.data]);
            }
            console.log('Message:', response.data.message);
        } catch (error) {
            console.error("Error posting soal:", error);
        }
    };

    const putSoal = async (soalId, editSoal) => {
        try {
            const response = await axios.put(`/api-v1/soal-${kategoriSoal}/${soalId}`, { ...editSoal });
            if (response.data && response.statusText === "OK")
                setSoalList(soalList.map((prev) => prev.id === response.data.data.id ? response.data.data : prev));
            console.log('Message:', response.data.message);
        } catch (error) {
            console.error("Error posting soal:", error);
        }
    };

    const deleteSoal = async (soalId) => {
        try {
            const response = await axios.delete(`/api-v1/soal-${kategoriSoal}/${soalId}`);
        } catch (error) {
            console.error("Error deleting soal:", error);
        }
    };

    useEffect(() => {
        fetchSoal();
    }, [modul, kategoriSoal]);

    const handleTambahSoal = () => {
        if (!addSoal.soal) {
            onModalValidation();
            return;
        }

        postSoal(addSoal);

        setSoalList([...soalList, addSoal]);
        setAddSoal({
            pengantar: "",
            kodingan: "",
            soal: "",
            is_essay: false,
            is_program: false,
            is_sulit: false,
        });
        onModalSuccess();
    };

    const handleOpenModalDelete = (soalId) => {
        deleteSoal(soalId);
        setSoalList(soalList.filter((item) => item.id !== soalId));
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleConfirmDelete = () => {
        setSoalList(soalList.filter((item) => item.nomor !== selectedNomor));
        handleCloseModalDelete();
    };

    const handleOpenModalEdit = (soalItem) => {
        setEditingSoal(soalItem);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setEditingSoal(null);
        setIsModalOpenEdit(false);
    };

    const handleConfirmEdit = (updatedSoal) => {
        putSoal(updatedSoal.id, updatedSoal);
        handleCloseModalEdit();
    };

    return (
        <div>
            <label className="block mb-2 font-medium">Soal</label>
            <textarea
                className="w-full p-2 border rounded"
                rows="8"
                placeholder="Masukkan soal..."
                value={addSoal.soal}
                onChange={(e) => setAddSoal(prev => ({ ...prev, soal: e.target.value }))}
            ></textarea>

            <div className="flex justify-end space-x-3 mt-3">
                <button
                    className="text-md py-1 px-8 font-bold border text-white rounded-md shadow-sm bg-deepForestGreen border-deepForestGreen shadow-deepForestGreen" // shadow-redredDark bg-redredDark border-redredDark
                    onClick={handleTambahSoal}
                >
                    + Tambah Soal
                </button>

                {/* {soalList.length > 0 && (<button className="text-md py-1 px-8 font-bold border text-white bg-deepForestGreen border-deepForestGreen rounded-md shadow-sm shadow-deepForestGreen" onClick={handleSaveSoal}>
                        Save Soal
                    </button>)} */}
            </div>

            <div className="mt-4">
                <h3 className="font-bold text-lg mb-3">Daftar Soal</h3>
                <ul className="space-y-3">
                    {soalList.map((soalItem, index) => (
                        <li
                            key={index+1}
                            className="border border-gray-300 rounded-lg flex items-baseline bg-softIvory shadow-lg justify-between"
                        >
                            <div className="flex-1 p-4">
                                <strong>Soal: {index+1}</strong>
                                <br />
                                <span className="ml-2 text-sm text-justify">{soalItem.soal}</span>
                            </div>
                            <div className="flex space-x-2 p-2">
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

            {isModalOpenDelete && (<ModalDeleteSoal onClose={handleCloseModalDelete} onConfirm={handleConfirmDelete} />)}
            {isModalOpenEdit && (<ModalEditSoalEssay soalItem={editingSoal} onClose={handleCloseModalEdit} onSave={handleConfirmEdit} />)}
            {/* {isModalOpenSuccess && <ModalSaveSoal onClose={handleCloseSuccessModal} />} */}
        </div>
    );
}

