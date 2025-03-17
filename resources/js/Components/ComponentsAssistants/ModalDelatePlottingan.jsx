export default function ModalDeletePlottingan({ onClose, message, isError, onConfirm }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-softGray p-6 rounded-lg shadow-xl w-96 text-center relative">
                <h3 className={`text-xl font-bold ${isError ? 'text-fireRed' : 'text-black'} mt-2`}>
                    {message || "Apakah Anda yakin ingin menghapus data ini?"}
                </h3>
                <div className="mt-6 flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="text-md font-bold text-white bg-fireRed hover:bg-softRed rounded-md px-6 py-1"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
