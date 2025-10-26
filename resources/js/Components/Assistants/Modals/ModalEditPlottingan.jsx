import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { send } from "@/lib/wayfinder";
import { update as updateKelas } from "@/actions/App/Http/Controllers/API/KelasController";

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
                        <input
                            id="hari"
                            type="text"
                            value={formData.hari}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        />
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
