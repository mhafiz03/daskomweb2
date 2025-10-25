import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useModulesQuery } from "@/hooks/useModulesQuery";

export default function FormTarikPraktikan() {
    const [nim, setNim] = useState("");
    const [module, setModule] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        data: modules = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery({
        onError: (err) => {
            console.error("Error fetching modules:", err);
            setModalMessage("Gagal memuat daftar modul");
            setIsSuccess(false);
            setIsModalOpen(true);
        },
    });

    const tarikPraktikanMutation = useMutation({
        mutationFn: async ({ nim: praktikanNim, modulId }) => {
            const payload = { nim: praktikanNim, modul_id: modulId };

            try {
                const { data } = await api.post("/api-v1/tarik-praktikan", payload);
                if (!data?.success) {
                    throw new Error(data?.message ?? "Gagal menarik data praktikan");
                }
                return data;
            } catch (err) {
                if (err.response?.data) {
                    const responseMessage = err.response.data.message;
                    if (err.response.status === 404 && responseMessage?.includes("No record found")) {
                        throw new Error(
                            "Tidak ada data untuk praktikan dan modul ini. Praktikan mungkin belum terdaftar untuk modul ini."
                        );
                    }

                    if (err.response.data.errors) {
                        const errorMessages = Object.values(err.response.data.errors).flat();
                        throw new Error(errorMessages.join(", "));
                    }

                    throw new Error(responseMessage ?? "Terjadi kesalahan");
                }

                throw new Error("Gagal terhubung ke server");
            }
        },
        onSuccess: () => {
            setModalMessage("Data praktikan berhasil ditarik");
            setIsSuccess(true);
            setNim("");
            setModule("");
            setIsModalOpen(true);
        },
        onError: (err) => {
            setModalMessage(err.message ?? "Gagal menarik data praktikan");
            setIsSuccess(false);
            setIsModalOpen(true);
        },
    });

    const handleSubmit = () => {
        if (!nim || !module) {
            setModalMessage("Harap isi semua kolom, jangan tertinggal!");
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        tarikPraktikanMutation.mutate({ nim, modulId: module });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-softIvory p-6 rounded shadow-lg shadow-deepForestGreen w-[750px]">
            <h2 className="text-xl font-bold mb-6 text-start text-black">Tarik Praktikan</h2>
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <label htmlFor="nim" className="block text-sm font-medium mb-2">
                        NIM
                    </label>
                    <input
                        type="number"
                        id="nim"
                        value={nim}
                        onChange={(e) => setNim(e.target.value)}
                        placeholder="1101223083"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex-1">
                    <label htmlFor="module" className="block text-sm font-medium mb-2">
                        Modul
                    </label>
                    <select
                        id="module"
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={modulesLoading}
                    >
                        <option value="" disabled>
                            Pilih Modul
                        </option>
                        {modulesLoading && <option value="" disabled>Memuat modul...</option>}
                        {modulesError && (
                            <option value="" disabled>
                                {modulesQueryError?.message ?? "Gagal memuat modul"}
                            </option>
                        )}
                        {!modulesLoading && !modulesError &&
                            modules.map((modul) => (
                                <option key={modul.idM} value={modul.idM}>
                                    {modul.judul}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="flex-shrink-0 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={tarikPraktikanMutation.isPending || modulesLoading}
                        className="h-10 px-6 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen transition duration-200 disabled:bg-gray-400"
                    >
                        {tarikPraktikanMutation.isPending ? "Menarik..." : "Tarik"}
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-[30%]">
                        <h3 className="text-2xl font-bold mb-4 text-center">
                            {isSuccess ? "Berhasil Ditambahkan" : "Gagal Ditambahkan"}
                        </h3>
                        <p className="text-center text-md mt-6">{modalMessage}</p>
                        <div className="mt-6 text-center">
                            <button
                                onClick={closeModal}
                                className="px-4 py-1 bg-deepForestGreen text-white rounded hover:bg-darkGreen"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
