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
    success: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
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
        <div className="mt-5 space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="border-2 border-darkBrown rounded-md shadow-md ">
                    <h6 className="text-md text-darkBrown text-center py-1 font-semibold px-16">Input Nilai Praktikan</h6>
                </div>
                <div className="relative w-full md:w-72">
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Cari nama, NIM, modul..."
                        className="w-full rounded-md border border-forestGreen bg-white py-2 pl-3 pr-10 text-sm text-darkBrown focus:border-darkGreen focus:outline-none focus:ring-1 focus:ring-darkGreen"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-forestGreen">
                        🔍
                    </span>
                </div>
            </div>

            <div className="rounded-lg bg-deepForestGreen px-2 py-2 shadow">
                <div className="grid grid-cols-5 gap-1 text-sm font-semibold text-white">
                    <div className="rounded-lg px-2 py-1 text-center">Tanggal</div>
                    <div className="rounded-lg px-2 py-1 text-center">Praktikan</div>
                    <div className="rounded-lg px-2 py-1 text-center">Kelas</div>
                    <div className="rounded-lg px-2 py-1 text-center">Waktu</div>
                    <div className="rounded-lg px-2 py-1 text-center">Review</div>
                </div>
            </div>

            <div className="overflow-y-auto rounded-lg border border-forestGreen bg-softIvory shadow-inner lg:max-h-[48rem]">
                {isLoading && (
                    <div className="flex items-center justify-center py-10 text-darkBrown">
                        <span className="mr-3 inline-block h-5 w-5 animate-spin rounded-full border-2 border-darkGreen border-t-transparent" />
                        Memuat data praktikan...
                    </div>
                )}

                {isError && !isLoading && (
                    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-fireRed">
                        <p>{error?.message ?? "Gagal memuat data praktikan."}</p>
                        <button
                            type="button"
                            onClick={() => queryClient.invalidateQueries({ queryKey: ASSIGNED_PRAKTIKAN_QUERY_KEY })}
                            className="rounded-md bg-fireRed px-4 py-1 text-sm font-semibold text-white hover:bg-softRed"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {!isLoading && !isError && filteredAssignments.length === 0 && (
                    <div className="py-12 text-center text-darkBrown/70">
                        Belum ada praktikan yang siap dinilai.
                    </div>
                )}

                {!isLoading && !isError && filteredAssignments.length > 0 && (
                    <div className="divide-y divide-forestGreen/40">
                        {filteredAssignments.map((assignment) => {
                            const isReviewed = Boolean(assignment?.nilai);
                            const status = isReviewed
                                ? { label: "Sudah dinilai", tone: STATUS_CLASS.success }
                                : { label: "Belum dinilai", tone: STATUS_CLASS.pending };

                            return (
                                <div
                                    key={assignment.id}
                                    className="grid grid-cols-5 items-center gap-1 bg-white px-2 py-3 text-sm text-darkBrown"
                                >
                                    <div className="text-center font-medium">
                                        {toDisplayDate(assignment?.datetime?.date ?? assignment?.timestamps?.updated_at)}
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold">{assignment?.praktikan?.nim ?? "-"}</div>
                                        <div className="text-xs text-darkBrown/70">
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
                                            className={`rounded-full px-2 py-1 text-xs font-semibold text-center ${status.tone}`}
                                        >
                                            {status.label}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleOpenModalInput(assignment)}
                                            className="flex items-center gap-1 rounded-md border border-forestGreen px-3 py-1 text-sm font-semibold text-darkBrown transition hover:bg-softBrown"
                                        >
                                            <img src={editIcon} alt="edit icon" className="h-4 w-4" />
                                            {isReviewed ? "Edit Nilai" : "Input Nilai"}
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

