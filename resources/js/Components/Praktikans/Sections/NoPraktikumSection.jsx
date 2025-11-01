import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import iconModule from "../../../../assets/practicum/iconModule.svg";
import iconCeklistboxFalse from "../../../../assets/practicum/iconCeklistboxFalse.svg";
import iconCeklistboxTrue from "../../../../assets/practicum/iconCeklistboxTrue.svg";
import Modal from "../Modals/Modal";
import ModalAttempt from "../Modals/ModalAttempt";
import ModalReview from "../Modals/ModalReview";

const PHASE_LABELS = {
    preparation: "Preparation",
    ta: "Tes Awal",
    fitb_jurnal: "FITB + Jurnal",
    mandiri: "Mandiri",
    tk: "Tes Keterampilan",
    feedback: "Feedback",
};

const STATUS_LABELS = {
    running: "Sedang berjalan",
    paused: "Terjeda",
    completed: "Selesai",
    exited: "Dihentikan",
    idle: "Siap",
};

export default function NoPraktikumSection({
    isVisible = true,
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
    const applyPraktikumState = useCallback((payload) => {
        console.log(`[${new Date().toISOString()}] Applying praktikum payload:`, payload);
        if (!payload) {
            setPraktikumState(null);

            return;
        }

        setPraktikumState((previous) => {
            const previousState = previous ?? null;

            const resolvedModul =
                payload.modul?.judul ??
                payload.modul?.nama ??
                previousState?.modul ??
                (payload.modul_id ? `Modul #${payload.modul_id}` : null);

            return {
                status: payload.status ?? previousState?.status ?? null,
                current_phase: payload.current_phase ?? previousState?.current_phase ?? null,
                modul: resolvedModul,
                modul_id: payload.modul_id ?? previousState?.modul_id ?? null,
                started_at: payload.started_at ?? previousState?.started_at ?? null,
                ended_at: payload.ended_at ?? previousState?.ended_at ?? null,
                pj: payload.pj ?? previousState?.pj ?? null,
                pj_id: payload.pj_id ?? previousState?.pj_id ?? null,
            };
        });
    }, []);
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
        if (!isVisible) {
            document.body.style.overflow = "";

            return undefined;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) {
            setOpenModalAttempt(null);
            setOpenModalReview(null);
        }
    }, [isVisible]);

    useEffect(() => {
        onPraktikumStateChange(praktikumState);
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
                    
                    applyPraktikumState(praktikumPayload);

                    setPraktikumDebug(
                        `Debug (initial load):\nStatus: ${praktikumPayload.status ?? "-"}\nTahap: ${praktikumPayload.current_phase ?? "-"}\nModul: ${praktikumPayload.modul?.judul ?? "-"}`
                    );
                    console.log(`[${new Date().toISOString()}] Praktikum debug snapshot (initial load):`, praktikumPayload);
                } else {
                    applyPraktikumState(null);
                    setPraktikumDebug("Debug: Tidak ada praktikum aktif saat ini.");
                    console.log(`[${new Date().toISOString()}] Praktikum debug snapshot: tidak ada praktikum aktif.`);
                }
            } catch (error) {
                console.error('Failed to fetch active praktikum:', error);
                setPraktikumDebug(`Debug: Error fetching praktikum - ${error.message}`);
                console.log(`[${new Date().toISOString()}] Praktikum debug snapshot: error fetching praktikum`, error);
            }
        };

        fetchActivePraktikum();
    }, [kelasId, applyPraktikumState]);

    useEffect(() => {
        if (typeof window === "undefined") {
            setPraktikumDebug("Debug: window tidak tersedia (server-side render).");
            return undefined;
        }

        if (!kelasId) {
            applyPraktikumState(null);
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

            if (!praktikumPayload) {
                console.log(`[${new Date().toISOString()}] Praktikum channel update received without payload, preserving current state.`);
                return;
            }

            applyPraktikumState(praktikumPayload);

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
            console.log(`[${new Date().toISOString()}] Praktikum debug snapshot (channel update):`, praktikumPayload ?? payload);
        };

        channel.listen(".PraktikumStatusUpdated", listener);

        return () => {
            try {
                echo.leave(channelName);
            } catch (err) {
                console.warn("Gagal meninggalkan channel praktikum:", err);
            }
        };
    }, [kelasId, applyPraktikumState]);

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
        <div
            className="mx-auto ml-[3vw] w-[896px] rounded-depth-lg border border-depth bg-depth-card px-6 py-6 shadow-depth-lg"
            style={{ display: isVisible ? "block" : "none" }}
        >
            <div className="mb-6 flex justify-center rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-3 shadow-depth-md">
                <h1 className="w-[50%] rounded-depth-md p-2 text-center text-2xl font-bold text-white transition hover:bg-white/10">
                    PRAKTIKUM
                </h1>
            </div>
            <div className="mb-6 grid gap-4 rounded-depth-md border border-depth bg-depth-interactive p-5 text-sm shadow-depth-sm">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                            Status
                        </p>
                        <p className="text-base font-semibold text-depth-primary">{statusLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                            Tahap Saat Ini
                        </p>
                        <p className="text-base font-semibold text-depth-primary">{phaseLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                            Modul
                        </p>
                        <p className="text-base font-semibold text-depth-primary">{modulLabel}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                            Waktu Mulai / Selesai
                        </p>
                        <p className="text-base font-semibold text-depth-primary">
                            {startedDisplay} — {endedDisplay}
                        </p>
                    </div>
                </div>
            </div>
            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                    Debug Praktikum (Echo)
                </p>
                <pre className="mt-2 max-h-48 overflow-y-auto rounded-depth-md border border-dashed border-depth bg-depth-interactive p-3 text-[11px] leading-4 text-depth-secondary scrollbar-thin scrollbar-track-depth scrollbar-thumb-depth-secondary">
                    {praktikumDebug}
                </pre>
            </div>
            <div
                className="space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-depth scrollbar-thumb-depth-secondary"
                style={{ maxHeight: "69vh" }}
            >
                <div className="rounded-depth-md border border-depth bg-depth-interactive p-5 text-sm shadow-depth-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">Modul Aktif</p>
                            <p className="text-lg font-bold text-depth-primary">{modulTitle || "-"}</p>
                            <p className="mt-1 text-xs text-depth-secondary">
                                Penanggung jawab: <span className="font-semibold text-depth-primary">{pjName || "-"}</span>
                            </p>
                        </div>
                        {modulId && (
                            <div className="flex items-center gap-3">
                                <img src={iconModule} alt="Modul" className="h-8 w-8" />
                                <span className="text-xs text-depth-secondary">ID Modul: {modulId}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
