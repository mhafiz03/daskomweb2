export default function ModalConfirmDeleteRole({ onClose, onConfirm }) {
    return (
        <div className="depth-modal-overlay">
            <div className="depth-modal-container max-w-md text-center">
                <div className="depth-modal-header justify-center">
                    <h3 className="depth-modal-title text-center">Yakin Ingin Menghapus Data Asisten?</h3>
                </div>

                <p className="text-sm text-depth-secondary">
                    Tindakan ini tidak dapat dibatalkan. Pastikan kamu sudah memilih asisten yang benar.
                </p>

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        onClick={onConfirm}
                        type="button"
                        className="rounded-depth-md border border-red-500/60 bg-red-500/15 px-5 py-2 text-sm font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        Yakin
                    </button>
                    <button
                        onClick={onClose}
                        type="button"
                        className="rounded-depth-md border border-depth bg-depth-interactive px-5 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}
