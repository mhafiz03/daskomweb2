import { useCallback, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import { useKelasQuery } from "@/hooks/useKelasQuery";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";
import { useJadwalJagaQuery } from "@/hooks/useJadwalJagaQuery";
import { PRAKTIKUM_HISTORY_QUERY_KEY } from "@/hooks/usePraktikumHistoryQuery";

const PHASE_SEQUENCE = [
    { key: "preparation", label: "Preparation" },
    { key: "ta", label: "TA" },
    { key: "fitb_jurnal", label: "FITB + Jurnal" },
    { key: "mandiri", label: "Mandiri" },
    { key: "tk", label: "TK" },
];

const STATUS_LABELS = {
    running: "Running",
    paused: "Paused",
    completed: "Finished",
    exited: "Stopped",
    idle: "Not Yet Started",
};

const formatDuration = (totalSeconds = 0) => {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (value) => value.toString().padStart(2, "0");

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }

    return `${pad(minutes)}:${pad(secs)}`;
};

const formatTimestamp = (value) => {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
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

const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }

    if (error?.message) {
        return error.message;
    }

    return "Terjadi kesalahan tak terduga.";
};

const getPhaseIndex = (phaseKey) =>
    PHASE_SEQUENCE.findIndex((phase) => phase.key === phaseKey);

