import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";

export default function JawabanTPS() {
    const [nim, setNim] = useState("");
    const [selectedModulId, setSelectedModulId] = useState("");
    const [modules, setModules] = useState([]);
    const [jawaban, setJawaban] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Fetch modules for dropdown
    useEffect(() => {
        const fetchModules = async () => {
            try {
                const response = await axios.get('/api-v1/modules');
                setModules(response.data);
            } catch (err) {
                setError("Gagal memuat data modul");
                console.error(err);
            }
        };

        fetchModules();
    }, []);

    const handleNimChange = (e) => {
        setNim(e.target.value);
        // Reset previous results when NIM changes
        setJawaban([]);
        setSuccessMessage("");
        setError("");
    };

    const handleModulChange = (e) => {
        setSelectedModulId(e.target.value);
        // Reset previous results when module changes
        setJawaban([]);
        setSuccessMessage("");
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
        
        // Navigate to the jawaban page using the specified route pattern
        router.visit(`/jawaban-tp/praktikan/${nim}/modul/${selectedModulId}`);
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
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            >
                                <option value="">Pilih Modul</option>
                                {modules.map((modul) => (
                                    <option key={modul.id} value={modul.id}>
                                        {modul.name}
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

// This component will show the jawaban results
export function JawabanTPSResult() {
    const { jawaban, modul, praktikan, errors } = usePage().props;
    
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
                
                {errors && Object.keys(errors).length > 0 && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {Object.values(errors).flat().join(', ')}
                    </div>
                )}
                
                {praktikan && modul && (
                    <div className="bg-gray-50 p-4 rounded mb-6">
                        <p className="font-medium">Praktikan: {praktikan.nim}</p>
                        <p className="font-medium">Modul: {modul.name}</p>
                    </div>
                )}
                
                {/* Results Table */}
                {jawaban && jawaban.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border-b text-left">No</th>
                                    <th className="py-2 px-4 border-b text-left">Soal</th>
                                    <th className="py-2 px-4 border-b text-left">Jawaban</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jawaban.map((item, index) => (
                                    <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : ""}>
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">Soal {item.soal_id}</td>
                                        <td className="py-2 px-4 border-b">{item.jawaban}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-600">Tidak ada jawaban untuk kriteria yang dipilih</p>
                    </div>
                )}
            </div>
        </div>
    );
}