import { useMemo, useState } from "react";
import { Image } from "@imagekit/react";
import ModalEditProfile from "../Modals/ModalEditProfile";
import iconWA from "../../../../assets/contact/iconWhatsapp.svg";
import iconLine from "../../../../assets/contact/iconLine.svg";
import iconIG from "../../../../assets/contact/iconInstagram.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import daskomIcon from "../../../../../resources/assets/daskom.svg";

export default function AssistantCard({ asisten }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const contactItems = useMemo(
        () => [
            {
                icon: iconWA,
                label: "WhatsApp",
                value: asisten?.nomor_telepon || "Tidak tersedia",
            },
            {
                icon: iconLine,
                label: "ID Line",
                value: asisten?.id_line || "Tidak tersedia",
            },
            {
                icon: iconIG,
                label: "Instagram",
                value: asisten?.instagram || "Tidak tersedia",
            },
        ],
        [asisten?.id_line, asisten?.instagram, asisten?.nomor_telepon]
    );

    const roleName = asisten?.roles?.[0]?.name ?? "Asisten";

    return (
        <>
            <div className="flex justify-center px-4">
                <div className="w-full max-w-xl rounded-depth-lg border border-depth bg-depth-card p-8 text-center shadow-depth-lg transition-colors duration-300">
                    <div className="flex justify-end translate-x-12 -translate-y-10">
                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className="group inline-flex items-center gap-2 rounded-depth-full border border-transparent bg-depth-interactive px-4 py-2 text-sm font-semibold text-depth-secondary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-card)]"
                        >
                            <img
                                className="edit-icon-filter h-4 w-4 opacity-70 transition group-hover:opacity-100"
                                src={editIcon}
                                alt="Edit profil"
                            />
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <div className="relative mb-4 flex h-40 w-40 items-center justify-center rounded-depth-full border border-depth bg-depth-background shadow-depth-md">
                            {asisten?.foto_asistens?.foto ? (
                                <Image
                                    src={asisten.foto_asistens.foto}
                                    transformation={[{ height: "144", width: "144", crop: "maintain_ratio" }]}
                                    alt={asisten?.nama || "Foto Asisten"}
                                    className="h-36 w-36 rounded-depth-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <img
                                    src={daskomIcon}
                                    alt={asisten?.nama || "Foto Asisten"}
                                    className="h-36 w-36 rounded-depth-full object-cover"
                                />
                            )}
                            <span className="pointer-events-none absolute inset-0 rounded-depth-full border border-white/20 shadow-[inset_0_2px_6px_rgba(255,255,255,0.25)]" />
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-depth-primary">
                                {asisten?.nama ?? "Asisten Daskom"}
                            </h2>
                            <div className="mt-2 flex items-center justify-center gap-1 text-lg text-amber-400 drop-shadow">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <span key={index} aria-hidden="true">
                                        ★
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-depth-secondary">
                        {asisten?.deskripsi || "Belum ada deskripsi yang ditambahkan untuk asisten ini."}
                    </p>

                    <div className="mt-6 space-y-3">
                        {contactItems.map(({ icon, label, value }) => (
                            <div
                                key={label}
                                className="flex items-center justify-center gap-3 rounded-depth-full border border-transparent bg-depth-interactive px-4 py-2 text-sm font-medium text-depth-primary shadow-depth-sm transition hover:shadow-depth-md"
                            >
                                <img className="h-5 w-5" src={icon} alt={label} />
                                <span className="text-depth-secondary">{value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 w-full rounded-depth-md bg-[var(--depth-color-primary)] py-2 text-center text-sm font-semibold uppercase tracking-wide text-white shadow-depth-md">
                        {roleName}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ModalEditProfile isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
}
