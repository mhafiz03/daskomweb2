import { useMemo, useState } from "react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { send } from "@/lib/http";
import { store as storeKelas } from "@/lib/routes/kelas";
import toast from "react-hot-toast";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";
import { JADWAL_JAGA_QUERY_KEY } from "@/hooks/useJadwalJagaQuery";
import { store as storeJadwalJaga } from "@/lib/routes/jadwalJaga";
import ModalPortal from "@/Components/Common/ModalPortal";

export default function ModalAddPlottingan({ onClose, fetchKelas }) {
    const [isSwitchOn, setIsSwitchOn] = useState(0); // 0 untuk false, 1 untuk true
    const queryClient = useQueryClient();
    const [asistenInput, setAsistenInput] = useState("");
    const [pendingAsistens, setPendingAsistens] = useState([]);

    const { data: asistens = [] } = useAsistensQuery();

    const asistenMapByCode = useMemo(() => {
        const map = new Map();
        asistens.forEach((item) => {
            if (item?.kode) {
                map.set(item.kode.toUpperCase(), item);
            }
        });
        return map;
    }, [asistens]);

    const asistenMapById = useMemo(() => {
        const map = new Map();
        asistens.forEach((item) => {
            if (item?.id != null) {
                map.set(String(item.id), item);
            }
        });
        return map;
    }, [asistens]);

    const addKelasMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await send(storeKelas(), payload);
            return data;
        },
        onSuccess: async (data) => {
            const kelasBaru = data?.kelas;
            const kelasIdBaru = kelasBaru?.id;

            if (pendingAsistens.length > 0 && kelasIdBaru) {
                try {
                    await Promise.all(
                        pendingAsistens.map((asisten) =>
                            send(storeJadwalJaga(), {
                                kelas_id: kelasIdBaru,
                                asisten_id: asisten.id,
                            })
                        )
                    );
                    toast.success("Asisten jaga berhasil ditambahkan.");
                } catch (error) {
                    console.error("Gagal menambahkan asisten jaga:", error);
                    toast.error("Beberapa asisten jaga gagal ditambahkan.");
                }
            }

            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === JADWAL_JAGA_QUERY_KEY,
            });
            if (typeof fetchKelas === "function") {
                fetchKelas();
            }
            toast.success(data.message);
            setPendingAsistens([]);
            onClose();
        },
        onError: (err) => {
            const message = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Gagal menyimpan data kelas";
            toast.error(message);
        },
    });

    // State untuk menyimpan data input
    const [formData, setFormData] = useState({
        kelas: "",
        hari: "",
        shift: "",
        totalGroup: "",
        isEnglish: 0, // Default 0 (false)
    });

    // Handle perubahan input
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    // Handle toggle switch
    const toggleSwitch = () => {
        const newValue = isSwitchOn === 0 ? 1 : 0; // Toggle antara 0 dan 1
        setIsSwitchOn(newValue);
        setFormData({
            ...formData,
            isEnglish: newValue,
        });
    };

    // Handle submit data
    const handleSave = async () => {
        // Validasi input
        if (!formData.kelas || !formData.hari || !formData.shift || !formData.totalGroup) {
            toast.error("Harap isi semua field yang diperlukan.");
            return;
        }

        addKelasMutation.mutate(formData);
    };

    const handleAddPendingAsisten = () => {
        const trimmed = asistenInput.trim().toUpperCase();

        if (!trimmed) {
            toast.error("Masukkan kode asisten terlebih dahulu.");
            return;
        }

        const asisten =
            asistenMapByCode.get(trimmed) ??
            asistenMapById.get(trimmed) ??
            asistens.find((item) => String(item.id) === trimmed);

        if (!asisten) {
            toast.error("Asisten tidak ditemukan.");
            return;
        }

        const alreadyAdded = pendingAsistens.some((item) => item.id === asisten.id);

        if (alreadyAdded) {
            toast.error("Asisten sudah ada dalam daftar.");
            return;
        }

        setPendingAsistens((prev) => [...prev, asisten]);
        setAsistenInput("");
    };

    const handleRemovePendingAsisten = (id) => {
        setPendingAsistens((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <ModalPortal>
            <div className="depth-modal-overlay z-50">
                <div
                    className="depth-modal-container space-y-6"
                    style={{ "--depth-modal-max-width": "56rem" }}
                >
                    <div className="depth-modal-header">
                        <h2 className="depth-modal-title">Tambah Jadwal</h2>
                        <button onClick={onClose} type="button" className="depth-modal-close">
                            <img className="h-6 w-6" src={closeIcon} alt="Tutup" />
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <label htmlFor="kelas" className="text-sm font-semibold text-depth-secondary">
                                Kelas
                            </label>
                            <input
                                id="kelas"
                                type="text"
                                className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                placeholder="Kelas"
                                value={formData.kelas}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="hari" className="text-sm font-semibold text-depth-secondary">
                                Hari
                            </label>
                            <select
                                id="hari"
                                className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                value={formData.hari}
                                onChange={handleInputChange}
                            >
                                <option value="">- Pilih Hari -</option>
                                {[
                                    "SENIN",
                                    "SELASA",
                                    "RABU",
                                    "KAMIS",
                                    "JUMAT",
                                    "SABTU",
                                ].map((day) => (
                                    <option key={day} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="shift" className="text-sm font-semibold text-depth-secondary">
                                Shift
                            </label>
                            <input
                                id="shift"
                                type="number"
                                className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                placeholder="Shift"
                                value={formData.shift}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="totalGroup" className="text-sm font-semibold text-depth-secondary">
                                Kelompok
                            </label>
                            <input
                                id="totalGroup"
                                type="number"
                                className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                placeholder="Kelompok"
                                value={formData.totalGroup}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="rounded-depth-lg border border-depth bg-depth-interactive/40 p-4 shadow-depth-sm">
                        <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center">
                            <input
                                type="text"
                                value={asistenInput}
                                onChange={(e) => setAsistenInput(e.target.value.toUpperCase())}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddPendingAsisten();
                                    }
                                }}
                                placeholder="Masukkan kode asisten"
                                className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 uppercase md:w-1/2"
                            />
                            <button
                                type="button"
                                onClick={handleAddPendingAsisten}
                                className="rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                Tambah
                            </button>
                            <div className="flex items-center gap-2 md:ml-auto">
                                <span className="text-xs font-semibold text-depth-secondary">English</span>
                                <button
                                    type="button"
                                    onClick={toggleSwitch}
                                    className={`flex h-6 w-11 items-center rounded-depth-full border border-depth bg-depth-card p-1 transition ${isSwitchOn === 1 ? "text-white" : "text-depth-secondary"
                                        }`}
                                >
                                    <span
                                        className={`h-4 w-4 rounded-depth-full bg-depth-interactive shadow-depth-sm transition-transform ${isSwitchOn === 1 ? "translate-x-5 bg-[var(--depth-color-primary)]" : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-depth-secondary">
                            Gunakan kode asisten (contoh: AST-01). Asisten akan ditambahkan setelah jadwal tersimpan.
                        </p>

                        <div className="mt-4 max-h-48 overflow-y-auto">
                            {pendingAsistens.length > 0 ? (
                                <ul className="space-y-2">
                                    {pendingAsistens.map((asisten) => (
                                        <li
                                            key={asisten.id}
                                            className="flex items-center justify-between rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm"
                                        >
                                            <div>
                                                <p className="font-semibold">{asisten.kode}</p>
                                                <p className="text-xs text-depth-secondary">{asisten.nama}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePendingAsisten(asisten.id)}
                                                className="text-xs font-semibold text-red-400 hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-depth-secondary">Belum ada asisten jaga yang ditambahkan.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-depth-md border border-depth bg-depth-interactive px-5 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={addKelasMutation.isPending}
                            className="rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {addKelasMutation.isPending ? "Menyimpan..." : "Simpan"}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
