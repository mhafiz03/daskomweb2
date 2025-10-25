import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import ContentLihatTP from "./ContentLihatTP";

export default function FormLihatTp() {
    const [nim, setNim] = useState("");
    const [selectedModulId, setSelectedModulId] = useState("");
    const [error, setError] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [resultData, setResultData] = useState({
        jawabanData: [],
        praktikan: null,
        modul: null,
    });

    const {
        data: modules = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery({
        onError: (err) => {
            console.error("Error fetching modules:", err);
        },
    });

    const jawabanTpMutation = useMutation({
        mutationFn: async ({ nim: praktikanNim, modulId }) => {
            try {
                const { data } = await api.get(`/api-v1/jawaban-tp/${praktikanNim}/${modulId}`);
                if (!data?.success) {
                    throw new Error(data?.message ?? "Gagal menampilkan jawaban TP");
                }
                return data.data;
            } catch (err) {
                const message = err.response?.data?.message ?? err.message ?? "Gagal menampilkan jawaban TP";
                throw new Error(message);
            }
        },
        retry: false,
        onSuccess: (data) => {
            setResultData({
                jawabanData: data?.jawabanData ?? [],
                praktikan: data?.praktikan ?? null,
                modul: data?.modul ?? null,
            });
            setShowResults(true);
        },
        onError: (err) => {
            setError(err.message ?? "Gagal menampilkan jawaban TP");
        },
    });

    const handleNimChange = (e) => {
        setNim(e.target.value);
        setError("");
    };

    const handleModulChange = (e) => {
        setSelectedModulId(e.target.value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nim || !selectedModulId) {
            setError("NIM dan Modul harus diisi");
            return;
        }

        setError("");
        jawabanTpMutation.mutate({ nim, modulId: selectedModulId });
    };

    const handleBackToForm = () => {
        setShowResults(false);
        setNim("");
        setSelectedModulId("");
        setError("");
    };

    if (showResults) {
        return (
            <div>
                <ContentLihatTP
                    jawabanData={resultData.jawabanData}
                    praktikan={resultData.praktikan}
                    modul={resultData.modul}
                />
                <div className="container mx-auto p-4 text-center">
                    <button
                        onClick={handleBackToForm}
                        className="px-4 py-2 bg-deepForestGreen text-white rounded hover:bg-darkGreen"
                    >
                        Kembali ke Pencarian
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md border-2 border-deepForestGreen rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center text-deepForestGreen">Lihat Jawaban TP</h1>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nim" className="block text-sm font-medium text-gray-700 mb-1">
                                NIM Praktikan
                            </label>
                            <input
                                type="text"
                                id="nim"
                                value={nim}
                                onChange={handleNimChange}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                                placeholder="Masukkan NIM"
                            />
                        </div>

                        <div>
                            <label htmlFor="modul" className="block text-sm font-medium text-gray-700 mb-1">
                                Modul
                            </label>
                            <select
                                id="modul"
                                value={selectedModulId}
                                onChange={handleModulChange}
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
                    </div>

                    <button
                        type="submit"
                        disabled={jawabanTpMutation.isPending || modulesLoading}
                        className="mt-4 w-full p-2 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen disabled:bg-gray-400"
                    >
                        {jawabanTpMutation.isPending ? "Memuat..." : "Lihat Jawaban"}
                    </button>
                </form>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
