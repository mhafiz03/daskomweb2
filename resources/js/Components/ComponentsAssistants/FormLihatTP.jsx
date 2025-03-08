import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";

export default function FormLihatTp() {
    const [nim, setNim] = useState("");
    const [selectedModulId, setSelectedModulId] = useState("");
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(true);

    // Fetch modules for dropdown
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await axios.get('/api-v1/modul');
                if (response.data.success) {
                    setModules(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching modules:', error);
                setModalMessage('Gagal memuat daftar modul');
                setIsSuccess(false);
                setIsModalOpen(true);
            }
        };

        fetchModules();
    }, []);

    const handleNimChange = (e) => {
        setNim(e.target.value);
        // Reset previous results when NIM changes
        setError("");
    };

    const handleModulChange = (e) => {
        setSelectedModulId(e.target.value);
        // Reset previous results when module changes
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!nim || !selectedModulId) {
            setError("NIM dan Modul harus diisi");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await axios.get(`/api-v1/tp/${nim}/${selectedModulId}`);
            if (response.data.success) {
                router.visit(`/jawaban-tp/${nim}/${selectedModulId}`);
            } else {
                setError(response.data.message || "Gagal menampilkan jawaban TPS");
            }
        } catch (error) {
            console.error('Error fetching TPS:', error);
            setError("Gagal menampilkan jawaban TPS");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center text-deepForestGreen">Lihat Jawaban TPS</h1>
                
                {/* Search Form */}
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
                            >
                                <option value="" disabled>
                                    Pilih Modul
                                </option>
                                {modules.map((modul) => (
                                    <option key={modul.idM} value={modul.idM}>
                                        {modul.judul}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full p-2 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen disabled:bg-gray-400"
                    >
                        {loading ? "Memuat..." : "Lihat Jawaban"}
                    </button>
                </form>
                
                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}

// JawabanTPSResult component
export function JawabanTPSResult() {
    const { params } = usePage().props;
    const [combinedData, setCombinedData] = useState([]);
    const [modul, setModul] = useState(null);
    const [praktikan, setPraktikan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch TPS data similar to fetchModules
    useEffect(() => {
        const fetchTPSData = async () => {
            try {
                // Extract nim and modulId from the URL params
                const nim = params?.nim;
                const modulId = params?.modulId;
                
                if (!nim || !modulId) {
                    setError("Parameter NIM atau Modul tidak ditemukan");
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get(`/api-v1/tp/${nim}/${modulId}`);
                if (response.data.success) {
                    setCombinedData(response.data.data.jawabanData || []);
                    setModul(response.data.data.modul);
                    setPraktikan(response.data.data.praktikan);
                } else {
                    setError(response.data.message || "Gagal memuat data jawaban TPS");
                }
            } catch (error) {
                console.error('Error fetching TPS data:', error);
                setError("Gagal memuat data jawaban TPS");
            } finally {
                setLoading(false);
            }
        };

        fetchTPSData();
    }, [params]);
    
    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-deepForestGreen">Jawaban TPS</h1>
                    <button 
                        onClick={() => router.visit('/jawaban-tp')}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
                    >
                        Kembali
                    </button>
                </div>
                
                {/* Error message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                
                {/* Loading indicator */}
                {loading ? (
                    <div className="flex justify-center py-8">
                        <p className="text-gray-600">Memuat data jawaban...</p>
                    </div>
                ) : (
                    <>
                        {praktikan && modul && (
                            <div className="bg-gray-50 p-4 rounded mb-6">
                                <p className="font-medium">Praktikan: {praktikan.nim}</p>
                                <p className="font-medium">Modul: {modul.judul}</p>
                            </div>
                        )}
                        
                        {/* Results Display */}
                        {combinedData && combinedData.length > 0 ? (
                            <div className="space-y-6">
                                {combinedData.map((item, index) => (
                                    <div key={item.soal_id} className={`p-4 rounded ${index % 2 === 0 ? "bg-gray-50" : "bg-white border border-gray-200"}`}>
                                        <div className="mb-3">
                                            <h3 className="font-semibold text-lg">Soal {index + 1}</h3>
                                            <p className="text-gray-800 whitespace-pre-line">{item.soal_text}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Jawaban</h3>
                                            <p className="bg-blue-50 p-3 rounded border border-blue-100 whitespace-pre-line">{item.jawaban}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-600">Tidak ada jawaban untuk kriteria yang dipilih</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}