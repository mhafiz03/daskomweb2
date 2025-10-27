import { useState } from "react";
import { Link } from "@inertiajs/react";
import ModalPasswordAssistant from '../Modals/ModalPasswordAssistant';
import ModalLogout from '../Modals/ModalLogout';
import ModalKonfigurasi from '../Modals/ModalKonfigurasi';
import ModalOpenKJ from '../Modals/ModalOpenKJ';
import ModalActiveTP from "../Modals/ModalActiveTP";

import profileIcon from "../../../../assets/nav/Icon-Profile.svg";
import praktikumIcon from "../../../../assets/nav/Icon-Praktikum.svg";
import nilaiIcon from "../../../../assets/nav/Icon-Nilai.svg";
import historyIcon from "../../../../assets/nav/Icon-History.svg";
import laporanIcon from "../../../../assets/nav/Icon-Laporan.svg";
import inputSoalIcon from "../../../../assets/nav/Icon-InputSoal.svg";
import rankingIcon from "../../../../assets/nav/Icon-Ranking.svg";
import pollingIcon from "../../../../assets/nav/Icon-Polling.svg";
import plottingIcon from "../../../../assets/nav/Icon-Plotting.svg";
import roleIcon from "../../../../assets/nav/Icon-Piket.svg";
import praktikanIcon from "../../../../assets/nav/Icon-Praktikan.svg";
import pelanggaranIcon from "../../../../assets/nav/Icon-Pelanggaran.svg";
import announcementIcon from "../../../../assets/nav/Icon-Annoucement.svg";
import changePassIcon from "../../../../assets/nav/Icon-GantiPassword.svg";
import logoutIcon from "../../../../assets/nav/Icon-Logout.svg";
import jawabanTP from "../../../../assets/nav/Icon-Rating.svg";
import moduleIcon from "../../../../assets/nav/Icon-Module.svg";
import tpModuleIcon from "../../../../assets/nav/Icon-TP.svg";

