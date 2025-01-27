import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import ButtonEditModule from "./ModalEditModule";
import ButtonDeleteModule from "./ButtonDelateModule";
import editIcon from "../../../assets/nav/Icon-Edit.svg";
import trashIcon from "../../../assets/nav/Icon-Delete.svg";
import iconPPT from "../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../assets/practicum/iconModule.svg";

export default function TabelModulePraktikum() {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [message, setMessage] = useState("");
    const [openIndex, setOpenIndex] = useState(null);
    const [modules, setModules] = useState([]); // State for storing modules data
    const [loading, setLoading] = useState(false); // Loading state

    const fetchModules = async () => {
        setLoading(true);  // Menandakan data sedang dimuat
        try {
            const response = await router.get("/api-v1/modul");
            console.log(response.props);  // Cek format data yang diterima
            setModules(response.props.module || []);  // Pastikan data diakses dengan benar
        } catch (error) {
            console.error("Error fetching modules:", error);
        } finally {
            setLoading(false);  // Set loading selesai setelah mendapatkan data
        }
    };

    const handleOpenModalEdit = (module) => {
        // Set the form values to the selected module's data
        setValues({
            judul: module.judul,
            poin1: module.poin1 || '',
            poin2: module.poin2 || '',
            poin3: module.poin3 || '',
            isEnglish: module.isEnglish || 0,
            isUnlocked: module.isUnlocked || 0,
            modul_link: module.modul_link || '',
            ppt_link: module.ppt_link || '',
            video_link: module.video_link || '',
        });
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleOpenModalDelete = () => {
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleConfirmDelete = () => {
        setMessage("Modul berhasil dihapus");
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="mt-5 px-4">
            {/* Header */}
            <div className="bg-deepForestGreen rounded-lg py-2 px-4 mb-4 shadow-md flex justify-center items-center">
                <h1 className="font-bold text-white text-center text-2xl hover:bg-darkOliveGreen hover:rounded-lg transition-colors duration-300 px-4 py-1">
                    Modul Praktikum
                </h1>
            </div>

            {/* Module container */}
            <div className="overflow-x-auto max-h-96 bg-white rounded-lg p-1">
                {/* If no modules, show a message */}
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Memuat data...</div>
                ) : modules.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Tidak ada modul yang tersedia</div>
                ) : (
                    // Map through modules and display them
                    modules.map((module, index) => (
                        <div key={module.id} className="border border-black rounded-lg mb-2">
                            {/* Accordion header */}
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="flex justify-between items-center w-full px-5 py-3 text-left font-semibold bg-white transition-all rounded-lg"
                            >
                                <span className="font-bold text-xl text-black">{index + 1}. {module.judul}</span>
                                <span className="text-xl">{openIndex === index ? "▲" : "▼"}</span>
                            </button>

                            <div className="pl-10">
                                {/* Accordion content */}
                                {openIndex === index && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-black mt-2">Pencapaian Pembelajaran: </h4>
                                        <div className="px-5 py-3 text-md text-black">
                                            <div>{module.poin1}</div>
                                            <div>{module.poin2}</div>
                                            <div>{module.poin3}</div>
                                        </div>

                                        <h6 className="text-md text-black mt-4">Untuk tutorial lebih lanjut, Anda dapat menonton video berikut:</h6>
                                        <div className="mt-2 mb-8">
                                            <span className="flex items-center mt-2">
                                                <img src={iconPPT} alt="Icon PPT" className="w-6 h-6 p-[2px] bg-green-700 rounded-full" />
                                                <a href={module.ppt_link} target="_blank" rel="noopener noreferrer" className="text-green-700 underline ml-2">PPT</a>
                                            </span>
                                            <span className="flex items-center mt-2">
                                                <img src={iconVideo} alt="Icon Video" className="w-6 h-6 p-[2px] bg-red-700 rounded-full" />
                                                <a href={module.video_link} target="_blank" rel="noopener noreferrer" className="text-red-700 underline ml-2">Video YouTube</a>
                                            </span>
                                            <span className="flex items-center mt-2">
                                                <img src={iconModule} alt="Icon Module" className="w-6 h-6 p-[2px] bg-blue-700 rounded-full" />
                                                <a href={module.modul_link} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline ml-2">Modul</a>
                                            </span>
                                        </div>

                                        <span className="flex justify-end pr-3">
                                            <button onClick={handleOpenModalDelete} className="flex justify-center items-center p-2 text-fireRed font-semibold hover:underline transition-all">
                                                <img className="w-5" src={trashIcon} alt="delete icon" />
                                                Delete
                                            </button>
                                            <button onClick={() => handleOpenModalEdit(module)} className="flex justify-center items-center p-2 text-darkBrown font-semibold hover:underline transition-all">
                                                <img className="w-5" src={editIcon} alt="edit icon" />
                                                Edit
                                            </button>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modals */}
            {isModalOpenDelete && <ButtonDeleteModule onClose={handleCloseModalDelete} onConfirm={handleConfirmDelete} message={message} />}
            {isModalOpenEdit && <ButtonEditModule onClose={handleCloseModalEdit} values={values} setValues={setValues} />}
        </div>
    );
}
