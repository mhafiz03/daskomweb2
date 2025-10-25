import { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import closeIcon from "../../../../assets/modal/iconClose.svg";

export default function ModalEditProfile({ isOpen, onClose }) {
    // const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);
    const { success } = usePage().props;
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [photoError, setPhotoError] = useState(""); // Only for photo errors
    const [avatar, setAvatar] = useState(null);
    const [values, setValues] = useState({
        nomor_telepon: "",
        id_line: "",
        instagram: "",
        deskripsi: "",

    });

    const { auth, errors } = usePage().props; // Fetch shared props from Inertia
    const asisten = auth.asisten;

    // Populate the form fields with current data from `asisten`
    useEffect(() => {
        // Show error only for photo uploads
        if (errors?.upload) {
            setPhotoError(errors.upload[0]);
            setIsSuccessModalOpen(true); // Ensure modal opens for errors
        } else {
            setPhotoError(""); // Clear photo error if fixed
        }

       // ✅ Ensure success modal shows when update is successful
        if (success && !errors?.upload) {
            setIsSuccessModalOpen(true);
        }


        if (asisten) {
            setValues({
                nomor_telepon: asisten.nomor_telepon || "",
                id_line: asisten.id_line || "",
                instagram: asisten.instagram || "",
                deskripsi: asisten.deskripsi || "",
            });
            setAvatar(asisten.avatar_url || null); // Assuming there's an avatar URL
        }
    }, [asisten, errors, success]);

    const handleSave = async (e) => {
        e.preventDefault();
        router.put("/api-v1/asisten", values, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSuccessModalOpen(true); // ✅ Ensure modal opens
                setTimeout(() => {
                    setIsSuccessModalOpen(false);
                    onClose(); // Close the main modal
                }, 3000);
            },
            onError: (errors) => {
                console.error("Validation Errors:", errors);
            },
        });
    };

    const handleChange = (e) => {
        const key = e.target.id;
        const value = e.target.value;
        setValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file)); // Preview the uploaded image
        }

        const formData = new FormData();
        formData.append("upload", file);
        console.log([...formData]);

        // Show preview
        setAvatar(URL.createObjectURL(file));

        // Upload with Inertia
        router.post(
            "/api-v1/profilePic",
            formData,
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setAvatar(page.props.auth.asisten.foto_asistens?.foto || null);
                },
                onError: (errors) => {
                    console.error("Upload Error:", errors);
                },
            }
        );
    };

    const handleDeleteAvatar = () => {
        router.delete("/api-v1/profilePic", {
            preserveScroll: true,
            onSuccess: () => {
                setAvatar(null); // Reset the avatar state after successful deletion
            },
            onError: (errors) => {
                console.error("Delete Avatar Error:", errors);
            },
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Modal Edit Profile */}
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white w-[550px] p-6 rounded-lg shadow-lg relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>

                    <form onSubmit={handleSave} encType="multipart/form-data">
                        <div className="flex gap-4 justify-between p-4">
                            <div>
                                {/* WhatsApp */}
                                <div className="mb-4">
                                    <label className="block text-black font-bold mb-1">
                                        WhatsApp:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded p-2"
                                        placeholder="Enter WhatsApp number"
                                        name="nomor_telepon"
                                        id="nomor_telepon"
                                        value={values.nomor_telepon}
                                        onChange={handleChange}
                                    />
                                    {errors.nomor_telepon && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nomor_telepon}</p>
                                    )}
                                </div>
                                {/* ID Line */}
                                <div className="mb-4">
                                    <label className="block text-black font-bold mb-1">
                                        ID Line:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded p-2"
                                        placeholder="Enter Line ID"
                                        name="id_line"
                                        id="id_line"
                                        value={values.id_line}
                                        onChange={handleChange}
                                    />
                                    {errors.id_line && (
                                        <p className="text-red-500 text-sm mt-1">{errors.id_line}</p>
                                    )}
                                </div>
                                {/* Instagram */}
                                <div className="mb-4">
                                    <label className="block text-black font-bold mb-1">
                                        Instagram:
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border rounded p-2"
                                        placeholder="Enter Instagram username"
                                        name="instagram"
                                        id="instagram"
                                        value={values.instagram}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            {/* Avatar */}
                            <div className="flex flex-col items-center mb-4 mr-12 mt-6">
                                <div className="bg-gray-100 w-32 h-32 rounded-full flex justify-center items-center overflow-hidden mb-4">
                                    {asisten?.foto_asistens?.foto || avatar ? (
                                        <img 
                                            src={asisten?.foto_asistens?.foto || avatar} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-4xl">👤</span>
                                    )}
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <label
                                        htmlFor="avatarUpload"
                                        className="px-4 py-1 bg-forestGreen text-white font-semibold text-md rounded-sm shadow-md cursor-pointer text-center"
                                    >
                                        Change Avatar
                                    </label>
                                    <input
                                        id="avatarUpload"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                    />

                                    <button
                                        type="button"
                                        className="px-5 py-1 bg-lightGray text-white font-semibold text-md rounded-sm shadow-md"
                                        onClick={handleDeleteAvatar}
                                    >
                                        Delete Avatar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* About Me */}
                        <div className="mb-4">
                            <label className="block text-black font-bold mb-1">
                                About Me:
                            </label>
                            <textarea
                                className="w-full border rounded p-2"
                                placeholder="Tell us about yourself"
                                rows="4"
                                name="deskripsi"
                                id="deskripsi"
                                value={values.deskripsi}
                                onChange={handleChange}
                            ></textarea>
                            {errors.deskripsi && (
                                <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-32 py-1 bg-forestGreen hover:bg-darkGreen text-white font-semibold rounded-lg shadow-md shadow-darkGreen"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {/* {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[300px] p-4 rounded-lg shadow-lg text-center">
                        <h3 className="text-lg font-bold text-forestGreen">Profile Updated!</h3>
                    </div>
                </div>
            )} */}

            {/* {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[300px] p-4 rounded-lg shadow-lg text-center">
                        {photoError ? (
                            <h3 className="text-lg font-bold text-red-500">Photo must be less than 500kb</h3>
                        ) : (
                            <h3 className="text-lg font-bold text-forestGreen">Profile Updated!</h3>
                        )}
                        <button onClick={() => setIsSuccessModalOpen(false)}>Close</button>
                    </div>
                </div>
            )} */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white w-[350px] p-6 rounded-lg shadow-lg text-center animate-fadeIn">
                        {photoError ? (
                            <h3 className="text-lg font-bold text-red-500 mb-2">
                                Photo must be less than 500kb
                            </h3>
                        ) : (
                            <h3 className="text-lg font-bold text-forestGreen mb-2">
                                Profile Updated Successfully!
                            </h3>
                        )}
                        <button
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="mt-4 px-4 py-2 bg-forestGreen text-white hover:bg-darkGreen rounded transition duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


            
        </>
    );
}
