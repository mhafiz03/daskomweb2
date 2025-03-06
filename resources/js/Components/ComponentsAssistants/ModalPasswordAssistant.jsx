import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import closeIcon from "../../../assets/modal/iconClose.svg";
import failedIcon from "../../../assets/modal/failedSymbol.png";

export default function ModalPasswordAssistant({ onClose }) {
    const [values, setValues] = useState({
        current_password: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const { auth, errors, flash } = usePage().props;
    const asisten = auth?.asisten;
    
    // Check for flash messages or errors from Inertia response
    useEffect(() => {
        if (flash?.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 1500);
        }
        
        if (errors && Object.keys(errors).length > 0) {
            // Convert errors object to string message
            const errorMessages = Object.values(errors).flat().join('\n');
            setErrorMessage(errorMessages);
        }
    }, [flash, errors]);

    useEffect(() => {
        if (asisten) {
            setValues({
                current_password: "",
                password: "",
            });
        }
    }, [asisten]);

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
    
        // Client-side validation
        if (!values.current_password || !values.password) {
            setErrorMessage("Semua kolom harus diisi.");
            setIsLoading(false);
            return;
        }
        
        // Check if new password meets minimum length
        if (values.password.length < 8) {
            setErrorMessage("Password baru harus minimal 8 karakter.");
            setIsLoading(false);
            return;
        }
        
        // Send request to server - using patch as per the route definition
        router.patch("/api-v1/asisten/password", values, {
            preserveScroll: true,
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
    };

    const closeErrorModal = () => {
        setErrorMessage("");
    };

    const closeSuccessModal = () => {
        setIsSuccess(false);
        onClose();
    };

    return (
        <form onSubmit={handleSave}>
            {/* Modal utama untuk ganti password */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-softGray p-8 rounded shadow-lg w-[30%] relative">
                    {/* Tombol X untuk tutup */}
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>

                    <h2 className="text-3xl font-bold text-center mt-4 mb-9">Ganti Password</h2>

                    {/* Form untuk mengganti password */}
                    <div className="mb-4">
                        <input
                            id="current_password"
                            type="password"
                            placeholder="Password Saat Ini"
                            value={values.current_password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            id="password"
                            type="password"
                            placeholder="Password Baru"
                            value={values.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                        <p className="text-xs text-gray-500 mt-1">Password minimal 8 karakter</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-2 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen disabled:bg-gray-400"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-softGray p-8 rounded shadow-lg w-[30%] relative flex flex-col items-center">
                        {/* Tombol X untuk tutup */}
                        <button
                            type="button"
                            onClick={closeErrorModal}
                            className="absolute top-2 right-2 flex justify-center items-center"
                        >
                            <img className="w-9" src={closeIcon} alt="closeIcon" />
                        </button>

                        {/* Ikon error */}
                        <img className="w-28 mb-4" src={failedIcon} alt="failedIcon" />

                        {/* Pesan error */}
                        <p className="text-center mb-6 text-xl font-semibold text-darkGreen">{errorMessage}</p>

                        {/* Tombol OK */}
                        <button
                            type="button"
                            onClick={closeErrorModal}
                            className="w-full p-2 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-softGray p-8 rounded shadow-lg w-[30%] relative flex flex-col items-center">
                        {/* Tombol X untuk tutup */}
                        <button
                            type="button"
                            onClick={closeSuccessModal}
                            className="absolute top-2 right-2 flex justify-center items-center"
                        >
                            <img className="w-9" src={closeIcon} alt="closeIcon" />
                        </button>

                        {/* Pesan sukses */}
                        <p className="text-center mt-4 text-xl font-semibold text-darkGreen">Password Anda telah berhasil diganti.</p>
                    </div>
                </div>
            )}
        </form>
    );
}