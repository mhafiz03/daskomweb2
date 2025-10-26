import { useQuery } from "@tanstack/react-query";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { api } from "@/lib/api";

const fetchJawabanTp = async ({ nim, modulId }) => {
    if (!nim || !modulId) {
        return null;
    }

    const { data } = await api.get(`/api-v1/jawaban-tp/${nim}/${modulId}`);

    if (data?.success === false) {
        throw new Error(data?.message ?? "Gagal memuat jawaban TP");
    }

    return data?.data ?? null;
};

export default function ModalJawabanTP({ onClose, nim, modulId, assignment }) {
    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["jawaban-tp", nim, modulId],
        queryFn: () => fetchJawabanTp({ nim, modulId }),
        enabled: Boolean(nim && modulId),
    });

    const praktikan = data?.praktikan ?? assignment?.praktikan ?? null;
    const modul = data?.modul ?? assignment?.modul ?? null;
    const jawabanList = data?.jawabanData ?? [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 rounded-full p-1 hover:bg-gray-100"
                    aria-label="Tutup"
                >
                    <img className="h-8 w-8" src={closeIcon} alt="Tutup" />
                </button>

                <header className="mb-4 space-y-1 text-center">
                    <h3 className="text-2xl font-bold text-deepForestGreen">Jawaban Tugas Pendahuluan</h3>
                    <p className="text-sm text-darkBrown/70">
                        {praktikan?.nim ?? "-"} · {praktikan?.nama ?? "Praktikan"}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-darkBrown/60">
                        {modul?.judul ?? "Modul tidak ditemukan"}
                    </p>
                </header>

                <hr className="mb-4 border-darkBrown/20" />

                <div className="max-h-[32rem] overflow-y-auto pr-1 text-sm">
                    {!nim || !modulId ? (
                        <div className="py-10 text-center text-darkBrown/70">
                            Data praktikan atau modul tidak lengkap.
                        </div>
                    ) : isLoading ? (
                        <div className="flex items-center justify-center gap-2 py-10 text-darkBrown">
                            <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-darkBrown border-t-transparent" />
                            Memuat jawaban...
                        </div>
                    ) : isError ? (
                        <div className="py-10 text-center text-fireRed">
                            {error?.message ?? "Gagal memuat jawaban."}
                        </div>
                    ) : jawabanList.length === 0 ? (
                        <div className="py-10 text-center text-darkBrown/70">
                            Belum ada jawaban yang disubmit untuk modul ini.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {jawabanList.map((item, index) => (
                                <article
                                    key={`${item.soal_id}-${index}`}
                                    className="rounded-lg border border-forestGreen/30 bg-softIvory p-4 shadow-sm"
                                >
                                    <h4 className="font-semibold text-darkBrown">
                                        {index + 1}. {item.soal_text ?? "Soal tidak tersedia"}
                                    </h4>
                                    <div className="mt-2 rounded-md bg-white p-3 text-darkBrown">
                                        {item.jawaban && item.jawaban !== "-" ? (
                                            <pre className="whitespace-pre-wrap break-words text-sm">
                                                {item.jawaban}
                                            </pre>
                                        ) : (
                                            <span className="text-darkBrown/60">Belum ada jawaban</span>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-right">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-md bg-deepForestGreen px-5 py-2 text-sm font-semibold text-white transition hover:bg-darkGreen"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

