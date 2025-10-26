import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ModalJawabanTP from "./ModalJawabanTP";
import { submit } from "@/lib/wayfinder";
import {
    store as storeNilai,
    update as updateNilai,
} from "@/actions/App/Http/Controllers/API/NilaiController";

const scoresSchema = [
    { key: "tp", label: "TP" },
    { key: "ta", label: "TA" },
    { key: "d1", label: "D1" },
    { key: "d2", label: "D2" },
    { key: "d3", label: "D3" },
    { key: "d4", label: "D4" },
    { key: "l1", label: "L1" },
    { key: "l2", label: "L2" },
];

const clampScore = (value) => {
    const parsed = Number(value);

    if (Number.isNaN(parsed)) {
        return 0;
    }

    return Math.min(Math.max(parsed, 0), 100);
};

export default function ModalInputNilai({ onClose, assignment, asistenId, onSaved }) {
    const [scores, setScores] = useState({
        tp: 0,
        ta: 0,
        d1: 0,
        d2: 0,
        d3: 0,
        d4: 0,
        l1: 0,
        l2: 0,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isJawabanOpen, setIsJawabanOpen] = useState(false);

    const nilaiSebelumnya = assignment?.nilai ?? null;
    const praktikan = assignment?.praktikan ?? null;
    const modul = assignment?.modul ?? null;
    const kelas = praktikan?.kelas ?? null;

    useEffect(() => {
        if (nilaiSebelumnya) {
            setScores({
                tp: clampScore(nilaiSebelumnya.tp),
                ta: clampScore(nilaiSebelumnya.ta),
                d1: clampScore(nilaiSebelumnya.d1),
                d2: clampScore(nilaiSebelumnya.d2),
                d3: clampScore(nilaiSebelumnya.d3),
                d4: clampScore(nilaiSebelumnya.d4),
                l1: clampScore(nilaiSebelumnya.l1),
                l2: clampScore(nilaiSebelumnya.l2),
            });
        } else {
            setScores({
                tp: 0,
                ta: 0,
                d1: 0,
                d2: 0,
                d3: 0,
                d4: 0,
                l1: 0,
                l2: 0,
            });
        }
    }, [nilaiSebelumnya]);

    const average = useMemo(() => {
        const total = scoresSchema.reduce((sum, current) => sum + clampScore(scores[current.key] ?? 0), 0);
        return Number((total / scoresSchema.length).toFixed(2));
    }, [scores]);

    const handleScoreChange = (key) => (event) => {
        const value = clampScore(event.target.value);
        setScores((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        if (!asistenId) {
            toast.error("Data asisten tidak ditemukan. Silakan muat ulang halaman.");
            return;
        }

        if (!praktikan?.id || !modul?.id || !kelas?.id) {
            toast.error("Data praktikan tidak lengkap untuk menyimpan nilai.");
            return;
        }

        setIsSaving(true);

        const payload = {
            ...scores,
            modul_id: modul.id,
            asisten_id: asistenId,
            kelas_id: kelas.id,
            praktikan_id: praktikan.id,
        };

        const action = nilaiSebelumnya?.id ? updateNilai(nilaiSebelumnya.id) : storeNilai();

        submit(action, {
            data: payload,
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Nilai berhasil disimpan 🎉");
                onSaved?.();
            },
            onError: (error) => {
                const responseMessage = error?.response?.data?.message;
                toast.error(responseMessage ?? "Terjadi kesalahan saat menyimpan nilai.");
            },
            onFinish: () => {
                setIsSaving(false);
            },
        });
    };

    return (
        <div>
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-800/60 px-4">
                <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
                    <header className="mb-6 text-center">
                        <h2 className="text-3xl font-bold text-deepForestGreen">
                            {nilaiSebelumnya ? "Perbarui Nilai" : "Input Nilai"}
                        </h2>
                        <p className="mt-2 text-sm text-darkBrown/70">
                            {praktikan?.nama ?? "Praktikan"} ({praktikan?.nim ?? "-"}) · {modul?.judul ?? "Modul tidak dikenal"}
                        </p>
                    </header>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {scoresSchema.map(({ key, label }) => (
                                <div key={key}>
                                    <label className="mb-2 block text-sm font-semibold text-darkBrown">{label}</label>
                                    <input
                                        type="number"
                                        inputMode="decimal"
                                        min={0}
                                        max={100}
                                        value={scores[key]}
                                        onChange={handleScoreChange(key)}
                                        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-darkGreen focus:outline-none focus:ring-1 focus:ring-darkGreen"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-darkBrown">Rata-rata</label>
                                <input
                                    type="number"
                                    readOnly
                                    value={average}
                                    className="w-full cursor-not-allowed rounded-md border border-gray-300 bg-gray-100 p-2 text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold text-darkBrown">Catatan / Feedback Praktikan</label>
                            <textarea
                                value={assignment?.pesan ?? "Belum ada feedback"}
                                readOnly
                                rows={3}
                                className="w-full resize-none rounded-md border border-gray-300 bg-gray-100 p-3 text-sm text-darkBrown/80"
                            />
                        </div>
                    </div>

                    <footer className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={() => setIsJawabanOpen(true)}
                            disabled={!praktikan?.nim || !modul?.id}
                            className="inline-flex items-center justify-center rounded-md bg-darkBrown px-4 py-2 text-sm font-semibold text-white transition hover:bg-darkBrown/90 disabled:cursor-not-allowed disabled:bg-gray-400"
                        >
                            Lihat Jawaban TP
                        </button>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-md border border-fireRed px-5 py-2 text-sm font-semibold text-fireRed transition hover:bg-fireRed hover:text-white"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSaving}
                                className="inline-flex items-center justify-center rounded-md bg-deepForestGreen px-5 py-2 text-sm font-semibold text-white transition hover:bg-darkGreen disabled:cursor-not-allowed disabled:bg-darkGreen/60"
                            >
                                {isSaving ? "Menyimpan..." : "Simpan Nilai"}
                            </button>
                        </div>
                    </footer>
                </div>
            </div>

            {isJawabanOpen && (
                <ModalJawabanTP
                    onClose={() => setIsJawabanOpen(false)}
                    nim={praktikan?.nim}
                    modulId={modul?.id}
                    assignment={assignment}
                />
            )}
        </div>
    );
}

