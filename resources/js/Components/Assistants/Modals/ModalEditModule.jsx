import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import { usePage } from "@inertiajs/react";
import { submit } from "@/lib/wayfinder";
import { update as updateModul } from "@/actions/App/Http/Controllers/API/ModulController";

export default function ButtonEditModule({ onClose, modules, selectedModuleId, onUpdate, initialOpen }) {
    const [points, setPoints] = useState(["", "", ""]);
    const [link1, setLink1] = useState("");
    const [link2, setLink2] = useState("");
    const [link3, setLink3] = useState("");
    const [title, setTitle] = useState("");
    const [isEnglishOn, setIsEnglishOn] = useState(false);
    const [isUnlockedOn, setIsUnlockedOn] = useState(false);

    const { errors } = usePage().props;

    // Reset form fields when selectedModuleId changes
    useEffect(() => {
        const selectedModule = modules.find(module => module.idM === selectedModuleId);
        console.log("Selected module:", selectedModule);
        console.log("Selected module ID:", selectedModuleId);
        console.log("All modules:", modules);

        if (selectedModule) {
            setTitle(selectedModule.judul || "");
            setPoints([
                selectedModule.poin1 || "",
                selectedModule.poin2 || "",
                selectedModule.poin3 || ""
            ]);
            setLink1(selectedModule.ppt_link || "");
            setLink2(selectedModule.video_link || "");
            setLink3(selectedModule.modul_link || "");
            setIsEnglishOn(selectedModule.isEnglish === 1); // Ensure boolean conversion
            setIsUnlockedOn(selectedModule.isUnlocked === 1); // Ensure boolean conversion
        }
    }, [selectedModuleId, modules]);

    // Handle save button click
    const handleSave = () => {
        if (!selectedModuleId) {
            console.error('Invalid ID:', selectedModuleId);
            toast.error("ID modul tidak valid.");
            return;
        }

        const payload = {
            judul: title,
            poin1: points[0] || "",
            poin2: points[1] || "",
            poin3: points[2] || "",
            isEnglish: isEnglishOn ? 1 : 0, // Ensure correct value is sent
            isUnlocked: isUnlockedOn ? 1 : 0, // Ensure correct value is sent
            modul_link: link3,
            ppt_link: link1,
            video_link: link2,
        };

        submit(updateModul(selectedModuleId), {
            data: payload,
            preserveScroll: true,
            onSuccess: (page) => {
                const updatedModule = {
                    ...modules.find(m => m.idM === selectedModuleId),
                    idM: selectedModuleId,
                    judul: title,
                    poin1: points[0] || "",
                    poin2: points[1] || "",
                    poin3: points[2] || "",
                    isEnglish: isEnglishOn ? 1 : 0, // Ensure correct value is updated
                    isUnlocked: isUnlockedOn ? 1 : 0, // Ensure correct value is updated
                    modul_link: link3,
                    ppt_link: link1,
                    video_link: link2
                };

                if (typeof onUpdate === 'function') {
                    onUpdate(updatedModule); // Pass updated module to parent
                }

                toast.success("Modul berhasil diperbarui.");
                onClose();
            },
            onError: (errors) => {
                console.error("Error updating module:", errors);
                const message = errors?.response?.data?.message ?? "Gagal memperbarui modul.";
                toast.error(message);
            },
        });
    };

    // Handle point input change
    const handlePointChange = (index, value) => {
        const newPoints = [...points];
        newPoints[index] = value;
        setPoints(newPoints);
    };

    // Add a new point
    const handleAddPoint = () => {
        if (points.length < 3) {
            setPoints([...points, ""]);
        }
    };

    // Remove a point
    const handleRemovePoint = (index) => {
        if (points.length > 1) {
            const newPoints = points.filter((_, i) => i !== index);
            setPoints(newPoints);
        }
    };

    const toggleEnglishSwitch = () => {
        setIsEnglishOn(prev => !prev); 
    };

    const toggleUnlockedSwitch = () => {
        setIsUnlockedOn(prev => !prev);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Main Modal */}
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative overflow-y-auto max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-deepForestGreen">Edit Modul</h2>
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                </div>

                {/* General Errors */}
                {errors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}

                {/* Title Input */}
                <div className="mb-4">
                    <label htmlFor="judul" className="block text-darkGreen text-md font-medium">
                        Judul Modul
                    </label>
                    <input
                        id="judul"
                        type="text"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        placeholder="Masukkan judul modul"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors.judul && <p className="text-fireRed text-sm mt-1">{errors.judul}</p>}
                </div>

                {/* Learning Points Input */}
                <div className="mb-4">
                    <label className="block text-darkGreen text-md font-medium">Poin-poin Pembelajaran</label>
                    {points.map((point, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                                placeholder={`Poin ${index + 1}`}
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                            />
                            {points.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePoint(index)}
                                >
                                    <img
                                        className="w-6"
                                        src={trashIcon}
                                        alt="delete icon"
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                    {errors.poin1 && <p className="text-fireRed text-sm mt-1">{errors.poin1}</p>}
                    {points.length < 3 && (
                        <button
                            type="button"
                            onClick={handleAddPoint}
                            className="text-deepForestGreen hover:text-darkGreen hover:underline"
                        >
                            Tambah Poin
                        </button>
                    )}
                </div>

                {/* Link Inputs */}
                <div className="mb-4">
                    <label htmlFor="link1" className="block text-green-700 text-md font-medium">
                        Link PPT
                    </label>
                    <input
                        id="link1"
                        type="url"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        placeholder="Masukkan link PPT"
                        value={link1}
                        onChange={(e) => setLink1(e.target.value)}
                    />
                    {errors.ppt_link && <p className="text-fireRed text-sm mt-1">{errors.ppt_link}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="link2" className="block text-red-700 text-md font-medium">
                        Link Video Youtube
                    </label>
                    <input
                        id="link2"
                        type="url"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        placeholder="Masukkan link video youtube"
                        value={link2}
                        onChange={(e) => setLink2(e.target.value)}
                    />
                    {errors.video_link && <p className="text-fireRed text-sm mt-1">{errors.video_link}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="link3" className="block text-blue-700 text-md font-medium">
                        Link Modul
                    </label>
                    <input
                        id="link3"
                        type="url"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                        placeholder="Masukkan modul"
                        value={link3}
                        onChange={(e) => setLink3(e.target.value)}
                    />
                    {errors.modul_link && <p className="text-fireRed text-sm mt-1">{errors.modul_link}</p>}
                </div>

                <div className="flex justify-between">
                    <div className="flex justify-start gap-3">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                English
                            </label>
                            <div
                                onClick={toggleEnglishSwitch}
                                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isEnglishOn ? "bg-deepForestGreen" : "bg-fireRed"
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isEnglishOn ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Unlocked
                            </label>
                            <div
                                onClick={toggleUnlockedSwitch}
                                className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isUnlockedOn ? "bg-deepForestGreen" : "bg-fireRed"
                                    }`}
                            >
                                <div
                                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isUnlockedOn ? "translate-x-5" : "translate-x-0"
                                        }`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save and Cancel Buttons */}
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
        </div>
    );
}
