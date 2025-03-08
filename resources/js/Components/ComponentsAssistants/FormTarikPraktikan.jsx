import { useState, useEffect } from "react";
import axios from 'axios';

export default function FormTarikPraktikan() {
    const [nim, setNim] = useState('');
    const [module, setModule] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch modules on component mount
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

    const handleSubmit = async () => {
        if (!nim || !module) {
            setModalMessage('Harap isi semua kolom, jangan tertinggal!');
            setIsSuccess(false);
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api-v1/tarik-praktikan', {
                nim: nim,
                modul_id: module
            });

            if (response.data.success) {
                setModalMessage('Data praktikan berhasil ditarik');
                setIsSuccess(true);
                setNim('');
                setModule('');
            } else {
                setModalMessage(response.data.message || 'Gagal menarik data praktikan');
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Error assigning praktikan:', error);

            if (error.response) {
                if (error.response.status === 404) {
                    if (error.response.data.message.includes('No record found')) {
                        setModalMessage('Tidak ada data untuk praktikan dan modul ini. Praktikan mungkin belum terdaftar untuk modul ini.');
                    } else {
                        setModalMessage(error.response.data.message || 'Data tidak ditemukan');
                    }
                } else if (error.response.data.errors) {
                    const errorMessages = Object.values(error.response.data.errors).flat();
                    setModalMessage(errorMessages.join(', '));
                } else {
                    setModalMessage(error.response.data.message || 'Terjadi kesalahan');
                }
            } else {
                setModalMessage('Gagal terhubung ke server');
            }
            setIsSuccess(false);
        } finally {
            setLoading(false);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-softIvory p-6 rounded shadow-lg shadow-deepForestGreen w-[750px]">
            <h2 className="text-xl font-bold mb-6 text-start text-black">Tarik Praktikan</h2>
            <div className="flex items-center gap-4">
                {/* Input NIM */}
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
                {/* Dropdown Modul */}
                <div className="flex-1">
                    <label htmlFor="module" className="block text-sm font-medium mb-2">
                        Modul
                    </label>
                    <select
                        id="module"
                        value={module}
                        onChange={(e) => setModule(e.target.value)}
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
                {/* Tombol Tarik */}
                <div className="flex-shrink-0 mt-6">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="h-10 px-6 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen transition duration-200"
                    >
                        {loading ? 'Menark...' : 'Tarik'}
                    </button>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-[30%]">
                        <h3 className="text-2xl font-bold mb-4 text-center">
                            {isSuccess ? 'Berhasil Ditambahkan' : 'Gagal Ditambahkan'}
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
