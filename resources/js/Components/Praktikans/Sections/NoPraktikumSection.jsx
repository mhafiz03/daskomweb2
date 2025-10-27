import { useState, useEffect } from "react";
import { api } from "@/lib/api";
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

export default function NoPraktikumSection({
    onNavigate,
    completedCategories,
    setCompletedCategories,
    onReviewTask,
    kelasId = null,
    onPraktikumStateChange,
    moduleMeta,
}) {
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
                        pj: active?.pj ?? active?.pj_asisten ?? null,
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
        if (praktikumState) {
            onPraktikumStateChange(praktikumState);
        }
    }, [praktikumState, onPraktikumStateChange]);

    // Fetch initial praktikum state on mount/refresh
    useEffect(() => {
        if (!kelasId) {
            return;
        }

        const fetchActivePraktikum = async () => {
            try {
                const { data } = await api.get('/api-v1/praktikum/check-praktikum');
                
                if (data?.status === 'success' && data?.data) {
                    const praktikumPayload = data.data;
                    
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

                    setPraktikumDebug(
                        `Debug (initial load):\nStatus: ${praktikumPayload.status ?? "-"}\nTahap: ${praktikumPayload.current_phase ?? "-"}\nModul: ${praktikumPayload.modul?.judul ?? "-"}`
                    );
                } else {
                    setPraktikumState(null);
                    setPraktikumDebug("Debug: Tidak ada praktikum aktif saat ini.");
                }
            } catch (error) {
                console.error('Failed to fetch active praktikum:', error);
                setPraktikumDebug(`Debug: Error fetching praktikum - ${error.message}`);
            }
        };

        fetchActivePraktikum();
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

    const resolveDisplayText = (value, fallback = "-") => {
        if (value === null || value === undefined) {
            return fallback;
        }

        if (typeof value === "string" || typeof value === "number") {
            return String(value);
        }

        if (typeof value === "object") {
            return (
                value.judul ??
                value.nama ??
                value.name ??
                value.title ??
                value.email ??
                fallback
            );
        }

        return fallback;
    };

    const modulId = moduleMeta?.modul_id ?? praktikumState?.modul_id ?? null;
    const modulTitle = resolveDisplayText(
        moduleMeta?.modul ??
            praktikumState?.modul ??
            (modulId ? `Modul #${modulId}` : null)
    );
    const pjName = resolveDisplayText(moduleMeta?.pj ?? praktikumState?.pj);

    return (
        <div className="ml-[3vw] bg-white rounded-lg py-4 px-4 w-[896px] mx-auto">
            <div className="flex bg-deepForestGreen rounded-lg py-2 px-2 mb-4 justify-center">
                <h1 className="text-white text-center font-bold text-2xl bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[50%]">PRAKTIKUM</h1>
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
                className="space-y-4 overflow-y-auto"
                style={{ maxHeight: "69vh" }}
            >
                <div className="rounded-lg border border-lightBrown bg-softIvory p-4 text-sm text-darkBrown shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:gap-6">
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase text-gray-500">Modul Aktif</p>
                            <p className="text-lg font-bold text-darkBrown">{modulTitle || "-"}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Penanggung jawab: <span className="font-semibold text-darkBrown">{pjName || "-"}</span>
                            </p>
                        </div>
                        {modulId && (
                            <div className="flex items-center gap-3">
                                <img src={iconModule} alt="Modul" className="w-8 h-8" />
                                <span className="text-xs text-gray-500">ID Modul: {modulId}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
