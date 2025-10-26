import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Link } from "@inertiajs/react";
import iconPPT from "../../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../../assets/practicum/iconModule.svg";
import iconCeklistboxFalse from "../../../../assets/practicum/iconCeklistboxFalse.svg";
import iconCeklistboxTrue from "../../../../assets/practicum/iconCeklistboxTrue.svg";
import Modal from "../Modals/Modal";
import ModalAttempt from "../Modals/ModalAttempt";
import ModalReview from "../Modals/ModalReview";

const PHASE_LABELS = {
    ta: "Tes Awal",
    fitb_jurnal: "FITB + Jurnal",
    mandiri: "Mandiri",
    tk: "Tes Keterampilan",
};

const STATUS_LABELS = {
    running: "Sedang berjalan",
    paused: "Terjeda",
    completed: "Selesai",
    exited: "Dihentikan",
    idle: "Siap",
};

export default function ModuleSection({
    onNavigate,
    completedCategories,
    setCompletedCategories,
    onReviewTask,
    kelasId = null,
}) {
    const [expandedRows, setExpandedRows] = useState([]);
    const [openModalAttempt, setOpenModalAttempt] = useState(null);
    const [openModalReview, setOpenModalReview] = useState(null);
    const [praktikumDebug, setPraktikumDebug] = useState("Debug: menunggu konfigurasi...");
    const [praktikumState, setPraktikumState] = useState(null);
    const formatTimestamp = (value) => {
        if (!value) {
            return "-";
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const categoryLabels = {
        TugasPendahuluan: "Tugas Pendahuluan",
        TesAwal: "Tes Awal",
        Jurnal: "Jurnal",
        Mandiri: "Mandiri",
        TesKeterampilan: "Tes Keterampilan",
    };

    const [categories, setCategories] = useState({
        TugasPendahuluan: { isSubmitted: false },
        TesAwal: { isSubmitted: false },
        Jurnal: { isSubmitted: false },
        Mandiri: { isSubmitted: false },
        TesKeterampilan: { isSubmitted: false },
    });

    const handleSubmission = (categoryName) => {
        setCategories((prev) => ({
            ...prev,
            [categoryName]: { ...prev[categoryName], isSubmitted: true },
        }));
    };

    const handleOpenModalAttempt = (key) => {
        setOpenModalAttempt(key);
        setOpenModalReview(null);
    };

    const handleOpenModalReview = (key) => {
        setOpenModalReview(key);
        setOpenModalAttempt(null);
    };

    const closeModal = () => {
        setOpenModalAttempt(null);
        setOpenModalReview(null);
    };

    const handleAttemptComplete = (key) => {
        if (key === "TugasPendahuluan") {
            onNavigate("TugasPendahuluan");
        } else if (key === "TesAwal") {
            onNavigate("TesAwal");
        } else if (key === "Jurnal") {
            onNavigate("Jurnal");
        } else if (key === "Mandiri") {
            onNavigate("Mandiri");
        } else if (key === "TesKeterampilan") {
            onNavigate("TesKeterampilan");
        }
        closeModal();
    };

    const handleReviewNavigate = (key) => {
        if (onReviewTask) {
            onReviewTask(key);
        }
    };

    const handleCategoryClick = (key) => {
        if (!completedCategories[key]) {
            handleOpenModalAttempt(key);
        } else {
            handleOpenModalReview(key);
        }
    };

    const rows = [
        {
            id: 1,
            moduleName: (
                <span className="font-bold text-xl">Pengenalan Algoritma dan Pemrograman</span>
            ),
            details: (
                <>
                    <h3 className="font-semibold text-lg pl-[26px]">
                        Pencapaian Pembelajaran
                    </h3>
                    <ol className="list-decimal list-inside pl-[26px]">
                        <li>Mampu mendefinisikan apa itu algoritma dan mengapa penting dalam pemrograman.</li>
                        <li>Mampu menjelaskan struktur dasar dari program C.</li>
                        <li>Mampu mengidentifikasi komponen utama dari sebuah program C.</li>
                        <li>Mampu mengatur lingkungan pengembangan untuk pemrograman C.</li>
                    </ol>
                    <br />
                    <p className="pl-[26px]">
                        Untuk tutorial lebih lanjut, Anda dapat menonton video berikut:
                    </p>
                    <div className="flex items-center mt-2 pl-[26px]">
                        <img src={iconPPT} alt="Icon PPT" className="w-6 h-6 p-[2px] bg-green-700 rounded-full" />
                        <Link
                            href=""
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-700 underline ml-2"
                        >
                            PPT
                        </Link>
                    </div>
                    <div className="flex items-center mt-2 pl-[26px]">
                        <img src={iconVideo} alt="Icon Video" className="w-6 h-6 p-[2px] bg-red-700 rounded-full" />
                        <Link
                            href=""
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red-700 underline ml-2"
                        >
                            Video YouTube
                        </Link>
                    </div>
                    <div className="flex items-center mt-2 pl-[26px]">
                        <img src={iconModule} alt="Icon Module" className="w-6 h-6 p-[2px] bg-blue-700 rounded-full" />
                        <Link
                            href=""
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-700 underline ml-2"
                        >
                            Module
                        </Link>
                    </div>
                    <br />
                    {Object.keys(completedCategories).map((key) => (
                        <div
                            key={key}
                            className="flex items-center justify-between mt-2 pl-[26px]"
                            onClick={() => handleCategoryClick(key)}
                        >
                            <div className="flex items-center">
                                <img
                                    src={completedCategories[key] ? iconCeklistboxTrue : iconCeklistboxFalse}
                                    alt="Checkbox"
                                    className="w-5 h-5 cursor-pointer"
                                />
                                <p className="pl-2 text-black cursor-pointer">
                                    {categoryLabels[key] || key}
                                </p>
                            </div>

                            {completedCategories[key] && (
                                <div className="mr-[42vw]">
                                    <span
                                        className="text-darkGray underline hover:text-dustyBlue cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenModalReview(key);
                                        }}
                                    >
                                        Review
                                    </span>
                                </div>
                            )}

                            {openModalReview === key && (
                                <Modal isOpen={!!openModalReview} onClose={closeModal} width="w-[370px]">
                                    <ModalReview
                                        taskKey={openModalReview}
                                        onReviewNavigate={() => handleReviewNavigate(key)}
                                    />
                                </Modal>
                            )}

                            {openModalAttempt === key && (
                                <Modal isOpen={!!openModalAttempt} onClose={closeModal} width="w-[370px]">
                                    <ModalAttempt
                                        taskKey={openModalAttempt}
                                        onAttemptComplete={(taskKey) => handleAttemptComplete(taskKey)}
                                    />
                                </Modal>
                            )}
                        </div>
                    ))}
                </>
            ),
        },
    ];

    const toggleRow = (id) => {
        if (expandedRows.includes(id)) {
            setExpandedRows(expandedRows.filter((rowId) => rowId !== id));
        } else {
            setExpandedRows([...expandedRows, id]);
        }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        if (!kelasId) {
            setPraktikumState(null);
            return undefined;
        }

        let cancelled = false;

        const fetchInitial = async () => {
            try {
                const { data } = await api.get(`/api-v1/praktikum/${kelasId}`);
                const list = Array.isArray(data?.data)
                    ? data.data
                    : Array.isArray(data?.praktikum)
                        ? data.praktikum
                        : [];

                if (!list.length) {
                    if (!cancelled) {
                        setPraktikumState(null);
                        setPraktikumDebug(
                            "Debug: belum ada data praktikum untuk kelas ini. Tekan Start untuk memulai sesi."
                        );
                    }
                    return;
                }

                const active = list.find((item) => Boolean(item?.isActive)) ?? list[0];

                if (!cancelled && active) {
                    setPraktikumState({
                        status: active?.status ?? null,
                        current_phase: active?.current_phase ?? null,
                        modul:
                            active?.modul?.judul ??
                            active?.modul?.nama ??
                            null,
                        modul_id: active?.modul_id ?? null,
                        started_at: active?.started_at ?? null,
                        ended_at: active?.ended_at ?? null,
                    });

                    setPraktikumDebug(
                        [
                            "Debug: data awal praktikum dimuat.",
                            `Status: ${active?.status ?? "-"}`,
                            `Tahap: ${active?.current_phase ?? "-"}`,
                            `Modul: ${active?.modul?.judul ??
                            active?.modul_id ??
                            "-"
                            }`,
                        ].join("\n")
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setPraktikumDebug(
                        `Debug: gagal memuat informasi awal praktikum (${error?.message ?? "unknown error"}).`
                    );
                }
            }
        };

        fetchInitial();

        return () => {
            cancelled = true;
        };
    }, [kelasId]);

    useEffect(() => {
        if (typeof window === "undefined") {
            setPraktikumDebug("Debug: window tidak tersedia (server-side render).");
            return undefined;
        }

        if (!kelasId) {
            setPraktikumState(null);
            setPraktikumDebug("Debug: kelas ID tidak tersedia untuk praktikum.");
            return undefined;
        }

        const echo = window.Echo;

        if (!echo) {
            setPraktikumDebug("Debug: Laravel Echo belum diinisialisasi.");
            return undefined;
        }

        const channelName = `praktikum.class.${kelasId}`;
        setPraktikumDebug(`Debug: terhubung ke channel ${channelName}, menunggu update...`);

        const channel = echo.channel(channelName);
        const listener = (payload) => {
            const praktikumPayload = payload?.praktikum ?? payload ?? null;
            const formatted = praktikumPayload
                ? JSON.stringify(praktikumPayload, null, 2)
                : "Payload kosong diterima.";

            if (praktikumPayload) {
                setPraktikumState({
                    status: praktikumPayload.status ?? null,
                    current_phase: praktikumPayload.current_phase ?? null,
                    modul:
                        praktikumPayload.modul?.judul ??
                        praktikumPayload.modul?.nama ??
                        null,
                    modul_id: praktikumPayload.modul_id ?? null,
                    started_at: praktikumPayload.started_at ?? null,
                    ended_at: praktikumPayload.ended_at ?? null,
                    pj: praktikumPayload.pj ?? null,
                    pj_id: praktikumPayload.pj_id ?? null,
                });
            } else {
                setPraktikumState(null);
            }

            const summary = praktikumPayload
                ? [
                    `Status: ${praktikumPayload.status ?? "-"}`,
                    `Tahap: ${praktikumPayload.current_phase ?? "-"}`,
                    `Modul: ${praktikumPayload.modul?.judul ??
                    praktikumPayload.modul_id ??
                    "-"
                    }`,
                ].join("\n")
                : "Tidak ada data praktikum yang diterima.";

            setPraktikumDebug(
                `Debug update (${new Date().toLocaleTimeString()}):\n${summary}\n\nPayload mentah:\n${formatted}`
            );
        };

        channel.listen(".PraktikumStatusUpdated", listener);

        return () => {
            try {
                echo.leave(channelName);
            } catch (err) {
                console.warn("Gagal meninggalkan channel praktikum:", err);
            }
        };
    }, [kelasId]);

    const statusLabel = praktikumState?.status
        ? STATUS_LABELS[praktikumState.status] ?? praktikumState.status
        : "Menunggu sesi";
    const phaseLabel = praktikumState?.current_phase
        ? PHASE_LABELS[praktikumState.current_phase] ?? praktikumState.current_phase
        : "-";
    const modulLabel = praktikumState?.modul
        ? praktikumState.modul
        : praktikumState?.modul_id
            ? `Modul #${praktikumState.modul_id}`
            : "-";
    const startedDisplay = formatTimestamp(praktikumState?.started_at);
    const endedDisplay = formatTimestamp(praktikumState?.ended_at);

    return (
        <div className="ml-[3vw] bg-white rounded-lg py-4 px-4 w-[896px] mx-auto">
            <div className="flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-center">
                <h1 className="text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[50%]">MODUL PRAKTIKUM</h1>
            </div>
            <div className="mb-4 grid gap-3 rounded-md border border-lightBrown bg-softIvory p-4 text-sm text-darkBrown">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">
                            Status
                        </p>
                        <p className="text-base font-semibold text-darkBrown">{statusLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">
                            Tahap Saat Ini
                        </p>
                        <p className="text-base font-semibold text-darkBrown">{phaseLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">
                            Modul
                        </p>
                        <p className="text-base font-semibold text-darkBrown">{modulLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-gray-500">
                            Waktu Mulai / Selesai
                        </p>
                        <p className="text-base font-semibold text-darkBrown">
                            {startedDisplay} — {endedDisplay}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Debug Praktikum (Echo)
                </p>
                <pre className="mt-1 whitespace-pre-wrap text-[11px] leading-4 text-gray-600 bg-gray-100 border border-dashed border-gray-300 rounded p-2 max-h-48 overflow-y-auto">
                    {praktikumDebug}
                </pre>
            </div>
            <div
                className="space-y-2 overflow-y-auto"
                style={{ maxHeight: "69vh" }}
            >
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="border border-black rounded-md overflow-hidden"
                    >
                        <div className="flex justify-between items-center px-4 py-2 bg-white">
                            <div className="flex items-center space-x-4">
                                <span className="text-center font-bold text-xl">
                                    {row.id}.
                                </span>
                                <span>{row.moduleName}</span>
                            </div>
                            <button
                                onClick={() => toggleRow(row.id)}
                                className="focus:outline-none"
                            >
                                {expandedRows.includes(row.id) ? "▲" : "▼"}
                            </button>
                        </div>
                        {expandedRows.includes(row.id) && (
                            <div className="px-4 py-2 bg-gray-50 space-y-2">
                                {row.details}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
