import { useState, useEffect } from "react";
import axios from "axios";
import ButtonEditModule from "./ModalEditModule";
import editIcon from "../../../assets/nav/Icon-Edit.svg";
import trashIcon from "../../../assets/nav/Icon-Delete.svg";
import iconPPT from "../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../assets/practicum/iconModule.svg";
import Cookies from "js-cookie";

export default function TabelModulePraktikum() {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
    const [values, setValues] = useState([]);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [message, setMessage] = useState("");
    const [openIndex, setOpenIndex] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api-v1/modul");
            if (response.ok) {
                const data = await response.json();
                setModules(data.data || []);
            } else {
                console.error('Failed to fetch modules:', response.statusText);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
        } finally {
            setLoading(false);
        }
    };    

    const handleOpenModalEdit = (module) => {
        setSelectedModuleId(module.idM);  // Set the selected module ID
        setIsModalOpenEdit(true);
    };
     

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleConfirmDelete = async (id) => {
        console.log('Attempting to delete module with ID:', id); // Log the ID to check if it's passed correctly
    
        if (!id) {
            console.error('Invalid ID:', id);
            setMessage("ID tidak valid.");
            return;
        }
    
        const token = Cookies.get("XSRF-TOKEN");
    
        try {
            const response = await axios.delete(`/api-v1/modul/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            fetchModules();
        } catch (error) {
            console.error('Error deleting module:', error.response?.data || error.message);
            setMessage("Gagal menghapus modul.");
        }
    };      
    
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        fetchModules();
    }, []);
    
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
                        <div key={module.id || index} className="border border-black rounded-lg mb-2">
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
                                            <button onClick={() => handleConfirmDelete(module.idM)} className="flex justify-center items-center p-2 text-darkBrown font-semibold hover:underline transition-all">
                                                <img className="w-5" src={trashIcon} alt="Delete" />
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
            {/* {isModalOpenDelete && <ButtonDeleteModule onClose={handleCloseModalDelete} onClick={handleConfirmDelete} message={message} />} */}
            {isModalOpenEdit && (
    <ButtonEditModule 
        onClose={handleCloseModalEdit} 
        modules={modules} 
        selectedModuleId={selectedModuleId}
    />
)}        </div>
    );
}
