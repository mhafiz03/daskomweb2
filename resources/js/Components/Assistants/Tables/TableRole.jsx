import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import ModalDeleteRole from "../Modals/ModalDeleteRole";
import ModalConfirmDeleteRole from "../Modals/ModalConfirmDeleteRole";
import ModalEditRole from "../Modals/ModalEditRole";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useAsistensQuery, ASISTENS_QUERY_KEY } from "@/hooks/useAsistensQuery";
import { useQueryClient } from "@tanstack/react-query";
import { submit } from "@/lib/wayfinder";
import { destroy as destroyAsistens } from "@/actions/App/Http/Controllers/API/AsistenController";

export default function TableManageRole({ asisten }) {
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenConfirmDelete, setIsModalOpenConfirmDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [checkedAsistens, setCheckedAsistens] = useState([]); 
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAsistenId, setSelectedAsistenId] = useState(null);
    const queryClient = useQueryClient();

    const {
        data: asistens = [],
        isFetching: asistensFetching,
        isError: asistensError,
    } = useAsistensQuery({
        onError: () => {
            toast.error("Whoops terjadi kesalahan 😢, silahkan hubungi software 😁");
        },
    });

    const toggleCheckedAsisten = (kode) => {
        setCheckedAsistens((prev) =>
            prev.includes(kode) ? prev.filter((item) => item !== kode) : [...prev, kode]
        );
    };

    const handleCloseModalConfirmDelete = () => {
        setIsModalOpenConfirmDelete(false);
        queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
        queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
    };

    const handleOpenModalEdit = (id) => {
        setSelectedAsistenId(id); // Store the selected role ID
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
    };

    // Open confirmation modal
    const handleOpenModalDelete = () => {
        if (checkedAsistens.length === 0) return; // Prevent opening if no items selected
        setIsModalOpenConfirmDelete(true);
    };
    
    const roleColors = {
        SOFTWARE: "bg-blue-500",
        KORDAS: "bg-green-500",
        WAKORDAS: "bg-yellow-500",
        KOORPRAK: "bg-purple-500",
        ADMIN: "bg-red-500",
        HARDWARE: "bg-teal-500",
        DDC: "bg-indigo-500",
        ATC: "bg-pink-500",
        RDC: "bg-gray-500",
        HRD: "bg-orange-500",
        CMD: "bg-cyan-500",
        MLC: "bg-lime-500"
    };

    const handleConfirmDelete = async () => {
        setIsModalOpenConfirmDelete(false);
        setIsLoading(true);
        submit(destroyAsistens(), {
            data: { asistens: checkedAsistens },
            onSuccess: () => {
                toast.success("Asisten berhasil dihapus 🎉");
                setCheckedAsistens([]);
                queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
            },
            onError: (error) => {
                toast.error("Whoops terjadi kesalahan 😢");
            },
            onFinish: () => {
                setIsLoading(false);
                queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
            }
        });

    };

    return (
        <div className="mt-4">
            {/* Toast Container (MUST be placed here once) */}
            <Toaster />
            {/* sort search etc */}
            <div className="bg-deepForestGreen rounded-lg p-1 mb-2">
                <div className="grid grid-cols-6 gap-4 justify-between">
                    <div className="rounded-lg p-1 col-start-1 col-end-3 mx-2 ">
                        <button 
                            onClick={handleOpenModalDelete} 
                            className={`text-md font-bold text-white bg-redredDark hover:bg-softRed rounded-lg px-6 p-2 justify-self-start ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                </svg>
                            ) : "Delete"}
                        </button>
                    </div>
                    <div className="rounded-lg p-1 col-span-2 col-end-7 justify-self-end mx-2 ">
                        <input 
                            type="text" 
                            placeholder="Search" 
                            className="p-2 rounded-md "
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {/* Header dengan div */}
            <div className="bg-deepForestGreen rounded-lg py-2 px-2 mb-2">
                <div className="grid grid-cols-5 gap-1">
                   
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Pilih</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Nama</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Kode</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Role</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Review</h1>
                    </div>
                </div>
            </div>

            {/* Kontainer Tabel Scrollable */}
            <div className="overflow-x-auto max-h-screen">
                <div className="">
                    {(asistensFetching || asistensError) && (
                        <div className="text-center text-white py-3">
                            {asistensFetching ? "Memuat data..." : "Gagal memuat data asisten"}
                        </div>
                    )}
                    {!asistensFetching && !asistensError && asistens
                        .filter((item) => 
                            search.toLowerCase() === "" || 
                            item.nama.toLowerCase().includes(search.toLowerCase()) ||
                            item.kode.toLowerCase().includes(search.toLowerCase()) ||
                            item.role.toLowerCase().includes(search.toLowerCase())
                        )
                        .filter(item => item.kode !== asisten.kode)
                        .map((item, index) => (
                            <div key={index} className="grid grid-cols-5 gap-1 text-darkBrown bg-white border border-forestGreen py-1 px-2 mb-2 rounded-lg">
                                <div className="flex items-center justify-center h-full py-1 px-2">
                                    <input
                                        type="checkbox"
                                        checked={checkedAsistens.includes(item.kode)}
                                        onChange={() => toggleCheckedAsisten(item.kode)}
                                    />
                                </div>
                                <div className="flex items-center justify-center h-full py-1 px-2">{item.nama}</div>
                                <div className="flex items-center justify-center h-full py-1 px-2">{item.kode}</div>
                                <div className="flex items-center justify-center h-full py-1 px-2">
                                    <button className={`px-2 text-white rounded-md ${roleColors[item.role] || "bg-gray-600"}`}>
                                        {item.role}
                                    </button>
                                </div>
                                <div className="flex items-center justify-center h-full py-1 px-2 ">
                                    {/* Tombol Edit */}
                                    <button
                                        onClick={() => handleOpenModalEdit(item.kode)}
                                        className="flex justify-center items-center p-2 text-darkBrown font-semibold hover:underline transition-all"
                                    >
                                        <img className="w-5" src={editIcon} alt="edit icon" />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Modal Konfirmasi */}
            {isModalOpenConfirmDelete && (
                <ModalConfirmDeleteRole
                    onClose={handleCloseModalConfirmDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
            
            {/* Modal Hapus */}
            {isModalOpenDelete && (
                <ModalDeleteRole
                    onClose={handleCloseModalDelete}
                />
            )}

            {/* Modal Edit */}
            {isModalOpenEdit && <ModalEditRole onClose={handleCloseModalEdit} asistenId={selectedAsistenId}/>}
        </div>
    );
}
