import { useState } from "react";
import ButtonEditStartPraktikum from "../Modals/ModalEditStartPraktikum";
import ModalLaporanPraktikum from "../Modals/SendLaporanPraktikum";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import laporanIcon from "../../../../assets/nav/Icon-Laporan.svg";
import iconPPT from "../../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../../assets/practicum/iconModule.svg";
import { usePraktikumQuery } from "@/hooks/usePraktikumQuery";

export default function TabelStartPraktikum() {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenSend, setIsModalOpenSend] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);

    const handleOpenModalEdit = () => {
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
    };

    const handleOpenModalSend = () => {
        setIsModalOpenSend(true);
    };

    const handleCloseModalSend = () => {
        setIsModalOpenSend(false);
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const fallbackModules = [
        {
            id: 0,
            title: "Pengenalan Algoritma dan Pemrograman",
            content: [
                "Menjelaskan konsep dasar algoritma.",
                "Membahas cara penulisan algoritma yang efektif.",
                "Mengenal jenis-jenis struktur data yang digunakan dalam algoritma.",
            ],
            resources: {
                ppt: "",
                video: "",
                modul: "",
            },
        },
    ];

    const {
        data: praktikumData = [],
        isFetching,
        isError,
        error,
    } = usePraktikumQuery();

    const modules = Array.isArray(praktikumData) && praktikumData.length > 0
        ? praktikumData.map((item, index) => ({
              id: item.id ?? index,
              title: item.modul?.judul ?? item.judul ?? `Modul ${index + 1}`,
              content: [
                  item.modul?.poin1 ?? item.poin1,
                  item.modul?.poin2 ?? item.poin2,
                  item.modul?.poin3 ?? item.poin3,
              ].filter(Boolean),
              resources: {
                  ppt: item.modul?.ppt_link ?? item.ppt_link ?? "",
                  video: item.modul?.video_link ?? item.video_link ?? "",
                  modul: item.modul?.modul_link ?? item.modul_link ?? "",
              },
          }))
        : fallbackModules;

    return (
        <div className="mt-5 px-4">
            {/* Header dengan div */}
            <div className="bg-deepForestGreen rounded-lg py-2 px-4 mb-4 shadow-md flex justify-center items-center">
                <h1 className="font-bold text-white text-center text-2xl hover:bg-darkOliveGreen hover:rounded-lg transition-colors duration-300 px-4 py-1">
                    Start Praktikum
                </h1>
            </div>

            {/* Kontainer modul untuk scroll tabel */}
            <div className="overflow-x-auto lg:max-h-[48rem] md:max-h-96 bg-white rounded-lg p-1">
                {isFetching && (
                    <div className="text-center text-gray-500 py-6">
                        Memuat data praktikum...
                    </div>
                )}
                {isError && (
                    <div className="text-center text-red-500 py-6">
                        Gagal memuat data praktikum{error?.message ? `: ${error.message}` : ""}
                    </div>
                )}
                {/* Accordion */}
                {!isFetching && modules.map((module, index) => (
                    <div
                        key={module.id ?? index}
                        className="border border-black rounded-lg mb-2"
                    >
                        {/* Header Accordion */}
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="flex justify-between items-center w-full px-5 py-3 text-left font-semibold bg-white transition-all rounded-lg"
                        >
                            <span className="font-bold text-xl text-black">{index + 1}. {module.title}</span>
                            <span className="text-xl">{openIndex === index ? "▲" : "▼"}</span>
                        </button>

                        <div className="pl-10">
                            {/* Konten Accordion */}
                            {openIndex === index && (
                                <div>
                                    <h4 className="text-lg font-semibold text-black mt-2">Pencapaian Pembelajaran: </h4>
                                    <div className="px-5 py-3 text-md text-black">
                                        {module.content.map((item, i) => (
                                            <div key={i} className="flex items-start space-x-2">
                                                <span className="font-semibold">{i + 1}.</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <h6 className="text-md text-black mt-4">Untuk tutorial lebih lanjut, Anda dapat menonton video berikut:</h6>
                                    {/* per link sosmed belajar */}
                                    <div className="mt-2 mb-8">
                                        {/* link ppt */}
                                        <span className="flex items-center mt-2">
                                            <img src={iconPPT} alt="Icon PPT" className="w-6 h-6 p-[2px] bg-green-700 rounded-full" />
                                            <a
                                                href={module.resources?.ppt || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-700 underline ml-2"
                                            >
                                                PPT
                                            </a>
                                        </span>

                                        {/* link youtube */}
                                        <span className="flex items-center mt-2">
                                            <img src={iconVideo} alt="Icon Video" className="w-6 h-6 p-[2px] bg-red-700 rounded-full" />
                                            <a
                                                href={module.resources?.video || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-red-700 underline ml-2"
                                            >
                                                Video YouTube
                                            </a>
                                        </span>

                                        {/* link pdf module */}
                                        <span className="flex items-center mt-2">
                                            <img src={iconModule} alt="Icon Module" className="w-6 h-6 p-[2px] bg-blue-700 rounded-full" />
                                            <a
                                                href={module.resources?.modul || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 underline ml-2"
                                            >
                                                Modul
                                            </a>
                                        </span>
                                    </div>

                                    {/* Tombol Edit */}
                                    <span className="flex space-x-3 justify-end pr-3">
                                        <button
                                            onClick={handleOpenModalEdit}
                                            className="flex justify-center items-center p-2 text-darkBrown font-semibold hover:underline transition-all"
                                        >
                                            <img className="w-5" src={editIcon} alt="edit icon" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={handleOpenModalSend}
                                            className="flex justify-center items-center p-2 text-darkBrown font-semibold hover:underline transition-all"
                                        >
                                            <img className="w-5" src={laporanIcon} alt="laporan icon" />
                                            Kirim Laporan
                                        </button>
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpenEdit && <ButtonEditStartPraktikum onClose={handleCloseModalEdit} />}
            {isModalOpenSend && <ModalLaporanPraktikum onClose={handleCloseModalSend} />}
        </div>
    );
}
