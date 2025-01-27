import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import closeIcon from "../../../assets/modal/iconClose.svg";
import failedIcon from "../../../assets/modal/failedSymbol.png";

export default function ModalPasswordAssistant({ onClose }) {
    const [values, setValues] = useState({
        password: "",
        confirmPassword: "",
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const { auth, errors } = usePage().props; // Fetch shared props from Inertia
    const asisten = auth?.asisten;

    useEffect(() => {
        if (asisten) {
            setValues({
                new_pass: "",
                confirmPassword: "",
            });
        }
    }, [asisten]);

    const handleSave = async (e) => {
        e.preventDefault();

        // Validasi input
        if (!values.new_pass || !values.confirmPassword) {
            setErrorMessage("Semua kolom harus diisi.");
            return;
        }
        if (values.new_pass !== values.confirmPassword) {
            setErrorMessage("Password tidak cocok.");
            return;
        }

        // Kirim permintaan ke server
        router.put("/api-v1/asisten", { password: values.new_pass }, {
            onSuccess: () => {
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    onClose();
                }, 3000);
            },
            onError: (errorResponse) => {
                console.error("Error response:", errorResponse);
                setErrorMessage("Gagal mengubah password. Silakan coba lagi.");
            },
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
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>

                    <h2 className="text-3xl font-bold text-center mt-4 mb-9">Ganti Password</h2>

                    {/* Form untuk mengganti password */}
                    <div className="mb-4">
                        <input
                            id="new_pass"
                            type="password"
                            placeholder="Password Baru"
                            value={values.new_pass}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="mb-4">
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Konfirmasi Password Baru"
                            value={values.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full p-2 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen"
                    >
                        Simpan
                    </button>
                </div>
            </div>

            {errorMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-softGray p-8 rounded shadow-lg w-[30%] relative flex flex-col items-center">
                        {/* Tombol X untuk tutup */}
                        <button
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
                            onClick={closeErrorModal}
                            className="w-full p-2 bg-deepForestGreen text-white font-semibold rounded hover:bg-darkGreen"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {isSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-softGray p-8 rounded shadow-lg w-[30%] relative flex flex-col items-center">
                        {/* Tombol X untuk tutup */}
                        <button
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
