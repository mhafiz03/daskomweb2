export default function ModalConfirmDeleteRole({ onClose, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-softGray p-6 rounded-lg shadow-xl w-96 text-center relative">
                {/* Pesan Konfirmasi */}
                <h3 className="text-xl font-bold mt-2">
                    Yakin Ingin Menghapus Data Asisten?
                </h3>

                {/* Tombol */}
                <div className="mt-6 flex justify-center gap-4">
                    <button
                        onClick={onConfirm} // ✅ Sekarang tombol ini akan menjalankan handleConfirmDelete
                        className="text-md font-bold text-white bg-redredDark hover:bg-softRed rounded-md px-6 py-1"
                    >
                        Yakin
                    </button>
                    <button
                        onClick={onClose} // ✅ Hanya untuk menutup modal
                        className="text-md font-bold text-white bg-deepForestGreen hover:bg-softGreen rounded-md px-6 py-1"
                    >
                        Batal
                    </button>
                </div>
            </div>
        </div>
    );
}