export default function AssisstantNav({ asisten, permission_name = [], roleName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showOpenKJ, setShowOpenKJ] = useState(false);
    const [showOpenTP, setShowOpenTP] = useState(false);


    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openLogoutModal = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);

    const openConfigModal = () => setShowConfigModal(true);
    const closeConfigModal = () => setShowConfigModal(false);

    const openOpenKJModal = () => setShowOpenKJ(true);
    const closeOpenKJModal = () => setShowOpenKJ(false);

    const openOpenTPModal = () => setShowOpenTP(true);
    const closeOpenTPModal = () => setShowOpenTP(false);

    const handleLogoutConfirm = () => {
        closeLogoutModal();
    };

    const permissionSet = new Set(permission_name);
    const normalizedRole = roleName?.toUpperCase() ?? null;
    const adminRoles = ["SOFTWARE", "KORDAS", "WAKORDAS", "ADMIN"];

    const isRoleAllowed = (allowedRoles) => {
        if (!allowedRoles || allowedRoles.length === 0) {
            return true;
        }

        if (!normalizedRole) {
            return false;
        }

        return allowedRoles.map((role) => role.toUpperCase()).includes(normalizedRole);
    };

    const canAccess = (permission, allowedRoles) =>
        permissionSet.has(permission) && isRoleAllowed(allowedRoles);

    return (
        <>
            <nav className="h-screen flex items-center">
                <div className="left-0 top-0 h-[91vh] w-[260px] bg-forestGreen text-left text-white mx-[8px] my-[27px] font-poppins font-bold overflow-y-auto scrollbar-hidden scroll-smooth rounded-md ">
                    <div className="">
                        <ul className="py-5">
                            {/* Bagian Profile dan Praktikum */}
                            {canAccess("manage-profile") && (
                                <li id="manage-profile">
                                    <Link
                                        href={route('assistant')}
                                        className="flex py-3 px-5 hover:bg-darkGreen"
                                    >
                                        <img className="w-6" src={profileIcon} alt="profile" />
                                        <span className="self-center text-sm ml-3">Profile</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-history") && (
                            <li id="manage-praktikum">
                                <Link href="/start-praktikum" className="flex py-3 px-5 hover:bg-darkGreen">
                                    <img className="w-6" src={praktikumIcon} alt="start praktikum" />
                                    <span className="self-center text-sm ml-3">Start Praktikum</span>
                                </Link>
                            </li>
                            )}

                            {/* Bagian History, Laporan, dan Nilai */}
                            {canAccess("see-history") && (
                                <li id="see-history">
                                    <Link href="/history" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={historyIcon} alt="history" />
                                        <span className="self-center text-sm ml-3">History Praktikum</span>
                                    </Link>
                                </li>
                            )}
                            {/* {permission_name.includes("laporan-praktikum") && (
                                <li id="laporan-praktikum">
                                    <Link href="/list-laporan" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={laporanIcon} alt="laporan" />
                                        <span className="self-center text-sm ml-3">Laporan Praktikum</span>
                                    </Link>
                                </li>
                            )} */}
                            {canAccess("nilai-praktikan") && (
                                <li id="nilai-praktikan">
                                    <Link href="/nilai-praktikan" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={nilaiIcon} alt="nilai" />
                                        <span className="self-center text-sm ml-3">Nilai Praktikan</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("manage-modul") && (
                                <li id="manage-modul">
                                    <Link href="/modul" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={moduleIcon} alt="moduleIcon" />
                                        <span className="self-center text-sm ml-3">Modul</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian Soal, Ranking, dan Polling */}
                            {canAccess("manage-soal") && (
                                <li id="see-soal">
                                    <Link href="/soal" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={inputSoalIcon} alt="input soal" />
                                        <span className="self-center text-sm ml-3">Input Soal</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-ranking") && (
                                <li id="ranking-praktikan">
                                    <Link href="/ranking" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={rankingIcon} alt="ranking" />
                                        <span className="self-center text-sm ml-3">Ranking Praktikan</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-polling") && (
                                <li id="see-polling">
                                    <Link href="/polling" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={pollingIcon} alt="polling" />
                                        <span className="self-center text-sm ml-3">Polling Assistant</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian Plottingan, Praktikan, dan Pelanggaran */}
                            {canAccess("see-plot") && (
                                <li id="see-plot">
                                    <Link href="/plottingan" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={plottingIcon} alt="plotting" />
                                        <span className="self-center text-sm ml-3">Plotting Jadwal</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("set-praktikan") && (
                                <li id="set-praktikan">
                                    <Link href="/set-praktikan" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={roleIcon} alt="praktikan" />
                                        <span className="self-center text-sm ml-3">Set Praktikan</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-pelanggaran") && (
                                <li id="see-pelanggaran">
                                    <Link href="/pelanggaran" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={pelanggaranIcon} alt="pelanggaran" />
                                        <span className="self-center text-sm ml-3">Pelanggaran</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian Kunci Jawaban, Role Management, dan Konfigurasi */}
                            {canAccess("manage-role", adminRoles) && (
                                <li id="manage-role">
                                    <Link href="/manage-role" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={praktikanIcon} alt="manage role" />
                                        <span className="self-center text-sm ml-3">Manage Role</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("check-tugas-pendahuluan") && (
                                <li id="check-tugas-pendahuluan">
                                    <Link href="/lihat-tp" className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={jawabanTP} alt="lihat tp" />
                                        <span className="self-center text-sm ml-3">Lihat TP</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("unlock-jawaban", adminRoles) && (
                                <li id="unlock-jawaban">
                                    <a onClick={openOpenKJModal} className="flex py-3 px-5 hover:bg-darkGreen cursor-pointer">
                                        <img className="w-6" src={announcementIcon} alt="open-jawaban" />
                                        <span className="self-center text-sm ml-3">Open Jawaban</span>
                                    </a>
                                </li>
                            )}
                        </ul>

                        <ul className="py-5">
                            {/* Bagian Pengaturan dan Logout */}
                            {canAccess("lms-configuration", adminRoles) && (
                                <li id="config">
                                    <a onClick={openConfigModal} className="flex py-3 px-5 hover:bg-darkGreen">
                                        <img className="w-6" src={tpModuleIcon} alt="change password" />
                                        <span className="self-center text-sm ml-3">Configuration</span>
                                    </a>
                                </li>
                            )}
                            <li id="change-password">
                                <a onClick={openModal} className="flex py-3 px-5 hover:bg-darkGreen">
                                    <img className="w-6" src={changePassIcon} alt="change password" />
                                    <span className="self-center text-sm ml-3">Change Password</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={openLogoutModal} className="flex py-3 px-5 hover:bg-darkGreen">
                                    <img className="w-6" src={logoutIcon} alt="logout" />
                                    <span className="self-center text-sm ml-3">Logout</span>
                                </a>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>

            {isModalOpen && <ModalPasswordAssistant onClose={closeModal} />}
            {showLogoutModal && (
                <ModalLogout onClose={closeLogoutModal} onConfirm={handleLogoutConfirm} />
            )}
            {showConfigModal && <ModalKonfigurasi onClose={closeConfigModal} />}
            {showOpenKJ && <ModalOpenKJ onClose={closeOpenKJModal} />}
            {showOpenTP && <ModalActiveTP onClose={closeOpenTPModal} />}
        </>
    );
}
