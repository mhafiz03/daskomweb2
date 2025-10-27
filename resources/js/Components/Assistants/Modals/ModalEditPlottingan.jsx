import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { send } from "@/lib/wayfinder";
import { update as updateKelas } from "@/actions/App/Http/Controllers/API/KelasController";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";
import { useJadwalJagaQuery, JADWAL_JAGA_QUERY_KEY } from "@/hooks/useJadwalJagaQuery";
import { store as storeJadwalJaga, destroy as destroyJadwalJaga } from "@/actions/App/Http/Controllers/API/JadwalJagaController";

export default function ModalEditPlotting({ onClose, kelas }) {
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        kelas: "",
        hari: "",
        shift: "",
        totalGroup: "",
    });
    const queryClient = useQueryClient();
    const [newAsistenCode, setNewAsistenCode] = useState("");

    const { data: asistens = [] } = useAsistensQuery();

    const asistenMap = useMemo(() => {
        const map = new Map();
        asistens.forEach((item) => {
            if (item?.id != null) {
                map.set(Number(item.id), item);
                map.set(String(item.id), item);
            }
            if (item?.kode) {
                map.set(item.kode.toUpperCase(), item);
            }
        });
        return map;
    }, [asistens]);

    const {
        data: jadwalData = [],
        isFetching: jadwalLoading,
        refetch: refetchJadwal,
    } = useJadwalJagaQuery(
        kelas?.id ? { kelas_id: kelas.id } : {},
        {
            enabled: Boolean(kelas?.id),
        }
    );

    const jadwalEntries = useMemo(() => {
        if (!kelas?.id) {
            return [];
        }

        const kelasId = Number(kelas.id);
        const kelasName = kelas?.kelas ? kelas.kelas.toString() : null;

        const target =
            jadwalData.find((item) => Number(item?.id ?? item?.kelas_id ?? item?.kelasId) === kelasId) ??
            (kelasName
                ? jadwalData.find((item) => (item?.kelas ?? "").toString() === kelasName)
                : undefined);

        if (!target) {
            return [];
        }

        if (Array.isArray(target?.jadwal_jagas)) {
            return target.jadwal_jagas;
        }

        if (Array.isArray(target?.asistens)) {
            return target.asistens;
        }

        return [];
    }, [jadwalData, kelas]);

    const handleAddAsistenToJadwal = async () => {
        const trimmed = newAsistenCode.trim().toUpperCase();

        if (!trimmed) {
            toast.error("Masukkan kode asisten terlebih dahulu.");
            return;
        }

        const numericKey = Number(trimmed);
        const asistenDetail =
            asistenMap.get(trimmed) ??
            (!Number.isNaN(numericKey) ? asistenMap.get(numericKey) : undefined);

        if (!asistenDetail) {
            toast.error("Asisten tidak ditemukan.");
            return;
        }

        try {
            await send(storeJadwalJaga(), {
                kelas_id: kelas.id,
                asisten_id: asistenDetail.id,
            });

            toast.success("Asisten jaga berhasil ditambahkan.");
            setNewAsistenCode("");
            await refetchJadwal();
            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === JADWAL_JAGA_QUERY_KEY,
            });
        } catch (error) {
            console.error("Gagal menambahkan asisten jaga:", error);
            const message =
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                "Gagal menambahkan asisten jaga.";
            toast.error(message);
        }
    };

    const handleRemoveAsisten = async (jadwalId) => {
        if (!jadwalId) {
            return;
        }

        try {
            await send(destroyJadwalJaga(jadwalId));
            toast.success("Asisten jaga berhasil dihapus.");
            await refetchJadwal();
            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            queryClient.invalidateQueries({
                predicate: ({ queryKey }) => Array.isArray(queryKey) && queryKey[0] === JADWAL_JAGA_QUERY_KEY,
            });
        } catch (error) {
            console.error("Gagal menghapus asisten jaga:", error);
            const message =
                error?.response?.data?.message ??
                error?.response?.data?.error ??
                "Gagal menghapus asisten jaga.";
            toast.error(message);
        }
    };

    const getErrorMessage = (error) => {
        const responseData = error?.response?.data;
        if (responseData) {
            const fieldMessages = Object.values(responseData.errors ?? {}).flat();
            if (fieldMessages.length > 0) {
                return fieldMessages[0];
            }
            if (typeof responseData.message === "string") {
                return responseData.message;
            }
        }

        return error?.message ?? "Gagal menyimpan data kelas. Silakan coba lagi.";
    };

    const updateKelasMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            const token = localStorage.getItem("token");
            const config = token
                ? { headers: { Authorization: `Bearer ${token}` } }
                : undefined;
            const { data } = await send(updateKelas(id), payload, config);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            toast.success("Jadwal berhasil diubah.");
            onClose();
        },
        onError: (err) => {
            console.error("Error updating data:", err);
            toast.error(getErrorMessage(err));
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    useEffect(() => {
        if (kelas) {
            setFormData({
                kelas: kelas.kelas || "",
                hari: kelas.hari || "",
                shift: kelas.shift || "",
                totalGroup: kelas.totalGroup || "",
            });
            setIsSwitchOn(kelas.isEnglish || false);
        }
    }, [kelas]);

    const handleSave = async () => {
        if (!formData.kelas || !formData.hari || !formData.shift || !formData.totalGroup) {
            toast.error("Harap isi semua field yang diperlukan.");
            return;
        }

        const dataToSend = {
            kelas: formData.kelas,
            hari: formData.hari,
            shift: parseInt(formData.shift, 10),
            totalGroup: parseInt(formData.totalGroup, 10),
            isEnglish: isSwitchOn ? 1 : 0,
        };

        setLoading(true);
        updateKelasMutation.mutate({ id: kelas.id, payload: dataToSend });
    };

    const toggleSwitch = () => {
        setIsSwitchOn(!isSwitchOn);
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const [leftColumnEntries, rightColumnEntries] = useMemo(() => {
        if (jadwalEntries.length === 0) {
            return [[], []];
        }

        const midpoint = Math.ceil(jadwalEntries.length / 2);

        return [
            jadwalEntries.slice(0, midpoint),
            jadwalEntries.slice(midpoint),
        ];
    }, [jadwalEntries]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen">Edit Jadwal</h2>
                    <button onClick={onClose} className="absolute top-2 right-2">
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label htmlFor="kelas" className="block text-black text-sm font-medium">
                            Kelas
                        </label>
                        <input
                            id="kelas"
                            type="text"
                            value={formData.kelas}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        />
                    </div>
                    <div>
                        <label htmlFor="hari" className="block text-black text-sm font-medium">
                            Hari
                        </label>
                        <select
                            id="hari"
                            value={formData.hari}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
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
                    <div>
                        <label htmlFor="shift" className="block text-black text-sm font-medium">
                            Shift
                        </label>
                        <input
                            id="shift"
                            type="number"
                            value={formData.shift}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        />
                    </div>
                    <div>
                        <label htmlFor="totalGroup" className="block text-black text-sm font-medium">
                            Kelompok
                        </label>
                        <input
                            id="totalGroup"
                            type="number"
                            value={formData.totalGroup}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        />
                    </div>
                </div>

                <div className="mt-6 border border-darkBrown rounded-md p-4 bg-softGray mb-6">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <input
                            type="text"
                            value={newAsistenCode}
                            onChange={(e) => setNewAsistenCode(e.target.value.toUpperCase())}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddAsistenToJadwal();
                                }
                            }}
                            placeholder="asisten jaga"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown uppercase"
                        />
                        <button
                            type="button"
                            onClick={handleAddAsistenToJadwal}
                            className="px-4 py-2 bg-deepForestGreen text-white rounded-md shadow hover:bg-darkGreen transition duration-300"
                        >
                            Tambah
                        </button>
                    </div>
                    <div className="mt-3 max-h-40 overflow-y-auto">
                        {jadwalLoading ? (
                            <p className="text-sm text-gray-500">Memuat daftar asisten jaga...</p>
                        ) : jadwalEntries.length > 0 ? (
                            <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                                {[leftColumnEntries, rightColumnEntries].map((columnEntries, columnIndex) => (
                                    <ul key={columnIndex} className="space-y-1">
                                        {columnEntries.map((entry, idx) => {
                                            const globalIndex = columnIndex === 0 ? idx : leftColumnEntries.length + idx;
                                            const detail =
                                                entry?.asisten ??
                                                asistenMap.get(Number(entry?.asisten_id)) ??
                                                null;
                                            const kode = detail?.kode ?? entry?.kode ?? `AST-${globalIndex + 1}`;
                                            const jadwalId = entry?.id ?? entry?.jadwal_id ?? null;
                                            return (
                                                <li
                                                    key={jadwalId ?? `${kode}-${columnIndex}-${idx}`}
                                                    className="flex items-center justify-between rounded border border-lightBrown bg-white px-3 py-2 text-sm text-darkBrown"
                                                >
                                                    <div>
                                                        <p className="font-semibold">{kode}</p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveAsisten(jadwalId)}
                                                        className="text-xs font-semibold text-fireRed hover:underline"
                                                        disabled={!jadwalId}
                                                    >
                                                        Hapus
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">Belum ada asisten jaga untuk kelas ini.</p>
                        )}
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        English
                    </label>
                    <div
                        onClick={toggleSwitch}
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isSwitchOn ? "bg-deepForestGreen" : "bg-fireRed"}`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isSwitchOn ? "translate-x-5" : "translate-x-0"}`}
                        />
                    </div>
                </div>

                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300 mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
