import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { submit } from "@/lib/http";
import { destroy as logoutAsisten } from "@/lib/routes/auth/loginAsisten";

export default function ModalLogout({ onClose, onConfirm }) {
    const handleConfirm = () => {
        if (onConfirm) {
            submit(logoutAsisten(), {
                data: {},
                onSuccess: () => {
                    // Redirect the user to the login page after a successful logout
                    window.location.href = '/';
                },
                onError: (error) => {
                    // Handle any errors during logout
                    console.error('Logout failed:', error);
                    toast.error('Logout gagal. Silakan coba lagi.');
                },
            });
        }
    };

    return (
        <div className="depth-modal-overlay">
            <div className="depth-modal-container max-w-md">
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Apakah Kamu Yakin?</h2>
                    <button
                        onClick={onClose}
                        type="button"
                        className="depth-modal-close"
                    >
                        <img className="h-6 w-6" src={closeIcon} alt="Close Icon" />
                    </button>
                </div>

                <p className="text-center text-depth-secondary mb-6">
                    Anda akan keluar dari sistem. Pastikan semua perubahan telah disimpan.
                </p>

                {/* Yes and No Buttons */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-depth-md border border-depth bg-depth-interactive px-6 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        Tidak
                    </button>
                    <button
                        onClick={handleConfirm}
                        type="button"
                        className="rounded-depth-md border border-red-500/60 bg-red-500/15 px-6 py-2 text-sm font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        Ya, Keluar
                    </button>
                </div>
            </div>
        </div>
    );
}
