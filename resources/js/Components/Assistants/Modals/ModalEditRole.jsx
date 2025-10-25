import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { useRolesQuery } from "@/hooks/useRolesQuery";

export default function ModalEditRole({ onClose, asistenId }) {
    const [selectedRole, setSelectedRole] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const {
        data: roles = [],
        isLoading: rolesLoading,
        isError: rolesError,
        error: rolesQueryError,
    } = useRolesQuery({
        onError: (err) => {
            toast.error(err.message ?? "Whoops terjadi kesalahan");
        },
    });

    const handleRoleChange = (event) => {
        setSelectedRole(Number(event.target.value)); // Convert value to number
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        if (!selectedRole) {
            setErrorMessage("Pilih role terlebih dahulu.");
            return;
        }

        router.put(`/api-v1/roles/${asistenId}`, { role_id: selectedRole }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Role berhasil diperbarui.");
                setTimeout(() => {
                    onClose();
                }, 1000);
            },
            onError: (error) => {
                toast.error("Terjadi kesalahan. Coba lagi.");
            },
        });
    };

    return (
        <div>
            {/* Modal Edit Role */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-xl w-[430px] text-center relative">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                        <h2 className="text-2xl text-center font-bold mb-2 text-darkGreen">Update Role</h2>
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 flex justify-center items-center"
                        >
                            <img className="w-9" src={closeIcon} alt="closeIcon" />
                        </button>
                    </div>

                    {/* List Role in Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-4 text-left">
                        {rolesLoading && (
                            <span className="col-span-3 text-sm text-gray-500">Memuat role...</span>
                        )}
                        {rolesError && (
                            <span className="col-span-3 text-sm text-red-500">
                                {rolesQueryError?.message ?? "Gagal memuat role"}
                            </span>
                        )}
                        {!rolesLoading && !rolesError && roles.map((role) => (
                            <label key={role.id} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="role_id"
                                    value={role.id}
                                    checked={selectedRole === role.id}
                                    onChange={handleRoleChange}
                                    className="h-5 w-5 text-deepForestGreen"
                                />
                                <span className="text-lg">{role.name}</span>
                            </label>
                        ))}
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                        <p className="text-red-500 mt-4">{errorMessage}</p>
                    )}

                    {/* Save Button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleSave}
                            className="text-md font-bold text-white bg-darkGreen hover:bg-softGreen rounded-md px-6 py-1"
                        >
                            Simpan
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