export default function ContentPraktikum() {
    const [selectedModul, setSelectedModul] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [session, setSession] = useState(null);
    const [displaySeconds, setDisplaySeconds] = useState(0);
    const [reportText, setReportText] = useState("");
    const [pendingAction, setPendingAction] = useState(null);
    const [onlinePraktikan, setOnlinePraktikan] = useState(new Set());

    const queryClient = useQueryClient();

    const {
        data: kelas = [],
        isLoading: kelasLoading,
        isError: kelasError,
    } = useKelasQuery();

    const {
        data: moduls = [],
        isLoading: modulLoading,
        isError: modulError,
    } = useModulesQuery();

    const {
        data: asistens = [],
    } = useAsistensQuery({
        enabled: true,
    });

    const {
        data: praktikumByClass = [],
        isLoading: praktikumLoading,
    } = useQuery({
        queryKey: ["praktikum", selectedKelas],
        queryFn: async () => {
            if (!selectedKelas) {
                return [];
            }

            const { data } = await api.get(`/api-v1/praktikum/${selectedKelas}`);

            if (Array.isArray(data?.data)) {
                return data.data;
            }

            if (Array.isArray(data?.praktikum)) {
                return data.praktikum;
            }

            return [];
        },
        enabled: Boolean(selectedKelas),
        onError: (error) => toast.error(getErrorMessage(error)),
    });

    const selectedPraktikum = useMemo(() => {
        if (!selectedModul) {
            return null;
        }

        const modulId = Number(selectedModul);
        return praktikumByClass.find((item) => Number(item?.modul_id) === modulId) ?? null;
    }, [praktikumByClass, selectedModul]);

    const asistenMap = useMemo(() => {
        const map = new Map();
        asistens.forEach((item) => {
            if (item?.id != null) {
                map.set(Number(item.id), item);
            }
        });
        return map;
    }, [asistens]);

    const selectedKelasData = useMemo(() => {
        if (!selectedKelas) {
            return null;
        }

        return kelas.find((item) => String(item.id) === String(selectedKelas)) ?? null;
    }, [kelas, selectedKelas]);

    const selectedModulData = useMemo(() => {
        if (!selectedModul) {
            return null;
        }

        return moduls.find((item) => String(item.idM) === String(selectedModul)) ?? null;
    }, [moduls, selectedModul]);

    const { data: jadwalData = [], isLoading: jadwalLoading } = useJadwalJagaQuery(
        selectedKelas ? { kelas_id: selectedKelas } : {},
        {
            enabled: Boolean(selectedKelas),
        }
    );

    const jadwalForSelectedKelas = useMemo(() => {
        if (!selectedKelas) {
            return null;
        }

        const kelasId = Number(selectedKelas);
        return (
            jadwalData.find((item) => Number(item?.id ?? item?.kelas_id ?? item?.kelasId) === kelasId) ??
            jadwalData.find((item) => (item?.kelas ?? "").toString() === selectedKelasData?.kelas) ??
            null
        );
    }, [jadwalData, selectedKelas, selectedKelasData]);

    const asistenJagaList = useMemo(() => {
        if (!jadwalForSelectedKelas) {
            return [];
        }

        if (Array.isArray(jadwalForSelectedKelas?.jadwal_jagas)) {
            return jadwalForSelectedKelas.jadwal_jagas;
        }

        if (Array.isArray(jadwalForSelectedKelas?.asistens)) {
            return jadwalForSelectedKelas.asistens;
        }

        return [];
    }, [jadwalForSelectedKelas]);

    const praktikanList = useMemo(() => {
        if (Array.isArray(selectedKelasData?.praktikans)) {
            return selectedKelasData.praktikans;
        }

        if (Array.isArray(jadwalForSelectedKelas?.praktikans)) {
            return jadwalForSelectedKelas.praktikans;
        }

        return [];
    }, [selectedKelasData, jadwalForSelectedKelas]);

    // Get all running praktikum sessions across all classes
    const {
        data: allPraktikum = [],
    } = useQuery({
        queryKey: ["praktikum-all"],
        queryFn: async () => {
            const { data } = await api.get('/api-v1/praktikum');
            return Array.isArray(data?.data) ? data.data : [];
        },
        refetchInterval: 5000, // Refresh every 5 seconds
    });

    const runningPraktikum = useMemo(() => {
        return allPraktikum.filter(p => p.status === 'running' || p.status === 'paused');
    }, [allPraktikum]);

    const selectedPraktikumId = selectedPraktikum?.id ?? session?.id ?? null;
    const effectiveSession = session ?? selectedPraktikum ?? null;
    const hasSelection = Boolean(selectedKelas) && Boolean(selectedModul);

    const computeElapsedSeconds = useCallback((praktikum) => {
        if (!praktikum?.started_at) {
            return 0;
        }

        const startedAt = new Date(praktikum.started_at);
        if (Number.isNaN(startedAt.getTime())) {
            return 0;
        }

        const status = praktikum.status;

        if (status === "running") {
            return Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000));
        }

        if (praktikum.ended_at) {
            const endedAt = new Date(praktikum.ended_at);
            if (!Number.isNaN(endedAt.getTime())) {
                return Math.max(0, Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000));
            }
        }

        return Math.max(0, Math.floor((Date.now() - startedAt.getTime()) / 1000));
    }, []);

    useEffect(() => {
        if (!selectedPraktikum) {
            setSession(null);
            setDisplaySeconds(0);
            return;
        }

        setSession((prev) => {
            if (!prev || prev.id !== selectedPraktikum.id) {
                return { ...selectedPraktikum };
            }

            if (selectedPraktikum.updated_at && selectedPraktikum.updated_at !== prev.updated_at) {
                return { ...prev, ...selectedPraktikum };
            }

            return prev;
        });
    }, [selectedPraktikum]);

    useEffect(() => {
        setDisplaySeconds(computeElapsedSeconds(session));
    }, [session, computeElapsedSeconds]);

    useEffect(() => {
        if (!effectiveSession) {
            setReportText((prev) => (prev === "" ? prev : ""));
            return;
        }

        if (effectiveSession.status === "completed") {
            const targetText = effectiveSession.report_notes ?? "";
            setReportText((prev) => (prev === targetText ? prev : targetText));
        } else {
            setReportText((prev) => (prev === "" ? prev : ""));
        }
    }, [effectiveSession]);

    useEffect(() => {
        if (!session || session.status !== "running") {
            return undefined;
        }

        const intervalId = setInterval(() => {
            setDisplaySeconds(computeElapsedSeconds(session));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [session, computeElapsedSeconds]);

    useEffect(() => {
        if (!window.Echo || !selectedPraktikumId) {
            return undefined;
        }

        const channelName = `praktikum.${selectedPraktikumId}`;
        const channel = window.Echo.channel(channelName);

        const listener = (payload) => {
            const updated = payload?.praktikum;
            if (!updated) {
                return;
            }

            let nextSession = null;

            setSession((prev) => {
                if (prev && prev.id === updated.id) {
                    nextSession = { ...prev, ...updated };
                    return nextSession;
                }

                if (!prev) {
                    nextSession = { ...updated };
                    return nextSession;
                }

                nextSession = prev;
                return prev;
            });

            if (selectedKelas) {
                queryClient.setQueryData(["praktikum", selectedKelas], (prevData) => {
                    if (!Array.isArray(prevData)) {
                        return prevData;
                    }

                    return prevData.map((item) =>
                        item?.id === updated.id ? { ...item, ...updated } : item
                    );
                });
            }

            if (nextSession) {
                setDisplaySeconds(computeElapsedSeconds(nextSession));
            } else {
                setDisplaySeconds(computeElapsedSeconds(updated));
            }
        };

        channel.listen(".PraktikumStatusUpdated", listener);

        return () => {
            window.Echo.leave(channelName);
        };
    }, [selectedPraktikumId, selectedKelas, computeElapsedSeconds, queryClient]);

    // Presence channel for online praktikan tracking
    useEffect(() => {
        if (!window.Echo || !selectedKelas) {
            setOnlinePraktikan(new Set());
            return undefined;
        }

        const presenceChannelName = `presence-kelas.${selectedKelas}`;
        const presenceChannel = window.Echo.join(presenceChannelName);

        presenceChannel
            .here((users) => {
                // Initialize with users already in the channel
                const praktikanIds = new Set(
                    users
                        .filter(user => user.type === 'praktikan')
                        .map(user => user.id)
                );
                setOnlinePraktikan(praktikanIds);
            })
            .joining((user) => {
                // Someone joined the channel
                if (user.type === 'praktikan') {
                    setOnlinePraktikan(prev => new Set([...prev, user.id]));
                }
            })
            .leaving((user) => {
                // Someone left the channel
                if (user.type === 'praktikan') {
                    setOnlinePraktikan(prev => {
                        const next = new Set(prev);
                        next.delete(user.id);
                        return next;
                    });
                }
            })
            .error((error) => {
                console.error('Presence channel error:', error);
            });

        return () => {
            window.Echo.leave(presenceChannelName);
            setOnlinePraktikan(new Set());
        };
    }, [selectedKelas]);

    const createPraktikumMutation = useMutation({
        mutationFn: async () => {
            if (!selectedKelas || !selectedModul) {
                throw new Error("Pilih kelas dan modul sebelum memulai praktikum.");
            }

            const { data } = await api.post("/api-v1/praktikum", {
                kelas_id: Number(selectedKelas),
                modul_id: Number(selectedModul),
            });

            return data?.data ?? data?.praktikum ?? data;
        },
        onSuccess: (praktikum) => {
            if (!praktikum) {
                toast.error("Gagal membuat data praktikum baru.");
                return;
            }

            setSession((prev) => {
                if (prev && prev.id === praktikum.id) {
                    return { ...prev, ...praktikum };
                }

                return { ...praktikum };
            });

            if (selectedKelas) {
                queryClient.setQueryData(["praktikum", selectedKelas], (prevData) => {
                    if (!Array.isArray(prevData)) {
                        return [praktikum];
                    }

                    const exists = prevData.some((item) => item?.id === praktikum.id);
                    if (exists) {
                        return prevData.map((item) =>
                            item?.id === praktikum.id ? { ...item, ...praktikum } : item
                        );
                    }

                    return [...prevData, praktikum];
                });
            }
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const praktikumMutation = useMutation({
        mutationFn: async ({ action, phase, report_notes, praktikumId }) => {
            const targetId = praktikumId ?? selectedPraktikumId;

            if (!targetId) {
                throw new Error("Data praktikum tidak ditemukan.");
            }

            const payload = { action };

            if (phase) {
                payload.phase = phase;
            }

            if (typeof report_notes === "string") {
                payload.report_notes = report_notes;
            }

            const { data } = await api.put(`/api-v1/praktikum/${targetId}`, payload);
            return data;
        },
        onMutate: async ({ action }) => {
            setPendingAction(action);
            return { action };
        },
        onSuccess: (response, variables) => {
            const updated = response?.data;

            if (updated) {
                setSession((prev) => {
                    if (prev && prev.id === updated.id) {
                        return { ...prev, ...updated };
                    }

                    return { ...updated };
                });

                if (selectedKelas) {
                    queryClient.setQueryData(["praktikum", selectedKelas], (prevData) => {
                        if (!Array.isArray(prevData)) {
                            return prevData;
                        }

                        const exists = prevData.some((item) => item?.id === updated.id);
                        if (!exists) {
                            return prevData;
                        }

                        return prevData.map((item) =>
                            item?.id === updated.id ? { ...item, ...updated } : item
                        );
                    });
                }
            }

            if (variables?.action === "report") {
                setReportText(updated?.report_notes ?? "");
            }

            toast.success(response?.message ?? "Status praktikum diperbarui.");
        },
        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
        onSettled: (_, __, ___, context) => {
            setPendingAction(null);

            if (selectedKelas) {
                queryClient.invalidateQueries(["praktikum", selectedKelas]);
            }

            if (context?.action === "report") {
                queryClient.invalidateQueries({ queryKey: PRAKTIKUM_HISTORY_QUERY_KEY });
            }
        },
    });

    const handleAction = useCallback(
        (action, options = {}) => {
            if (!hasSelection) {
                toast.error("Pilih kelas dan modul sebelum mengubah status praktikum.");
                return;
            }

            const payload = { action, ...options };
            if (action === "start" && !payload.phase) {
                payload.phase = PHASE_SEQUENCE[0]?.key ?? "ta";
            }

            if (!selectedPraktikumId && action === "start") {
                createPraktikumMutation.mutate(undefined, {
                    onSuccess: (praktikum) => {
                        if (!praktikum?.id) {
                            toast.error("Gagal menentukan data praktikum.");
                            return;
                        }

                        praktikumMutation.mutate({
                            ...payload,
                            praktikumId: praktikum.id,
                        });
                    },
                });
                return;
            }

            if (!selectedPraktikumId && !payload.praktikumId) {
                toast.error("Data praktikum untuk kombinasi ini tidak ditemukan.");
                return;
            }

            praktikumMutation.mutate(payload);
        },
        [
            hasSelection,
            selectedPraktikumId,
            createPraktikumMutation,
            praktikumMutation,
        ]
    );

    const handleSubmitReport = useCallback(() => {
        const trimmedNotes = reportText.trim();

        if (trimmedNotes.length < 3) {
            toast.error("Isi laporan minimal 3 karakter.");
            return;
        }

        handleAction("report", { report_notes: trimmedNotes });
    }, [reportText, handleAction]);

    const handleSwitchToRunning = useCallback((praktikum) => {
        if (!praktikum) {
            return;
        }
        
        setSelectedKelas(String(praktikum.kelas_id));
        setSelectedModul(String(praktikum.modul_id));
        
        // Scroll to top to see the selected praktikum
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const isRunning = effectiveSession?.status === "running";
    const isPaused = effectiveSession?.status === "paused";
    const isCompleted = effectiveSession?.status === "completed";
    const isTerminal = effectiveSession
        ? ["completed", "exited"].includes(effectiveSession.status)
        : false;
    const hasSession = Boolean(effectiveSession);
    const reportSubmitted = Boolean(
        typeof effectiveSession?.report_notes === "string" &&
        effectiveSession.report_notes.trim().length > 0
    );
    const showReportForm = isCompleted && !reportSubmitted;
    const showReportPreview = isCompleted && reportSubmitted;
    const showControls = !isCompleted;
    const isSubmittingReport = pendingAction === "report" && praktikumMutation.isPending;

    const startDisabled =
        !showControls ||
        !hasSelection ||
        isRunning ||
        praktikumMutation.isPending ||
        createPraktikumMutation.isPending;
    const pauseDisabled =
        !showControls || !hasSession || !isRunning || praktikumMutation.isPending;
    const resumeDisabled =
        !showControls || !hasSession || !isPaused || praktikumMutation.isPending;
    const nextDisabled =
        !showControls ||
        !hasSession ||
        praktikumMutation.isPending ||
        effectiveSession?.status === "idle" ||
        isTerminal;
    const exitDisabled =
        !showControls ||
        !hasSession ||
        !(isRunning || isPaused) ||
        praktikumMutation.isPending;

    const reportSubmitDisabled =
        reportText.trim().length < 3 ||
        praktikumMutation.isPending ||
        createPraktikumMutation.isPending;
    const reportSubmittedAt = formatTimestamp(effectiveSession?.report_submitted_at);
    const startedAtDisplay = formatTimestamp(effectiveSession?.started_at);
    const endedAtDisplay = formatTimestamp(effectiveSession?.ended_at);
    const pjData = effectiveSession?.pj ?? null;
    const reportOwnerDisplay = pjData
        ? [pjData.nama, pjData.kode].filter(Boolean).join(" • ") || `Asisten #${pjData.id}`
        : effectiveSession?.pj_id
            ? `Asisten #${effectiveSession.pj_id}`
            : "-";

    const startLabel = isTerminal && !isCompleted ? "Restart" : "Start";
    const statusLabel =
        STATUS_LABELS[effectiveSession?.status ?? "idle"] ?? STATUS_LABELS.idle;
    const currentPhaseIndex = useMemo(() => {
        if (!effectiveSession?.current_phase) {
            return 0;
        }

        const index = getPhaseIndex(effectiveSession.current_phase);
        if (index === -1) {
            return 0;
        }

        if (effectiveSession.status === "completed") {
            return PHASE_SEQUENCE.length - 1;
        }

        return index;
    }, [effectiveSession]);

    const currentPhaseLabel = effectiveSession?.current_phase
        ? PHASE_SEQUENCE.find((phase) => phase.key === effectiveSession.current_phase)?.label ??
        effectiveSession.current_phase
        : "-";
    return (
        <section className="space-y-6 text-depth-primary">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-depth-lg border border-depth bg-depth-card px-10 py-4 shadow-depth-sm">
                    <h6 className="text-lg font-semibold text-depth-primary">Start Praktikum</h6>
                </div>
            </div>

            <div className="rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                <div className="w-full overflow-y-auto p-6 md:h-96 lg:h-[48rem]">
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="kelas_id"
                                className="block text-xs font-semibold uppercase tracking-wide text-depth-secondary"
                            >
                                Kelas
                            </label>
                            <select
                                className="w-full rounded-depth-md border border-depth bg-depth-card p-3 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                id="kelas_id"
                                value={selectedKelas}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedKelas(value);
                                }}
                            >
                                <option value="">- Pilih Kelas -</option>
                                {kelasLoading && <option disabled>Memuat kelas...</option>}
                                {kelasError && <option disabled>Gagal memuat kelas</option>}
                                {!kelasLoading && !kelasError && kelas.length === 0 && (
                                    <option disabled>Data kelas kosong</option>
                                )}
                                {!kelasLoading && !kelasError &&
                                    kelas.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.kelas}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex-1 space-y-2">
                            <label
                                htmlFor="modul_id"
                                className="block text-xs font-semibold uppercase tracking-wide text-depth-secondary"
                            >
                                Modul
                            </label>
                            <select
                                className="w-full rounded-depth-md border border-depth bg-depth-card p-3 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                id="modul_id"
                                value={selectedModul}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedModul(value);
                                }}
                            >
                                <option value="">- Pilih Modul -</option>
                                {modulLoading && <option disabled>Memuat modul...</option>}
                                {modulError && <option disabled>Gagal memuat modul</option>}
                                {!modulLoading && !modulError && moduls.length === 0 && (
                                    <option disabled>Data modul kosong</option>
                                )}
                                {!modulLoading && !modulError &&
                                    moduls.map((k) => (
                                        <option key={k.idM} value={k.idM}>
                                            {k.judul}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    {/* Running Praktikum Section */}
                    {runningPraktikum.length > 0 && (
                        <div className="mt-4 border-2 border-amber-500 rounded-md p-4 bg-amber-50">
                            <h3 className="text-md font-semibold text-amber-800 mb-3 flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                Praktikum Sedang Berjalan ({runningPraktikum.length})
                            </h3>
                            <div className="space-y-2">
                                {runningPraktikum.map((p) => {
                                    const kelasName = kelas.find(k => k.id === p.kelas_id)?.kelas ?? `Kelas #${p.kelas_id}`;
                                    const modulName = moduls.find(m => m.idM === p.modul_id)?.judul ?? `Modul #${p.modul_id}`;
                                    const statusLabel = STATUS_LABELS[p.status] ?? p.status;
                                    const phaseLabel = PHASE_SEQUENCE.find(phase => phase.key === p.current_phase)?.label ?? p.current_phase;
                                    
                                    return (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between rounded-depth-md border border-[color:var(--depth-border)] bg-depth-card px-3 py-2 shadow-depth-sm transition-colors hover:bg-depth-interactive"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-depth-primary">{kelasName}</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-depth-secondary">{modulName}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                                                    <span className="flex items-center gap-1">
                                                        <span
                                                            className={`rounded-depth-full px-2 py-0.5 text-xs font-semibold text-white ${
                                                                p.status === "running" ? "bg-emerald-500" : "bg-amber-500"
                                                            }`}
                                                        >
                                                            {statusLabel}
                                                        </span>
                                                    </span>
                                                    <span>Tahap: {phaseLabel}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSwitchToRunning(p)}
                                                className="ml-3 rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-depth-lg border border-depth bg-depth-card p-4 shadow-depth-md">
                                <h3 className="mb-2 text-lg font-semibold text-depth-primary">Asisten Jaga</h3>
                                {jadwalLoading ? (
                                    <p className="text-sm text-gray-500">Memuat daftar asisten...</p>
                                ) : asistenJagaList.length > 0 ? (
                                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {asistenJagaList.map((item, idx) => {
                                            const asistenDetail = item?.asisten ?? asistenMap.get(Number(item?.asisten_id));
                                            const key = item?.id ?? `${item?.asisten_id ?? asistenDetail?.id ?? "asisten"}-${idx}`;

                                            return (
                                                <li
                                                    key={key}
                                                    className="flex items-center justify-between rounded-depth-md border border-depth px-3 py-2 text-sm text-depth-primary shadow-depth-sm"
                                                >
                                                    <span className="font-semibold">{asistenDetail?.kode ?? item?.kode ?? "Kode tidak tersedia"}</span>
                                                    <span className="text-right text-depth-secondary">{asistenDetail?.nama ?? item?.nama ?? "Nama tidak tersedia"}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : selectedKelas ? (
                                    <p className="text-sm text-gray-500">Belum ada asisten jaga untuk kelas ini.</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Pilih kelas untuk melihat daftar asisten.</p>
                                )}
                            </div>
                            <div className="rounded-depth-lg border border-depth bg-depth-card p-4 shadow-depth-md">
                                <h3 className="mb-2 text-lg font-semibold text-depth-primary">Praktikan</h3>
                                {selectedKelas ? (
                                    praktikanList.length > 0 ? (
                                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {praktikanList.map((praktikan) => {
                                                const isOnline = onlinePraktikan.has(praktikan?.id);

                                                return (
                                                    <li
                                                        key={praktikan?.id ?? praktikan?.nim}
                                                        className="flex items-center justify-between rounded-depth-md border border-depth px-3 py-2 text-sm text-depth-primary shadow-depth-sm"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="relative">
                                                                {isOnline && (
                                                                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 flex h-2.5 w-2.5">
                                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="font-semibold">{praktikan?.nim ?? "NIM tidak tersedia"}</span>
                                                        </div>
                                                        <span className="ml-3 text-right text-depth-secondary">{praktikan?.nama ?? praktikan?.name ?? "Nama tidak tersedia"}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">Belum ada data praktikan untuk kelas ini.</p>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500">Pilih kelas untuk melihat daftar praktikan.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col items-center gap-6">
                        <div className="w-full rounded-depth-lg border border-depth bg-depth-card p-6 shadow-depth-lg lg:w-3/4 xl:w-2/3">
                            <div className="flex flex-wrap justify-between gap-6">
                                <div>
                                    <p className="text-sm text-depth-secondary">Kelas</p>
                                    <p className="text-lg font-semibold text-depth-primary">
                                        {selectedKelasData?.kelas ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-depth-secondary">Modul</p>
                                    <p className="text-lg font-semibold text-depth-primary">
                                        {selectedModulData?.judul ?? "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-depth-secondary">Status</p>
                                    <p className="text-lg font-semibold text-depth-primary">{statusLabel}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-depth-secondary">Tahap Saat Ini</p>
                                    <p className="text-lg font-semibold text-depth-primary">
                                        {currentPhaseLabel}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-depth-secondary">Laporan</p>
                                    <p className="text-lg font-semibold text-depth-primary">
                                        {reportSubmitted
                                            ? "Sudah dikirim"
                                            : isCompleted
                                                ? "Menunggu laporan"
                                                : "-"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-depth-secondary">PJ Laporan</p>
                                    <p className="text-lg font-semibold text-depth-primary">
                                        {reportSubmitted ? reportOwnerDisplay : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col items-center gap-2">
                                <span className="text-sm uppercase tracking-wide text-depth-secondary">
                                    Timer
                                </span>
                                <span className="text-4xl font-bold text-depth-primary">
                                    {formatDuration(displaySeconds)}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                {PHASE_SEQUENCE.map((phase, index) => {
                                    const isActiveStage =
                                        effectiveSession &&
                                        effectiveSession.status !== "idle" &&
                                        !isTerminal &&
                                        index === currentPhaseIndex;

                                    const isCompletedStage = effectiveSession
                                        ? index < currentPhaseIndex ||
                                        (isTerminal && index === currentPhaseIndex)
                                        : false;

                                    const baseClass =
                                        "rounded-depth-md border border-depth px-4 py-2 text-sm font-semibold transition";
                                    const className = isActiveStage
                                        ? "bg-[var(--depth-color-primary)] text-white border-transparent shadow-depth-md"
                                        : isCompletedStage
                                            ? "bg-depth-interactive text-depth-primary"
                                            : "bg-depth-card text-depth-secondary";

                                    return (
                                        <div key={phase.key} className="flex items-center gap-2">
                                            <span className={`${baseClass} ${className}`}>
                                                {phase.label}
                                            </span>
                                            {index < PHASE_SEQUENCE.length - 1 && (
                                                <span className="text-sm text-depth-secondary">→</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {showReportForm && (
                                <div className="mt-8 w-full">
                                    <label
                                        htmlFor="laporan_praktikum"
                                        className="mb-2 block text-sm font-semibold text-depth-primary"
                                    >
                                        Laporan Praktikum
                                    </label>
                                    <textarea
                                        id="laporan_praktikum"
                                        value={reportText}
                                        onChange={(e) => setReportText(e.target.value)}
                                        rows={6}
                                        className="w-full rounded-depth-lg border border-depth bg-depth-card p-3 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                        placeholder="Catat ringkasan jalannya praktikum, kendala, dan catatan penting lainnya..."
                                    />
                                    <p className="mt-2 text-xs text-depth-secondary">
                                        Catatan: PJ yang terdaftar akan otomatis mengikuti akun asisten yang mengirim laporan.
                                    </p>
                                    <div className="flex justify-end gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleSubmitReport}
                                            disabled={reportSubmitDisabled}
                                            title={
                                                reportSubmitDisabled
                                                    ? "Minimal 3 karakter sebelum mengirim."
                                                    : undefined
                                            }
                                            className={`rounded-depth-md px-5 py-2 font-semibold text-white shadow-depth-sm transition ${
                                                reportSubmitDisabled
                                                    ? "cursor-not-allowed bg-gray-500/50"
                                                    : "bg-[var(--depth-color-primary)] hover:-translate-y-0.5 hover:shadow-depth-md"
                                            }`}
                                        >
                                            {isSubmittingReport ? "Mengirim..." : "Kirim Laporan"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showReportPreview && (
                                <div className="mt-8 w-full rounded-depth-lg border border-depth bg-depth-card p-4 text-depth-primary shadow-depth-md">
                                    <div className="flex flex-wrap justify-between gap-3 text-sm text-depth-secondary">
                                        <span>Laporan dikirim: {reportSubmittedAt ?? "-"}</span>
                                        <span>Mulai: {startedAtDisplay ?? "-"}</span>
                                        <span>Selesai: {endedAtDisplay ?? "-"}</span>
                                        <span>PJ: {reportOwnerDisplay}</span>
                                    </div>
                                    <hr className="my-3 border-[color:var(--depth-border)]" />
                                    <div className="whitespace-pre-wrap text-base leading-relaxed text-depth-primary">
                                        {effectiveSession?.report_notes}
                                    </div>
                                </div>
                            )}

                            {praktikumLoading && hasSelection && (
                                <p className="mt-6 text-center text-sm text-depth-secondary">
                                    Memuat status praktikum...
                                </p>
                            )}
                        </div>

                        {showControls && (
                            <div className="flex flex-wrap justify-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleAction("start")}
                                    disabled={startDisabled}
                                    className={`rounded-depth-md px-6 py-2 font-semibold text-white shadow-depth-sm transition ${
                                        startDisabled
                                            ? "cursor-not-allowed bg-gray-500/50"
                                            : "bg-[var(--depth-color-primary)] hover:-translate-y-0.5 hover:shadow-depth-md"
                                    }`}
                                >
                                    {startLabel}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAction("pause")}
                                    disabled={pauseDisabled}
                                    className={`rounded-depth-md px-6 py-2 font-semibold text-white shadow-depth-sm transition ${
                                        pauseDisabled
                                            ? "cursor-not-allowed bg-gray-500/50"
                                            : "bg-amber-500 hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-depth-md"
                                    }`}
                                >
                                    Pause
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAction("resume")}
                                    disabled={resumeDisabled}
                                    className={`rounded-depth-md px-6 py-2 font-semibold text-white shadow-depth-sm transition ${
                                        resumeDisabled
                                            ? "cursor-not-allowed bg-gray-500/50"
                                            : "bg-sky-600 hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-depth-md"
                                    }`}
                                >
                                    Resume
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAction("next")}
                                    disabled={nextDisabled}
                                    className={`rounded-depth-md px-6 py-2 font-semibold text-white shadow-depth-sm transition ${
                                        nextDisabled
                                            ? "cursor-not-allowed bg-gray-500/50"
                                            : "bg-indigo-600 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-depth-md"
                                    }`}
                                >
                                    Next
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAction("exit")}
                                    disabled={exitDisabled}
                                    className={`rounded-depth-md px-6 py-2 font-semibold text-white shadow-depth-sm transition ${
                                        exitDisabled
                                            ? "cursor-not-allowed bg-gray-500/50"
                                            : "bg-red-600 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-depth-md"
                                    }`}
                                >
                                    Exit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
