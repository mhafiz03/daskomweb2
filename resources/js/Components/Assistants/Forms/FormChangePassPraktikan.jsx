import { useState } from "react";  
import { router } from '@inertiajs/react';

export default function FormChangePassPraktikan() {
    const [values, setValues] = useState({
        nim: '',
        password: '', // Changed from newPassword to match backend
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const newErrors = {};
        if(!values.nim) newErrors.nim = 'NIM tidak boleh kosong';
        if(!values.password) newErrors.password = 'Password baru tidak boleh kosong';
        
        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setModalMessage('Harap isi semua kolom, jangan tertinggal!');
            setIsSuccess(false);
            setIsModalOpen(true);
            setIsLoading(false);
            return;
        }

        //405 mulu.. mamam nih manggil router patch langsung
        router.patch(route('set-password'), values, {
            onSuccess: () => {
                setModalMessage('Password Praktikan telah berhasil diganti.');
                setIsSuccess(true);
                setIsModalOpen(true);
                
                setValues({
                    nim: '',
                    password: '',
                });
                
                setTimeout(() => {
                    setIsModalOpen(false);  
                }, 3000);
            },
            onError: (errors) => {
                setErrors(errors);
                setModalMessage(Object.values(errors).flat().join('\n'));
                setIsSuccess(false);
                setIsModalOpen(true);
            },
            onFinish: () => {
                setIsLoading(false);
            }
        });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setValues((prevValues) => ({
            ...prevValues,
            [id]: value,
        }));

        if (errors[id]) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [id]: '',
            }));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bg-softIvory p-6 rounded shadow-lg shadow-deepForestGreen w-full max-w-3xl">
            <h2 className="text-xl font-bold mb-6 text-start text-black">Ganti Password Praktikan</h2>
            <form onSubmit={handleSave} className="flex items-center gap-4">
                {/* Input NIM */}
                <div className="flex-1">
                    <label htmlFor="nim" className="block text-sm font-medium mb-2">
                        NIM
                    </label>
                    <input
                        type="number"
                        id="nim"
                        value={values.nim}
                        onChange={handleChange}
                        placeholder="1101223083"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
                </div>
                {/* Input Password Baru */}
                <div className="flex-1">
                    <label htmlFor="password" className="block text-sm font-medium mb-2">
                        Password Baru
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        placeholder="Jangan Lupa ya"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                {/* Tombol Simpan */}
                <div className="flex-shrink-0 mt-6">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="h-10 px-6 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen transition duration-200"
                    >
                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96">
                        <h3 className="text-2xl font-bold mb-4 text-center">
                            {isSuccess ? 'Berhasil Disimpan' : 'Gagal Disimpan'}
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