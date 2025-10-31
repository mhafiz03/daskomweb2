import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ModalInputNilai from "../Modals/ModalInputNilai";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import {
    useAssignedPraktikanQuery,
    ASSIGNED_PRAKTIKAN_QUERY_KEY,
} from "@/hooks/useAssignedPraktikanQuery";

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

const STATUS_CLASS = {
    success: "border border-emerald-400/50 bg-emerald-400/15 text-emerald-400",
    pending: "border border-amber-400/50 bg-amber-400/15 text-amber-400",
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

    return (
        <div className="space-y-6 text-depth-primary">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="rounded-depth-lg border border-depth bg-depth-card px-10 py-4 shadow-depth-sm">
                    <h6 className="text-lg font-semibold text-depth-primary">Input Nilai Praktikan</h6>
                </div>
                <div className="relative w-full md:w-80">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama, NIM, modul..."
                        className="w-full rounded-depth-full border border-depth bg-depth-interactive py-2.5 pl-4 pr-11 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 placeholder:text-depth-secondary"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-depth-secondary">
                        🔍
                    </span>
                </div>
            </div>

            <div className="rounded-depth-lg border border-depth bg-depth-card p-3 shadow-depth-md">
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold uppercase tracking-wide text-white">
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Tanggal</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Praktikan</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Kelas</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Waktu</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Review</div>
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
                            const isReviewed = Boolean(assignment?.nilai);
                            const status = isReviewed
                                ? { label: "Done", tone: STATUS_CLASS.success }
                                : { label: "Unmarked", tone: STATUS_CLASS.pending };

                            return (
                                <div
                                    key={assignment.id}
                                    className="grid grid-cols-5 items-center gap-2 bg-depth-card px-4 py-4 text-sm text-depth-primary transition hover:bg-depth-interactive even:bg-depth-interactive"
                                >
                                    <div className="text-center font-medium">
                                        {toDisplayDate(assignment?.datetime?.date ?? assignment?.timestamps?.updated_at)}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">{assignment?.praktikan?.nim ?? "-"}</div>
                                        <div className="text-xs text-depth-secondary">
                                            {assignment?.praktikan?.nama ?? "Tidak diketahui"}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        {assignment?.praktikan?.kelas?.nama ?? "-"}
                                    </div>
                                    <div className="text-center">
                                        {toDisplayTime(assignment?.datetime?.time ?? assignment?.timestamps?.updated_at)}
                                    </div>
                                    <div className="flex items-center justify-center gap-3">
                                        <span
                                            className={`rounded-depth-full px-3 py-1 text-xs font-semibold text-center ${status.tone}`}
                                        >
                                            {status.label}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenModalInput(assignment)}
                                            className="flex items-center gap-2 rounded-depth-md border border-depth bg-depth-interactive px-3 py-2 text-xs font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                        >
                                            <img src={editIcon} alt="edit icon" className="h-4 w-4" />
                                            {/* {isReviewed ? "Edit Nilai" : "Input Nilai"} */}
                                        </button>
                                    </div>
                                </div>
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
