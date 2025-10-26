import { useMemo, useState } from "react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { send } from "@/lib/wayfinder";
import { store as storeKelas } from "@/actions/App/Http/Controllers/API/KelasController";
import toast from "react-hot-toast";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";
import { JADWAL_JAGA_QUERY_KEY } from "@/hooks/useJadwalJagaQuery";
import { store as storeJadwalJaga } from "@/actions/App/Http/Controllers/API/JadwalJagaController";

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Utama */}
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen">Tambah Jadwal</h2>
                    {/* Tombol X untuk tutup */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                </div>

                {/* Input Informasi Jadwal */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                        <label htmlFor="kelas" className="block text-black text-sm font-medium">
                            Kelas
                        </label>
                        <input
                            id="kelas"
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Kelas"
                            value={formData.kelas}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="hari" className="block text-black text-sm font-medium">
                            Hari
                        </label>
                        <select
                            id="hari"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
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
                    <div>
                        <label htmlFor="shift" className="block text-black text-sm font-medium">
                            Shift
                        </label>
                        <input
                            id="shift"
                            type="number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Shift"
                            value={formData.shift}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="totalGroup" className="block text-black text-sm font-medium">
                            Kelompok
                        </label>
                        <input
                            id="totalGroup"
                            type="number"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Kelompok"
                            value={formData.totalGroup}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Asisten Jaga */}
                <div className="mt-6 border border-darkBrown rounded-md p-4 bg-softGray">
                    <h3 className="text-lg font-semibold text-darkBrown mb-3">Asisten Jaga</h3>
                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
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
                            className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown uppercase"
                        />
                        <button
                            type="button"
                            onClick={handleAddPendingAsisten}
                            className="px-4 py-2 bg-deepForestGreen text-white rounded-md shadow hover:bg-darkGreen transition duration-300"
                        >
                            Tambah
                        </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Gunakan kode asisten (contoh: AST-01). Asisten akan ditambahkan setelah jadwal tersimpan.</p>

                    <div className="mt-3 max-h-40 overflow-y-auto">
                        {pendingAsistens.length > 0 ? (
                            <ul className="space-y-2">
                                {pendingAsistens.map((asisten) => (
                                    <li
                                        key={asisten.id}
                                        className="flex justify-between items-center border border-lightBrown rounded px-3 py-2 text-sm text-darkBrown bg-white"
                                    >
                                        <div>
                                            <p className="font-semibold">{asisten.kode}</p>
                                            <p className="text-xs text-gray-500">{asisten.nama}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePendingAsisten(asisten.id)}
                                            className="text-fireRed text-xs font-semibold hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-500">Belum ada asisten jaga yang ditambahkan.</p>
                        )}
                    </div>
                </div>

                {/* Tombol Simpan */}
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300 mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={addKelasMutation.isPending}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300 disabled:opacity-50"
                    >
                        {addKelasMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>

                {/* Switch On/Off */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">
                        English
                    </label>
                    <div
                        onClick={toggleSwitch}
                        className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isSwitchOn === 1 ? "bg-deepForestGreen" : "bg-fireRed"
                            }`}
                    >
                        <div
                            className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isSwitchOn === 1 ? "translate-x-5" : "translate-x-0"
                                }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
