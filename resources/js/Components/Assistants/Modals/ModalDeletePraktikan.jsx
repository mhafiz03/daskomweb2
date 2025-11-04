export default function ModalDeletePraktikan({ praktikan, onClose, onConfirm, isProcessing = false }) {
    const name = praktikan?.nama ?? "praktikan ini";
    return (
        <div className="depth-modal-overlay">
            <div className="depth-modal-container max-w-md text-center">
                <div className="depth-modal-header justify-center">
                    <h3 className="depth-modal-title text-center">Hapus Praktikan</h3>
                </div>

                <p className="text-sm text-depth-secondary">
                    Yakin ingin menghapus <span className="font-semibold text-depth-primary">{name}</span>? Tindakan ini
                    tidak dapat dibatalkan dan akan menghapus akses praktikan tersebut ke sistem.
                </p>

                <div className="mt-6 flex justify-center gap-3">
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        className="rounded-depth-md border border-red-500/60 bg-red-500/15 px-5 py-2 text-sm font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isProcessing ? "Menghapus..." : "Hapus"}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="rounded-depth-md border border-depth bg-depth-interactive px-5 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}
