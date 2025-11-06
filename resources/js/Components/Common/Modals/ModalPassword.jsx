import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import failedIcon from "../../../../assets/modal/failedSymbol.png";
import { submit } from "@/lib/http";
import { ModalOverlay } from "@/Components/Common/ModalPortal";

export default function ModalPassword({ isOpen, onClose, updatePasswordAction, userType = "praktikan" }) {
    const [values, setValues] = useState({
        current_password: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const { auth, errors, flash } = usePage().props;
    const user = auth?.[userType];
    
    useEffect(() => {
        if (flash?.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
            }, 1500);
        }
        
        if (errors && Object.keys(errors).length > 0) {
            const errorMessages = Object.values(errors).flat().join('\n');
            setErrorMessage(errorMessages);
        }
    }, [flash, errors, onClose]);

    useEffect(() => {
        if (user) {
            setValues({
                current_password: "",
                password: "",
            });
        }
    }, [user]);

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");
    
        if (!values.current_password || !values.password) {
            setErrorMessage("Semua kolom harus diisi.");
            setIsLoading(false);
            return;
        }
        
        if (values.password.length < 8) {
            setErrorMessage("Password baru harus minimal 8 karakter.");
            setIsLoading(false);
            return;
        }
        
        try {
            const actionDescriptor = updatePasswordAction?.(values);

            if (actionDescriptor && typeof actionDescriptor.then === "function") {
                actionDescriptor
                    .then(() => setIsLoading(false))
                    .catch((error) => {
                        console.error("Password update failed:", error);
                        setErrorMessage("Terjadi kesalahan saat mengganti password. Silakan coba lagi.");
                        setIsLoading(false);
                    });
                return;
            }

            if (actionDescriptor) {
                submit(actionDescriptor, {
                    data: values,
                    preserveScroll: true,
                    onFinish: () => {
                        setIsLoading(false);
                    }
                });
                return;
            }

            setErrorMessage("Tidak dapat mengganti password saat ini. Silakan coba lagi nanti.");
            setIsLoading(false);
        } catch (error) {
            console.error("Password update failed:", error);
            setErrorMessage("Terjadi kesalahan saat mengganti password. Silakan coba lagi.");
            setIsLoading(false);
        }
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

    if (!isOpen) return null;

    return (
        <form onSubmit={handleSave}>
            <ModalOverlay onClose={onClose}>
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
                        <p className="mt-1 text-xs text-depth-secondary">Password minimal 8 karakter</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>
            </ModalOverlay>

            {/* Error Modal */}
            {errorMessage && (
                <ModalOverlay onClose={closeErrorModal}>
                    <div className="depth-modal-container max-w-xl">
                        <div className="depth-modal-header">
                            <h2 className="depth-modal-title text-red-500">Error</h2>
                            <button
                                type="button"
                                onClick={closeErrorModal}
                                className="depth-modal-close"
                            >
                                <img className="h-6 w-6" src={closeIcon} alt="closeIcon" />
                            </button>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <img className="mb-4 h-16 w-16" src={failedIcon} alt="failedIcon" />
                            <p className="whitespace-pre-wrap text-center text-sm text-depth-secondary">
                                {errorMessage}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={closeErrorModal}
                            className="mt-6 w-full rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                        >
                            Tutup
                        </button>
                    </div>
                </ModalOverlay>
            )}

            {/* Success Modal */}
            {isSuccess && (
                <ModalOverlay onClose={closeSuccessModal}>
                    <div className="depth-modal-container max-w-md">
                        <div className="flex flex-col items-center py-8">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                                <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-bold text-depth-primary">Berhasil!</h3>
                            <p className="text-center text-sm text-depth-secondary">
                                Password berhasil diubah
                            </p>
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </form>
    );
}
