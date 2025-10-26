import closeIcon from "../../../../assets/modal/iconClose.svg";

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

export default function ModalLaporan({ report, onClose }) {
    if (!report) {
        return null;
    }

    const modulName = report?.modul?.judul ?? "Modul tidak diketahui";
    const kelasName = report?.kelas?.kelas ?? "Kelas tidak diketahui";
    const submittedAt = formatDateTime(report?.report_submitted_at);
    const startedAt = formatDateTime(report?.started_at);
    const endedAt = formatDateTime(report?.ended_at);
    const notes = report?.report_notes?.trim() || "Tidak ada catatan laporan.";
    const pjName = report?.pj
        ? [report.pj.nama, report.pj.kode].filter(Boolean).join(" • ") || `Asisten #${report.pj.id}`
        : report?.pj_id
        ? `Asisten #${report.pj_id}`
        : "-";

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12 lg:w-3/4 xl:w-2/3 relative max-h-[85vh]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-3 right-3 flex justify-center items-center"
                >
                    <img className="w-8" src={closeIcon} alt="Tutup modal" />
                </button>

                <div className="space-y-4 pr-2">
                    <div>
                        <h4 className="text-lg text-darkBrown font-semibold">
                            {kelasName}
                        </h4>
                        <p className="text-sm text-gray-600">
                            Mulai: {startedAt} • Selesai: {endedAt} • Laporan dikirim: {submittedAt}
                        </p>
                        <p className="text-sm text-gray-600">
                            PJ Laporan: {pjName}
                        </p>
                    </div>

                    {/* Divider */}
                    <hr className="border-t-2 border-darkBrown" />

                    <div className="lg:max-h-[60vh] md:max-h-96 overflow-y-auto pr-2">
                        <h2 className="text-xl font-bold text-black text-center mb-4">
                            {modulName}
                        </h2>
                        <p className="whitespace-pre-wrap leading-relaxed text-darkBrown text-base">
                            {notes}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
