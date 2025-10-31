import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import closeIcon from "../../../../assets/modal/iconClose.svg";
import { usePage } from "@inertiajs/react";
import { submit } from "@/lib/wayfinder";
import { update as updateModul } from "@/actions/App/Http/Controllers/API/ModulController";

export default function ModalEditModule({ onClose, modules, selectedModuleId, onUpdate }) {
    const [values, setValues] = useState({
        judul: "",
        deskripsi: "",
        modul_link: "",
        ppt_link: "",
        video_link: "",
        isEnglish: 0,
        isUnlocked: 0,
    });
    const [isEnglishOn, setIsEnglishOn] = useState(false);
    const [isUnlockedOn, setIsUnlockedOn] = useState(false);

    const { errors } = usePage().props;

    useEffect(() => {
        const selected = modules.find((module) => module.idM === selectedModuleId);
        if (selected) {
            setValues({
                judul: selected.judul ?? "",
                deskripsi: selected.deskripsi ?? "",
                modul_link: selected.modul_link ?? "",
                ppt_link: selected.ppt_link ?? "",
                video_link: selected.video_link ?? "",
                isEnglish: selected.isEnglish ?? 0,
                isUnlocked: selected.isUnlocked ?? 0,
            });
            setIsEnglishOn(selected.isEnglish === 1);
            setIsUnlockedOn(selected.isUnlocked === 1);
        }
    }, [modules, selectedModuleId]);

    const handleSave = () => {
        if (!selectedModuleId) {
            toast.error("ID modul tidak valid.");
            return;
        }

        submit(updateModul(selectedModuleId), {
            data: values,
            preserveScroll: true,
            onSuccess: () => {
                const updatedModule = {
                    ...(modules.find((m) => m.idM === selectedModuleId) ?? {}),
                    idM: selectedModuleId,
                    ...values,
                };

                if (typeof onUpdate === "function") {
                    onUpdate(updatedModule);
                }

                toast.success("Modul berhasil diperbarui.");
                onClose();
            },
            onError: (error) => {
                const message = error?.response?.data?.message ?? "Gagal memperbarui modul.";
                toast.error(message);
            },
        });
    };

    const linkFields = [
        { key: "ppt_link", label: "Link PPT", tone: "green" },
        { key: "video_link", label: "Link Video Youtube", tone: "red" },
        { key: "modul_link", label: "Link Modul", tone: "blue" },
    ];

    return (
        <div className="depth-modal-overlay z-50">
            <div
                className="depth-modal-container max-h-[80vh] w-full max-w-3xl space-y-6 overflow-y-auto"
            >
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Edit Modul</h2>
                    <button onClick={onClose} type="button" className="depth-modal-close">
                        <img className="h-6 w-6" src={closeIcon} alt="Tutup" />
                    </button>
                </div>

                {errors?.general && (
                    <div className="rounded-depth-md border border-red-400 bg-red-500/10 px-3 py-2 text-sm text-red-500">
                        {errors.general}
                    </div>
                )}

                <div className="space-y-6">
                    <FieldGroup label="Judul Modul" error={errors?.judul}>
                        <input
                            id="judul"
                            type="text"
                            className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                            placeholder="Masukkan judul modul"
                            value={values.judul}
                            onChange={(event) => setValues({ ...values, judul: event.target.value })}
                        />
                    </FieldGroup>

                    <FieldGroup label="Pencapaian Pembelajaran" error={errors?.deskripsi}>
                        <textarea
                            className="w-full rounded-depth-lg border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                            placeholder="Masukkan poin pembelajaran"
                            rows={4}
                            value={values.deskripsi}
                            onChange={(event) => setValues({ ...values, deskripsi: event.target.value })}
                        />
                    </FieldGroup>

                    <div className="space-y-4">
                        {linkFields.map(({ key, label, tone }) => (
                            <FieldGroup key={key} label={label} tone={tone} error={errors?.[key]}>
                                <input
                                    id={key}
                                    type="url"
                                    className="w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                                    placeholder={`Masukkan ${label.toLowerCase()}`}
                                    value={values[key]}
                                    onChange={(event) => setValues({ ...values, [key]: event.target.value })}
                                />
                            </FieldGroup>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex gap-4">
                            <DepthToggle
                                label="English"
                                isOn={isEnglishOn}
                                onToggle={() =>
                                    setIsEnglishOn((prev) => {
                                        const next = !prev;
                                        setValues((current) => ({ ...current, isEnglish: next ? 1 : 0 }));
                                        return next;
                                    })
                                }
                            />
                            <DepthToggle
                                label="Unlocked"
                                isOn={isUnlockedOn}
                                onToggle={() =>
                                    setIsUnlockedOn((prev) => {
                                        const next = !prev;
                                        setValues((current) => ({ ...current, isUnlocked: next ? 1 : 0 }));
                                        return next;
                                    })
                                }
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="rounded-depth-md border border-depth bg-depth-interactive px-5 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                className="rounded-depth-md bg-[var(--depth-color-primary)] px-5 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FieldGroup({ label, children, error, tone }) {
    const toneClasses = {
        green: "text-green-500",
        red: "text-red-500",
        blue: "text-blue-500",
    }[tone];

    return (
        <div className="space-y-2">
            <label className={`text-sm font-semibold text-depth-secondary ${toneClasses ?? ""}`}>
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

function DepthToggle({ label, isOn, onToggle }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-depth-secondary">{label}</span>
            <button
                type="button"
                onClick={onToggle}
                className={`flex h-6 w-11 items-center rounded-depth-full border border-depth bg-depth-card p-1 transition ${
                    isOn ? "text-white" : "text-depth-secondary"
                }`}
            >
                <span
                    className={`h-4 w-4 rounded-depth-full bg-depth-interactive shadow-depth-sm transition-transform ${
                        isOn ? "translate-x-5 bg-[var(--depth-color-primary)]" : "translate-x-0"
                    }`}
                />
            </button>
        </div>
    );
}
