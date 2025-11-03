import { useCallback, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ModalInputNilai from "../Modals/ModalInputNilai";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import {
    useAssignedPraktikanQuery,
    ASSIGNED_PRAKTIKAN_QUERY_KEY,
} from "@/hooks/useAssignedPraktikanQuery";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";

const SCORE_FIELDS = [
    { key: "tp", label: "TP" },
    { key: "ta", label: "TA" },
    { key: "d1", label: "D1" },
    { key: "d2", label: "D2" },
    { key: "d3", label: "D3" },
    { key: "d4", label: "D4" },
    { key: "i1", label: "I1" },
    { key: "i2", label: "I2" },
];

const toDisplayDate = (value) => {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("id-ID");
};

const toDisplayTime = (value) => {
    if (!value) {
        return "-";
    }

    if (/^\d{2}:\d{2}/.test(value)) {
        return value.slice(0, 5);
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

const normalizeRating = (value) => {
    if (value === null || value === undefined) {
        return null;
    }

    const numeric = Number(value);

    if (Number.isNaN(numeric)) {
        return null;
    }

    return Number(numeric.toFixed(1));
};

const getScoreValue = (nilai, key) => {
    if (!nilai) {
        return "-";
    }

    let raw = nilai[key];

    if (raw === undefined) {
        if (key === "i1") {
            raw = nilai.l1;
        } else if (key === "i2") {
            raw = nilai.l2;
        }
    }

    if (raw === null || raw === undefined) {
        return "-";
    }

    const numeric = Number(raw);

    if (Number.isNaN(numeric)) {
        return raw;
    }

    return Number.isInteger(numeric) ? numeric : numeric.toFixed(1);
};

export default function ContentNilai({ asisten }) {
    const [search, setSearch] = useState("");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const queryClient = useQueryClient();

    const {
        data: assignments = [],
        isLoading,
        isError,
        error,
    } = useAssignedPraktikanQuery({
        onError: (err) => {
            toast.error(err?.message ?? "Whoops terjadi kesalahan 😢");
        },
    });

    const filteredAssignments = useMemo(() => {
        if (!search.trim()) {
            return assignments;
        }

        const keyword = search.toLowerCase();

        return assignments.filter((item) => {
            const bucket = [
                item?.praktikan?.nim,
                item?.praktikan?.nama,
                item?.modul?.judul,
                item?.praktikan?.kelas?.nama,
                item?.datetime?.date,
                item?.datetime?.time,
            ]
                .filter(Boolean)
                .map((value) => value.toString().toLowerCase());

            return bucket.some((value) => value.includes(keyword));
        });
    }, [assignments, search]);

    const handleOpenModalInput = (assignment) => {
        setSelectedAssignment(assignment);
    };

    const handleCloseModalInput = () => {
        setSelectedAssignment(null);
    };

    const handleSaved = () => {
        queryClient.invalidateQueries({ queryKey: ASSIGNED_PRAKTIKAN_QUERY_KEY });
        handleCloseModalInput();
    };

    const handleSearchChange = useCallback((event) => setSearch(event.target.value), []);

    const toolbarConfig = useMemo(
        () => ({
            title: "Input Nilai",
            right: (
                <div className="relative min-w-[18rem] max-w-full">
                    <input
                        type="search"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Cari nama, NIM, modul..."
                        className="w-full rounded-depth-full border border-depth bg-depth-interactive py-2.5 pl-4 pr-11 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 placeholder:text-depth-secondary"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-depth-secondary">
                        🔍
                    </span>
                </div>
            ),
        }),
        [handleSearchChange, search],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <div className="space-y-6 text-depth-primary">
            <div className="rounded-depth-lg border border-depth bg-depth-card p-3 shadow-depth-md">
                <div className="grid grid-cols-[1fr_1.6fr_2.6fr_auto] gap-2 text-xs font-semibold uppercase tracking-wide text-white">
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">
                        Jadwal
                    </div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">
                        Praktikan
                    </div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">
                        Feedback
                    </div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">
                        Review
                    </div>
                </div>
            </div>

            <div className="overflow-y-auto rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg lg:max-h-[48rem]">
                {isLoading && (
                    <div className="flex items-center justify-center gap-3 py-10 text-depth-secondary">
                        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--depth-color-primary)] border-t-transparent" />
                        Memuat data praktikan...
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-red-400">
                        <p>{error?.message ?? "Gagal memuat data praktikan."}</p>
                        <button
                            type="button"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ASSIGNED_PRAKTIKAN_QUERY_KEY })}
                            className="rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {!isLoading && !isError && filteredAssignments.length === 0 && (
                    <div className="py-12 text-center text-depth-secondary">
                        Belum ada praktikan yang siap dinilai.
                    </div>
                )}

                {!isLoading && !isError && filteredAssignments.length > 0 && (
                    <div className="divide-y divide-[color:var(--depth-border)] border-t border-[color:var(--depth-border)]">
                        {filteredAssignments.map((assignment) => {
                            const tanggal = toDisplayDate(
                                assignment?.datetime?.date ?? assignment?.timestamps?.updated_at,
                            );
                            const waktu = toDisplayTime(
                                assignment?.datetime?.time ?? assignment?.timestamps?.updated_at,
                            );
                            const feedbackText =
                                (assignment?.pesan && assignment.pesan.trim()) || "Belum ada feedback";
                            const nilai = assignment?.nilai ?? null;
                            const formattedPraktikumRating = normalizeRating(assignment?.rating_praktikum);
                            const formattedAsistenRating = normalizeRating(assignment?.rating_asisten);
                            const isMarked = Boolean(assignment?.nilai);
                            const statusLabel = isMarked ? "Done" : "Unmarked";
                            const statusTone = isMarked
                                ? "border border-emerald-400/50 bg-emerald-400/15 text-emerald-200"
                                : "border border-amber-400/50 bg-amber-400/15 text-amber-300";
                            const statusAria = isMarked ? "marked" : "unmarked";

                            return (
                                <article
                                    key={assignment.id}
                                    className="space-y-2 bg-depth-card px-4 py-3 text-sm text-depth-primary transition hover:bg-depth-interactive even:bg-depth-background hover:even:bg-depth-interactive"
                                >
                                    <div className="grid grid-cols-[1fr_1.6fr_2.6fr_auto] gap-x-4">
                                        {/* Jadwal */}
                                        <div className="row-span-2 space-y-1 text-left">
                                            <div className="font-semibold text-depth-primary">{tanggal}</div>
                                            <div className="text-xs text-depth-secondary">{waktu}</div>
                                        </div>
                                        {/* Praktikan NIM, nama, and kelas */}
                                        <div className="row-span-2 space-y-1 text-left">
                                            <div className="text-sm font-semibold text-depth-primary">
                                                {assignment?.praktikan?.nim ?? "-"}
                                            </div>
                                            <div className="text-xs text-depth-secondary">
                                                {`${assignment?.praktikan?.nama ?? "Tidak diketahui"} / ${assignment?.praktikan?.kelas?.nama ?? "-"
                                                    }`}
                                            </div>
                                        </div>
                                        {/* Rating and Feedback */}
                                        <div className="row-span-2 space-y-1 text-left">
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-depth-secondary">
                                                {formattedPraktikumRating === null && formattedAsistenRating === null ? (
                                                    <span className="italic text-depth-secondary/80">Belum ada rating</span>
                                                ) : (
                                                    <>
                                                        <span className="font-semibold text-depth-primary">
                                                            Praktikum:
                                                            <span className="ml-1 font-normal">{formattedPraktikumRating ?? "-"}</span>
                                                        </span>
                                                        <span className="font-semibold text-depth-primary">
                                                            Asisten:
                                                            <span className="ml-1 font-normal">{formattedAsistenRating ?? "-"}</span>
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <p
                                                className="max-h-12 overflow-hidden text-xs text-depth-secondary"
                                                title={feedbackText}
                                                aria-label={feedbackText}
                                            >
                                                {feedbackText}
                                            </p>
                                        </div>
                                        {/* Status and Review button */}
                                        <div className="row-span-2 flex items-center justify-between gap-2">
                                            <span
                                                aria-label={statusAria}
                                                className={`inline-flex items-center gap-1 rounded-depth-full px-1 py-1 text-[11px] font-semibold ${statusTone}`}
                                            >
                                                {isMarked ? (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        aria-hidden="true"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M12 5.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13z" />
                                                    </svg>
                                                )}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModalInput(assignment)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth bg-depth-interactive shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                                aria-label="Tinjau nilai praktikan"
                                            >
                                                <img src={editIcon} alt="Edit" className="edit-icon-filter h-4 w-4" />
                                            </button>
                                        </div>


                                    </div>

                                    <div className="grid grid-cols-8 gap-1 text-[11px] text-depth-secondary">
                                        {SCORE_FIELDS.map((field) => (
                                            <div
                                                key={`${assignment.id}-${field.key}`}
                                                className="flex flex-col items-center justify-around rounded-depth-sm border border-depth bg-depth-interactive/60 px-2 py-0.5 text-center"
                                            >
                                                <span className="text-[8px] font-semibold uppercase tracking-wide">
                                                    {field.label}
                                                </span>
                                                <span className="text-sm font-semibold text-depth-primary">
                                                    {getScoreValue(nilai, field.key)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedAssignment && (
                <ModalInputNilai
                    onClose={handleCloseModalInput}
                    assignment={selectedAssignment}
                    asistenId={asisten?.id}
                    onSaved={handleSaved}
                />
            )}
        </div>
    );
}
