import { useState } from "react";
import { Image } from "@imagekit/react";
import daskomIcon from "../../../../../resources/assets/daskom.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import ModalEditProfilePraktikan from "../Modals/ModalEditProfilePraktikan";

export default function CardPraktikan({praktikan}) {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    return (
        <>
            <div className="mx-auto mt-[13vh] font-poppins items-center flex flex-col">
                <div className="h-[436px] w-[352.8px] rounded-depth-lg border border-depth bg-depth-card pt-6 shadow-depth-lg">
                    {/* Edit Button */}
                    <div className="flex justify-end translate-x-12 -translate-y-4">
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

                    {/* Profile Picture */}
                    <div className="mx-auto relative flex h-40 w-40 items-center justify-center rounded-depth-full border border-depth bg-depth-background shadow-depth-md">
                        {praktikan?.profile_picture_url ? (
                            <Image
                                src={praktikan.profile_picture_url}
                                transformation={[{ height: "144", width: "144", crop: "maintain_ratio" }]}
                                alt={praktikan?.nama || "Foto Praktikan"}
                                className="h-36 w-36 rounded-depth-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <img
                                src={daskomIcon}
                                alt="Logo Daskom"
                                className="h-36 w-36 rounded-depth-full object-cover"
                            />
                        )}
                        <span className="pointer-events-none absolute inset-0 rounded-depth-full border border-white/20 shadow-[inset_0_2px_6px_rgba(255,255,255,0.25)]" />
                    </div>

                    <div className="mb-3 mt-4 flex justify-center">
                        <h1 className="max-w-[320px] truncate font-poppins text-lg font-bold text-depth-primary">
                            {praktikan.nama}
                        </h1>
                    </div>

                    <div className="flex px-5">
                        <ul className="mb-5 font-poppins text-sm text-depth-secondary">
                            <li className="my-1">
                                NIM
                            </li>
                            <li className="my-1">
                                Kelas
                            </li>
                            <li className="my-1">
                                No. Telp
                            </li>
                            <li className="my-1">
                                Email
                            </li>
                        </ul>
                        <ul className="ml-4 mb-5 font-poppins text-sm font-medium text-depth-primary">
                            <li className="my-1 max-w-[320px] truncate">
                                : {praktikan.nim}
                            </li>
                            <li className="my-1 max-w-[230px] truncate">
                                : {praktikan.kelas_id}
                            </li>
                            <li className="my-1 max-w-[230px] truncate">
                                : {praktikan.nomor_telepon}
                            </li>
                            <li className="my-1 max-w-[230px] truncate">
                                : {praktikan.email}
                            </li>
                        </ul>
                    </div>

                    <div className="mx-5 my-5 rounded-depth-md bg-[var(--depth-color-primary)] py-1 shadow-depth-md">
                        <h1 className="text-center font-poppins text-lg font-bold text-white">
                            Daskom Laboratory
                        </h1>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <ModalEditProfilePraktikan 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                praktikan={praktikan}
            />
        </>
    );
}
