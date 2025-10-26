import { Fragment, useMemo, useState } from "react";
import { usePraktikumHistoryQuery } from "@/hooks/usePraktikumHistoryQuery";
import ModalLaporan from "../Modals/ModalLaporan";

const formatDateTime = (value) => {
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

export default function TableHistory() {
    const [selectedReport, setSelectedReport] = useState(null);

    const {
        data: history = [],
        isLoading,
        isError,
        error,
    } = usePraktikumHistoryQuery();

    const hasData = Array.isArray(history) && history.length > 0;

    const errorMessage = useMemo(() => {
        if (!isError) {
            return null;
        }

        return (
            error?.response?.data?.message ??
            error?.message ??
            "Terjadi kesalahan saat memuat history praktikum."
        );
    }, [isError, error]);

    const handleOpenModal = (report) => {
        if (!report?.report_notes) {
            return;
        }

        setSelectedReport(report);
    };

    const handleCloseModal = () => {
        setSelectedReport(null);
    };

    return (
        <div className="mt-5">
            <div className="bg-deepForestGreen rounded-lg py-2 px-2 mb-2">
                <div className="grid grid-cols-5 gap-1">
                    <div className="bg-deepForestGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Tanggal</h1>
                    </div>
                    <div className="bg-deepForestGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Modul</h1>
                    </div>
                    <div className="bg-deepForestGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Kelas</h1>
                    </div>
                    <div className="bg-deepForestGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">Laporan</h1>
                    </div>
                    <div className="bg-deepForestGreen rounded-lg p-1">
                        <h1 className="font-bold text-white text-center">PJ</h1>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto lg:max-h-[48rem] md:max-h-96 border border-lightBrown rounded-lg bg-softIvory">
                <div className="grid grid-cols-5 gap-1">
                    {isLoading ? (
                        <div className="col-span-5 flex items-center justify-center py-6 px-4 text-darkBrown">
                            Memuat history praktikum...
                        </div>
                    ) : isError ? (
                        <div className="col-span-5 flex items-center justify-center py-6 px-4 text-red-600">
                            {errorMessage}
                        </div>
                    ) : !hasData ? (
                        <div className="col-span-5 flex items-center justify-center py-6 px-4 text-darkBrown">
                            Belum ada laporan praktikum yang dikumpulkan.
                        </div>
                    ) : (
                        history.map((item) => {
                            const submittedAt = formatDateTime(item?.report_submitted_at);
                            const modulName = item?.modul?.judul ?? "-";
                            const kelasName = item?.kelas?.kelas ?? "-";
                            const hasReport = Boolean(item?.report_notes);
                            const pjName = item?.pj
                                ? [item.pj.nama, item.pj.kode].filter(Boolean).join(" • ") ||
                                  `Asisten #${item.pj.id}`
                                : item?.pj_id
                                ? `Asisten #${item.pj_id}`
                                : "-";

                            return (
                                <Fragment key={item?.id ?? `${item?.kelas_id ?? "kelas"}-${item?.modul_id ?? "modul"}`}>
                                    <div className="flex items-center justify-center h-full py-2 px-4 text-darkBrown border border-forestGreen text-sm text-center">
                                        {submittedAt}
                                    </div>
                                    <div className="flex items-center justify-center h-full py-2 px-4 text-darkBrown border border-forestGreen text-sm text-center">
                                        {modulName}
                                    </div>
                                    <div className="flex items-center justify-center h-full py-2 px-4 text-darkBrown border border-forestGreen text-sm text-center">
                                        {kelasName}
                                    </div>
                                    <div className="flex items-center justify-center h-full py-2 px-2 border border-forestGreen">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenModal(item)}
                                            disabled={!hasReport}
                                            className={`flex justify-center items-center w-8 h-8 rounded transition-all ${hasReport
                                                    ? "bg-forestGreen text-white hover:bg-deepForestGreen"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                            aria-label="Lihat laporan praktikum"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-center h-full py-2 px-4 text-darkBrown border border-forestGreen text-sm text-center">
                                        {pjName}
                                    </div>
                                </Fragment>
                            );
                        })
                    )}
                </div>
            </div>

            {selectedReport && (
                <ModalLaporan report={selectedReport} onClose={handleCloseModal} />
            )}
        </div>
    );
}
