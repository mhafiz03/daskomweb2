import { useState } from "react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { send } from "@/lib/wayfinder";
import { store as storeKelas } from "@/actions/App/Http/Controllers/API/KelasController";
import toast from "react-hot-toast";

export default function ModalAddPlottingan({ onClose, fetchKelas }) {
    const [isSwitchOn, setIsSwitchOn] = useState(0); // 0 untuk false, 1 untuk true
    const queryClient = useQueryClient();

    const addKelasMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await send(storeKelas(), payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            if (typeof fetchKelas === "function") {
                fetchKelas();
            }
            toast.success(data.message);
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
                        <input
                            id="hari"
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Hari"
                            value={formData.hari}
                            onChange={handleInputChange}
                        />
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
