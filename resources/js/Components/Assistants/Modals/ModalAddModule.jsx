import { useState } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { submit } from "@/lib/wayfinder";
import { store as storeModul } from "@/actions/App/Http/Controllers/API/ModulController";

export default function ButtonAddModule({ onClose }) {
    const [values, setValues] = useState({
        judul: '',
        poin1: '',
        poin2: '',
        poin3: '',
        isEnglish: 0,
        isUnlocked: 0,
        modul_link: '',
        ppt_link: '',
        video_link: '',
    });

    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [isUnlockedSwitchOn, setIsUnlockedSwitchOn] = useState(false);
    const [localErrors, setLocalErrors] = useState({});

    const validateFields = () => {
        const newErrors = {};

        if (!values.judul.trim()) newErrors.judul = "Judul is required.";
        if (!values.poin1.trim()) newErrors.poin1 = "Poin 1 is required.";
        // if (!values.poin2.trim()) newErrors.poin2 = "Poin 2 is required.";
        // if (!values.poin3.trim()) newErrors.poin3 = "Poin 3 is required.";
        // if (!values.ppt_link.trim()) newErrors.ppt_link = "Link PPT is required.";
        // if (!values.video_link.trim()) newErrors.video_link = "Link Video Youtube is required.";
        // if (!values.modul_link.trim()) newErrors.modul_link = "Link Modul is required.";

        setLocalErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (validateFields()) {
            submit(storeModul(), {
                data: values,
                onSuccess: () => {
                    console.log('Data berhasil dikirim');
                    toast.success("Modul berhasil ditambahkan.");
                    onClose();
                },
                onError: (errors) => {
                    console.error('Validation errors:', errors);
                    setLocalErrors(errors);
                    const message = errors?.response?.data?.message ?? "Gagal menambahkan modul.";
                    toast.error(message);
                    if (errors.response) {
                        console.error('Error Response:', errors.response.data);
                    }
                },
            });
        } else {
            console.log('Form validation failed');
            toast.error("Harap lengkapi data yang diperlukan.");
        }
    };

    const toggleSwitch = () => {
        const newSwitchState = !isSwitchOn;
        setIsSwitchOn(newSwitchState);
        setValues({ ...values, isEnglish: newSwitchState ? 1 : 0 });
    };

    const toggleUnlockedSwitch = () => {
        const newSwitchState = !isUnlockedSwitchOn;
        setIsUnlockedSwitchOn(newSwitchState);
        setValues({ ...values, isUnlocked: newSwitchState ? 1 : 0 });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Utama */}
            <div className="bg-white rounded-lg p-6 w-[700px] shadow-lg relative overflow-y-auto max-h-[80vh]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-deepForestGreen">
                    <h2 className="text-2xl font-bold text-deepForestGreen">Tambah Modul</h2>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 flex justify-center items-center"
                    >
                        <img className="w-9" src={closeIcon} alt="closeIcon" />
                    </button>
                </div>

                <form onSubmit={handleSave}>
                    {/* Input Judul Modul */}
                    <div className="mb-4">
                        <label htmlFor="judul" className="block text-darkGreen text-md font-medium">
                            Judul Modul
                        </label>
                        <input
                            id="judul"
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                            placeholder="Masukkan judul modul"
                            value={values.judul}
                            onChange={(e) => setValues({ ...values, judul: e.target.value })}
                        />
                        {localErrors.judul && (
                            <p className="text-red-500 text-sm mt-1">{localErrors.judul}</p>
                        )}
                    </div>

                    {/* Input Poin-poin Pembelajaran */}
                    <div className="mb-4">
                        <label className="block text-darkGreen text-md font-medium">Poin-poin Pembelajaran</label>
                        {["poin1", "poin2", "poin3"].map((point, index) => (
                            <div key={point} className="mb-2">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                                    placeholder={`Poin ${index + 1}`}
                                    value={values[point]}
                                    onChange={(e) => setValues({ ...values, [point]: e.target.value })}
                                />
                                {localErrors[point] && (
                                    <p className="text-red-500 text-sm mt-1">{localErrors[point]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input Link */}
                    {["ppt_link", "video_link", "modul_link"].map((link, index) => (
                        <div key={link} className="mb-4">
                            <label
                                htmlFor={link}
                                className={`block text-md font-medium ${link === "ppt_link"
                                        ? "text-green-700"
                                        : link === "video_link"
                                            ? "text-red-700"
                                            : "text-blue-700"
                                    }`}
                            >
                                {`Link ${index === 0 ? "PPT" : index === 1 ? "Video Youtube" : "Modul"}`}
                            </label>
                            <input
                                id={link}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-darkBrown focus:border-darkBrown"
                                placeholder={`Masukkan ${link}`}
                                value={values[link]}
                                onChange={(e) => setValues({ ...values, [link]: e.target.value })}
                            />
                            {localErrors[link] && (
                                <p className="text-red-500 text-sm mt-1">{localErrors[link]}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-between">
                        <div className="flex justify-start gap-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">English</label>
                                <div
                                    onClick={toggleSwitch}
                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isSwitchOn ? "bg-deepForestGreen" : "bg-fireRed"}`}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isSwitchOn ? "translate-x-5" : "translate-x-0"}`}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Unlocked</label>
                                <div
                                    onClick={toggleUnlockedSwitch}
                                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${isUnlockedSwitchOn ? "bg-deepForestGreen" : "bg-fireRed"}`}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${isUnlockedSwitchOn ? "translate-x-5" : "translate-x-0"}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tombol Simpan */}
                        <div className="mt-4 text-right">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 bg-gray-300 text-darkBrown font-semibold rounded-md shadow hover:bg-gray-400 transition duration-300 mr-2"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-deepForestGreen text-white font-semibold rounded-md shadow hover:bg-darkGreen transition duration-300"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
