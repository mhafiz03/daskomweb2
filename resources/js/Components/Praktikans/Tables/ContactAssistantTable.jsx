import { useState } from "react";
import toast from "react-hot-toast";
import daskomIcon from "../../../../../resources/assets/daskom.svg";
import { Dialog } from "@headlessui/react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import iconWA from "../../../../assets/contact/iconWhatsapp.svg";
import iconLine from "../../../../assets/contact/iconLine.svg";
import iconIG from "../../../../assets/contact/iconInstagram.svg";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";

export default function ContactAssistantTable() {
    const [selectedAsisten, setSelectedAsisten] = useState(null);
    const {
        data: asistens = [],
        isLoading,
        isError,
        error,
    } = useAsistensQuery({
        onError: () => {
            toast.error("Whoops terjadi kesalahan 😢, silahkan hubungi software 😁");
        },
    });


    const openModal = (asisten) => {
        setSelectedAsisten(asisten);
    };

    const closeModal = () => {
        setSelectedAsisten(null);
    };

    const RowComponent = ({ asisten }) => (
        <div className="mb-2 cursor-pointer" onClick={() => openModal(asisten)}>
            <div className="flex items-center justify-between rounded-depth-md border border-depth bg-depth-card px-4 py-3 shadow-depth-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-depth-lg">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-depth shadow-depth-sm">
                        <img 
                            src={asisten?.foto ? asisten.foto : daskomIcon} 
                            alt={asisten.kode} 
                            className="h-full w-full object-cover object-top" 
                        />
                    </div>
                    <span className="min-w-[145px] max-w-[146px] break-words text-center font-semibold text-depth-primary">
                        {asisten.nama}
                    </span>
                </div>
                <span className="ml-16 min-w-[48px] max-w-[55px] flex-1 pl-[1px] font-medium text-depth-primary">
                    {asisten.kode}
                </span>
                <span className="ml-12 mr-4 min-w-[100px] max-w-[120px] flex-1 text-center font-medium text-depth-secondary">
                    {asisten.nomor_telepon}
                </span>
                <span className="ml-4 min-w-[40px] max-w-[115px] flex-1 break-words text-center font-medium text-depth-secondary">
                    {asisten.id_line}
                </span>
                <span className="ml-7 mr-10 min-w-[40px] max-w-[115px] flex-1 break-words text-center font-medium text-depth-secondary">
                    {asisten.instagram}
                </span>
            </div>
        </div>
    );

    return (
        <div className="rounded-depth-lg border border-depth bg-depth-card px-6 py-6 shadow-depth-lg">
            <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-3 shadow-depth-md">
                <div className="ml-20 mr-12 flex items-center justify-evenly">
                    <h1 className="text-center font-bold text-white">Nama</h1>
                    <h1 className="text-center font-bold text-white">Kode</h1>
                    <h1 className="text-center font-bold text-white">WhatsApp</h1>
                    <h1 className="text-center font-bold text-white">ID Line</h1>
                    <h1 className="text-center font-bold text-white">Instagram</h1>
                </div>
            </div>
            <div className="mx-auto mt-6 h-[69vh] max-w-[850px] overflow-y-auto scrollbar-thin scrollbar-track-depth scrollbar-thumb-depth-secondary">
                {isLoading ? (
                    <div className="py-10 text-center text-depth-secondary">Memuat data...</div>
                ) : isError ? (
                    <div className="py-10 text-center text-red-500">
                        Error: {error?.message ?? "Gagal memuat data asisten"}
                    </div>
                ) : asistens.length > 0 ? (
                    asistens.map((asisten, index) => <RowComponent key={index} asisten={asisten} />)
                ) : (
                    <div className="py-10 text-center text-depth-secondary">Tidak ada data asisten yang tersedia</div>
                )}
            </div>

            {/* Modal */}
            {selectedAsisten && (
                <Dialog open={true} onClose={closeModal} className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative z-10 w-full max-w-md rounded-depth-lg border border-depth bg-depth-card p-8 text-center shadow-depth-xl">
                        {/* Close Button */}
                        <button 
                            onClick={closeModal} 
                            className="absolute right-3 top-3 flex items-center justify-center rounded-depth-full p-2 text-depth-secondary transition hover:bg-depth-interactive hover:text-depth-primary focus:outline-none"
                        >
                            <img className="w-6" src={closeIcon} alt="closeIcon" />
                        </button>
                        
                        <h2 className="mb-6 text-xl font-bold text-depth-primary">Detail Asisten</h2>
                        <div className="mb-6 flex flex-col items-center">
                            <img 
                                src={selectedAsisten.foto || daskomIcon} 
                                alt={selectedAsisten.kode} 
                                className="mb-4 h-40 w-40 rounded-full border-4 border-[var(--depth-color-primary)] object-cover shadow-depth-lg" 
                            />
                            <h3 className="text-lg font-bold text-[var(--depth-color-primary)]">{selectedAsisten.kode}</h3>
                            <hr className="my-2 w-full border-depth" />
                            <p className="text-sm font-medium text-depth-secondary">{selectedAsisten.nama}</p>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-center gap-3 rounded-depth-md bg-depth-interactive px-4 py-2">
                                <img className="w-6" src={iconWA} alt="iconWA" />
                                <p className="font-medium text-depth-primary">{selectedAsisten.nomor_telepon}</p>
                            </div>
                            <div className="flex items-center justify-center gap-3 rounded-depth-md bg-depth-interactive px-4 py-2">
                                <img className="w-6" src={iconLine} alt="iconLine" />
                                <p className="font-medium text-depth-primary">{selectedAsisten.id_line}</p>
                            </div>
                            <div className="flex items-center justify-center gap-3 rounded-depth-md bg-depth-interactive px-4 py-2">
                                <img className="w-6" src={iconIG} alt="iconIG" />
                                <p className="font-medium text-depth-primary">{selectedAsisten.instagram}</p>
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </div>
    );
}
