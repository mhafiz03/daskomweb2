import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import daskomIcon from "../../../../resources/assets/daskom.svg";
import { Dialog } from "@headlessui/react";
import closeIcon from "../../../assets/modal/iconClose.svg";
import iconWA from "../../../assets/contact/iconWhatsapp.svg";
import iconLine from "../../../assets/contact/iconLine.svg";
import iconIG from "../../../assets/contact/iconInstagram.svg";

export default function ContactAssistantTable() {
    const [asisten, setAsisten] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedAsisten, setSelectedAsisten] = useState(null);
    
    const fetchAsistens = async () => {
        try {
            const response = await fetch('/api-v1/asisten');
            if (response.ok) {
                const data = await response.json();
                setAsisten(data.asisten || []);
            } else {
                toast.error("Whoops terjadi kesalahan 😢, silahkan hubungi software 😁");
            }
        } catch (error) {
            toast.error("Whoops terjadi kesalahan 😢, silahkan hubungi software 😁");
        }
    };

    useEffect(() => {
        fetchAsistens();
    }, []);


    const openModal = (asisten) => {
        setSelectedAsisten(asisten);
    };

    const closeModal = () => {
        setSelectedAsisten(null);
    };

    const RowComponent = ({ asisten }) => (
        <div className="border-b border-transparent mb-1 cursor-pointer" onClick={() => openModal(asisten)}>
            <div className="border-2 border-black flex items-center justify-between px-2 py-1 bg-white text-sm font-semibold shadow-sm shadow-black">
                <div className="flex items-center space-x-4">
                    <div className="ml-1 w-12 h-12 rounded-full overflow-hidden flex justify-center items-center">
                        <img src={asisten?.foto ? asisten.foto : daskomIcon} alt={asisten.kode} className="w-full h-full object-cover" style={{ objectPosition: 'top' }} />
                    </div>
                    <span className="min-w-[145px] max-w-[146px] text-center break-words">{asisten.nama}</span>
                </div>
                <span className="flex-1 ml-[65px] pl-[1px] min-w-[48px] max-w-[55px]">{asisten.kode}</span>
                <span className="flex-1 ml-[48px] mr-[15px] min-w-[100px] max-w-[120px] text-center">{asisten.nomor_telepon}</span>
                <span className="flex-1 ml-[15px] min-w-[40px] max-w-[115px] break-words text-center">{asisten.id_line}</span>
                <span className="flex-1 ml-[29px] mr-[40px] min-w-[40px] max-w-[115px] break-words text-center">{asisten.instagram}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg py-4 px-4 max-w-4xl">
            <div className="bg-deepForestGreen rounded-lg py-2 px-2">
                <div className="flex ml-[80px] mr-[50px] items-center justify-evenly">
                    <h1 className="font-bold text-white text-center">Nama</h1>
                    <h1 className="font-bold text-white text-center">Kode</h1>
                    <h1 className="font-bold text-white text-center">WhatsApp</h1>
                    <h1 className="font-bold text-white text-center">ID Line</h1>
                    <h1 className="font-bold text-white text-center">Instagram</h1>
                </div>
            </div>
            <div className="mt-4 mx-auto max-w-[850px] h-[69vh] overflow-y-auto">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Memuat data...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">Error: {error}</div>
                ) : asisten.length > 0 ? (
                    asisten.map((asisten, index) => <RowComponent key={index} asisten={asisten} />)
                ) : (
                    <div className="text-center py-10 text-gray-500">Tidak ada data asisten yang tersedia</div>
                )}
            </div>

            {/* Modal */}
            {selectedAsisten && (
                <Dialog open={true} onClose={closeModal} className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="absolute inset-0 bg-black opacity-50" onClick={closeModal}></div>
                    <div className="bg-softIvory p-6 rounded-lg shadow-lg z-10 max-w-md w-full text-center relative">
                        {/* Close Button */}
                        <button onClick={closeModal} className="absolute top-2 right-2 flex justify-center items-center">
                            <img className="w-9" src={closeIcon} alt="closeIcon" />
                        </button>
                        
                        <h2 className="text-lg font-bold mb-4">Detail Asisten</h2>
                        <div className="flex flex-col items-center mb-4">
                            <img src={selectedAsisten.foto || daskomIcon} alt={selectedAsisten.kode} className="w-40 h-40 rounded-full object-cover mb-2 border-4 border-sageGreen" />
                            <h3 className="text-md font-semibold">{selectedAsisten.kode}</h3>
                            <hr className="w-full border-gray-300 my-1" />
                            <p className="text-sm text-gray-600">{selectedAsisten.nama}</p>
                        </div>
                        {/* <div className="text-center">
                        </div> */}
                        <div className="mt-4 space-y-1">
                            <div className="flex items-center justify-center space-x-2">
                                <img className="w-6" src={iconWA} alt="iconWA" />
                                <p className="text-center">{selectedAsisten.nomor_telepon}</p>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <img className="w-6" src={iconLine} alt="iconLine" />
                                <p className="text-center">{selectedAsisten.id_line}</p>
                            </div>
                            <div className="flex items-center justify-center space-x-2">
                                <img className="w-6" src={iconIG} alt="iconIG" />
                                <p className="text-center">{selectedAsisten.instagram}</p>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
}
