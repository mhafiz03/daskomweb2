import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import failedIcon from "../../../../assets/modal/failedSymbol.png";
import { submit } from "@/lib/wayfinder";
import { updatePassword as updateAssistantPassword } from "@/actions/App/Http/Controllers/API/AsistenController";

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
        submit(updateAssistantPassword(), {
            data: values,
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
            <div className="depth-modal-overlay">
                <div className="depth-modal-container max-w-xl">
                    <div className="depth-modal-header">
                        <h2 className="depth-modal-title">Ganti Password</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="depth-modal-close"
                        >
                            <img className="h-6 w-6" src={closeIcon} alt="closeIcon" />
                        </button>
                    </div>

                    {/* Form untuk mengganti password */}
                    <div className="mb-4">
                        <input
                            id="current_password"
                            type="password"
                            placeholder="Password Saat Ini"
                            value={values.current_password}
                            onChange={handleChange}
                            className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            id="password"
                            type="password"
                            placeholder="Password Baru"
                            value={values.password}
                            onChange={handleChange}
                            className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                        />
                        <p className="text-xs text-depth-secondary mt-1">Password minimal 8 karakter</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="depth-modal-overlay">
                    <div className="depth-modal-container max-w-xl">
                        <div className="depth-modal-header">
                            <h2 className="depth-modal-title">Error</h2>
                            <button
                                type="button"
                                onClick={closeErrorModal}
                                className="depth-modal-close"
                            >
                                <img className="h-6 w-6" src={closeIcon} alt="closeIcon" />
                            </button>
                        </div>

                        {/* Ikon error */}
                        <div className="flex flex-col items-center">
                            <img className="w-28 mb-4" src={failedIcon} alt="failedIcon" />

                            {/* Pesan error */}
                            <p className="text-center mb-6 text-lg font-semibold text-depth-primary">{errorMessage}</p>

                            {/* Tombol OK */}
                            <button
                                type="button"
                                onClick={closeErrorModal}
                                className="w-full rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="depth-modal-overlay">
                    <div className="depth-modal-container max-w-xl">
                        <div className="depth-modal-header">
                            <h2 className="depth-modal-title">Sukses</h2>
                            <button
                                type="button"
                                onClick={closeSuccessModal}
                                className="depth-modal-close"
                            >
                                <img className="h-6 w-6" src={closeIcon} alt="closeIcon" />
                            </button>
                        </div>

                        {/* Pesan sukses */}
                        <p className="text-center text-lg font-semibold text-depth-primary">
                            Password Anda telah berhasil diganti.
                        </p>
                    </div>
                </div>
            )}
        </form>
    );
}
