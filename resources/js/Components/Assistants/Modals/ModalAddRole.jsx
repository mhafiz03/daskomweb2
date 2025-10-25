import { useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg"

export default function ButtonAddRole({ onClose, defaultChecked = ['asisten'] }) {
    const [roleName, setRoleName] = useState("");
    const [checkedPermissions, setCheckedPermissions] = useState(defaultChecked);
    const [errorMessage, setErrorMessage] = useState("");

    const rolePermissions = [
        { paket: "super", name: "Fitur Aslab (Software & Koordas)" },
        { paket: "aslab", name: "Fitur Aslab (Regular)" },
        { paket: "atc", name: "Fitur Asprak (ATC)" },
        { paket: "rdc", name: "Fitur Asprak (RDC)" },
        { paket: "asisten", name: "Fitur Asprak (Default)" },
    ];

    const toggleCheckedPermission = (paket) => {
        setCheckedPermissions((prev) =>
            prev.includes(paket)
                ? prev.filter((p) => p !== paket)
                : [...prev, paket]
        );
    };

    const handleSave = async () => {
        if (!roleName.trim()) {
            setErrorMessage("Nama Role tidak boleh kosong!");
            return;
        }
        if (!checkedPermissions.length) {
            setErrorMessage("Pilih minimal satu paket.");
            return;
        }
        try {
            router.post("/api-v1/roles", {
                name: roleName,
                paket: checkedPermissions, // Send as array
            }, {
                onSuccess: () => {
                    setShowSuccessModal(true);
                    toast.success("Role berhasil ditambahkan.");
                    setTimeout(() => {
                        onClose();
                    }, 1000);
                },
                onError: (error) => {
                    toast.error("Terjadi kesalahan. Coba lagi.");
                },
            });
        } catch (error) {
            toast.error("Terjadi kesalahan. Coba lagi.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Utama */}
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-darkGreen">Tambah Role</h2>
                    {/* Tombol X untuk tutup */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                </div>

                {/* Input Nama Role */}
                <div className="mb-4">
                    <label htmlFor="roleName" className="block text-black text-sm font-medium">
                        Nama Role
                    </label>
                    <input
                        id="roleName"
                        type="text"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        placeholder="ex: DDC"
                    />
                </div>

                {/* Daftar Kuasa Role (Checkbox) */}
                <div className="max-h-60 overflow-y-auto border-t border-gray-300 pt-4">
                    {rolePermissions.map((permission) => (
                        <div key={permission.paket} className="flex items-center gap-2 p-2 border rounded-md mb-2">
                            <input
                                type="checkbox"
                                id={`permission-${permission.paket}`}
                                className="w-4 h-4"
                                checked={checkedPermissions.includes(permission.paket)&& permission}
                                onChange={() => toggleCheckedPermission(permission.paket)}
                            />
                            <label htmlFor={`permission-${permission.paket}`} className="text-gray-700">
                                {permission.name}
                            </label>
                        </div>
                    ))}
                </div>

                 {/* Error Message */}
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}

                {/* Tombol Simpan & Batal */}
                <div className="mt-4 text-right">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300 mr-2"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                    >
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    );
}
