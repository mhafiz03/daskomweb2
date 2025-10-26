import { useState } from "react";
import toast from "react-hot-toast";
import ButtonEditModule from "../Modals/ModalEditModule";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import iconPPT from "../../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../../assets/practicum/iconModule.svg";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useModulesQuery, MODULES_QUERY_KEY } from "@/hooks/useModulesQuery";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export default function TableModule() {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);
    const queryClient = useQueryClient();
    const [initialOpen, setInitialOpen] = useState(false);

    const {
        data: modules = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery();

    const handleModuleUpdate = (updatedModule) => {
        queryClient.setQueryData(MODULES_QUERY_KEY, (prev) => {
            if (!Array.isArray(prev)) {
                return prev;
            }

            return prev.map((module) =>
                module.idM === updatedModule.idM ? { ...module, ...updatedModule } : module
            );
        });
    };

    const deleteModuleMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/api-v1/modul/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
            toast.success("Modul berhasil dihapus!");
            setIsDeleteModalOpen(false);
            setModuleToDelete(null);
        },
        onError: (err) => {
            const responseMessage = err?.response?.data?.message ?? err?.message ?? "Gagal menghapus modul.";
            toast.error(responseMessage);
            setIsDeleteModalOpen(false);
        },
    });

    const handleOpenModalEdit = (module) => {
        console.log("Opening edit modal for module:", module);
        setSelectedModuleId(module.idM);
        setInitialOpen(true);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        setSelectedModuleId(null); // Clear the selected module ID when closing modal
    };

    // Updated delete handler to show confirmation modal
    const handleDeleteClick = (id) => {
        setModuleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Cancel delete
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setModuleToDelete(null);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!moduleToDelete) {
            setMessage("ID tidak valid.");
            setIsDeleteModalOpen(false);
            return;
        }

        deleteModuleMutation.mutate(moduleToDelete);
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
            <div className="overflow-x-auto lg:max-h-[48rem] md:max-h-96 bg-white rounded-lg p-1">
                {/* If no modules, show a message */}
                {modulesLoading ? (
                    <div className="text-center py-10 text-gray-500">Memuat data...</div>
                ) : modulesError ? (
                    <div className="text-center py-10 text-red-500">
                        {modulesQueryError?.message ?? "Gagal memuat data modul"}
                    </div>
                ) : modules.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">Tidak ada modul yang tersedia</div>
                ) : (
                    // Map through modules and display them
                    modules.map((module, index) => (
                        <div key={`module-${module.idM}-${index}`} className="border border-black rounded-lg mb-2">
                            {/* Accordion header */}
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="flex justify-between items-center w-full px-5 py-3 text-left font-semibold bg-white transition-all rounded-lg"
                            >
                                <span className="font-bold text-xl text-black">{index + 1}. {module.judul}</span>
                                <div className="flex items-center gap-2">
                                    {module.isUnlocked === 0 && (
                                        <span className=" rounded py-1 text-sm">
                                            🔒
                                        </span>
                                    )}
                                    {module.isEnglish === 1 && (
                                        <span className="border border-gray-400 rounded-lg px-2 py-1 text-sm text-white bg-deepForestGreenDark">
                                            English
                                        </span>
                                    )}
                                    <span className="text-xl">{openIndex === index ? "▲" : "▼"}</span>
                                </div>
                            </button>

                            <div className="pl-10">
                                {/* Accordion content */}
                                {openIndex === index && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-black mt-2">Pencapaian Pembelajaran: </h4>
                                        <div className="px-5 py-3 text-md text-black">
                                            <ol className="list-decimal pl-5">
                                                {module.poin1 && <li>{module.poin1}</li>}
                                                {module.poin2 && <li>{module.poin2}</li>}
                                                {module.poin3 && <li>{module.poin3}</li>}
                                            </ol>
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
                                            <button
                                                onClick={() => handleDeleteClick(module.idM)}
                                                className="flex justify-center items-center p-2 text-fireRed font-semibold hover:underline transition-all"
                                            >
                                                <img className="w-5" src={trashIcon} alt="Delete" />
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => handleOpenModalEdit(module)}
                                                className="flex justify-center items-center p-2 text-darkBrown font-semibold hover:underline transition-all"
                                            >
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

            {/* Edit Module Modal */}
            {isModalOpenEdit && (
                <ButtonEditModule
                    onClose={handleCloseModalEdit}
                    modules={modules}
                    selectedModuleId={selectedModuleId}
                    onUpdate={handleModuleUpdate}
                    initialOpen={initialOpen} // Pass this flag
                />
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg relative">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                            <h2 className="text-2xl font-bold text-deepForestGreen">Konfirmasi Hapus</h2>
                            <button
                                onClick={handleCancelDelete}
                                className="absolute top-2 right-2 flex justify-center items-center"
                            >
                                <img className="w-9" src={closeIcon} alt="closeIcon" />
                            </button>
                        </div>

                        <p className="mb-6 text-center">Apakah Anda yakin ingin menghapus modul ini?</p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleCancelDelete}
                                className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="px-6 py-2 bg-fireRed text-white font-semibold rounded-md shadow hover:bg-softRed transition duration-300"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
