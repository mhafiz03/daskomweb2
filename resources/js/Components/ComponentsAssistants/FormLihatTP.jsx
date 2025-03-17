import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";
import ContentLihatTP from "./ContentLihatTP"; // Import the ContentLihatTP component

export default function FormLihatTp() {
    const [nim, setNim] = useState("");
    const [selectedModulId, setSelectedModulId] = useState("");
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(true);
    
    // Add state to handle display of results
    const [showResults, setShowResults] = useState(false);
    const [resultData, setResultData] = useState({
        jawabanData: [],
        praktikan: null,
        modul: null
    });

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
            const response = await axios.get(`/api-v1/jawaban-tp/${nim}/${selectedModulId}`);
            console.log("Response dari backend:", response.data);

            if (response.data.success) {
                // Instead of navigating, store the data and show the results
                setResultData({
                    jawabanData: response.data.data.jawabanData,
                    praktikan: response.data.data.praktikan,
                    modul: response.data.data.modul
                });
                setShowResults(true);
            } else {
                setError(response.data.message || "Gagal menampilkan jawaban TP");
            }

        } catch (error) {
            console.error('Error fetching TP:', error);
            setError(error.response?.data?.message || "Gagal menampilkan jawaban TP");
        } finally {
            setLoading(false);
        }
    };

    // Function to go back to the form
    const handleBackToForm = () => {
        setShowResults(false);
        setNim("");
        setSelectedModulId("");
    };

    // If showing results, render ContentLihatTP component
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

    // Otherwise, render the form
    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-6 text-center text-deepForestGreen">Lihat Jawaban TP</h1>
                
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
                                    <option key={modul.id} value={modul.id}>
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