import { useEffect, useState } from "react";
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

const STORAGE_KEY = 'assistantNavCollapsed';

export default function AssisstantNav({ asisten, permission_name = [], roleName }) {
    const getInitialCollapsed = () => {
        if (typeof window === 'undefined') {
            return true;
        }
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored !== null ? stored === 'true' : true;
    };

    const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);
    const [isAnimating, setIsAnimating] = useState(false);
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

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        window.localStorage.setItem(STORAGE_KEY, String(isCollapsed));
    }, [isCollapsed]);

    const toggleSidebar = () => {
        if (!isCollapsed) {
            setIsAnimating(true);
            setTimeout(() => {
                setIsCollapsed((prev) => !prev);
                setIsAnimating(false);
            }, 300);
        } else {
            setIsCollapsed((prev) => !prev);
        }
    };

    const [isOpen, setIsOpen] = useState(() => !getInitialCollapsed());
    const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-black transition ease transform duration-300`;

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
            <nav className="h-screen fixed top-0 left-0 flex items-start">
                <div className={`flex flex-col h-[91vh] ${isCollapsed ? "w-12" : "w-[260px]"} bg-forestGreen text-left text-white mx-[8px] my-[27px] font-poppins font-bold rounded-md transition-all duration-300`}>
                    <div className="flex-shrink-0 h-12 flex items-center justify-end px-3 relative">
                        <button
                            className="flex flex-col justify-center items-center group"
                            onClick={() => { setIsOpen(!isOpen); toggleSidebar(); }}
                        >
                            <div className={`${genericHamburgerLine} bg-white transform transition-all duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-3" : "translate-y-1 group-hover:translate-y-0"}`} />
                            <div className={`${genericHamburgerLine} bg-white transform transition-all duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`} />
                            <div className={`${genericHamburgerLine} bg-white transform transition-all duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-3" : "-translate-y-1 group-hover:translate-y-0"}`} />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hidden scroll-smooth pt-1">
                        <ul className={`py-2 flex flex-col gap-1 ${!isCollapsed ? " ml-5" : ""}`}>
                            {/* Bagian Profile dan Praktikum */}
                            {canAccess("manage-profile") && (
                                <li id="manage-profile">
                                    <Link
                                        href={route('assistant')}
                                        className="flex py-2 px-2 hover:bg-darkGreen items-center"
                                    >
                                        <img className="w-6" src={profileIcon} alt="profile" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Profile</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-history") && (
                                <li id="manage-praktikum">
                                    <Link href="/start-praktikum" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={praktikumIcon} alt="start praktikum" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Start Praktikum</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian History, Laporan, dan Nilai */}
                            {canAccess("see-history") && (
                                <li id="see-history">
                                    <Link href="/history" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={historyIcon} alt="history" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>History Praktikum</span>
                                    </Link>
                                </li>
                            )}
                            {/* {permission_name.includes("laporan-praktikum") && (
                                <li id="laporan-praktikum">
                                    <Link href="/list-laporan" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={laporanIcon} alt="laporan" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                                ? "opacity-0 delay-0"
                                                : isAnimating
                                                    ? "opacity-0"
                                                    : "opacity-100 delay-300"
                                            }`}>Laporan Praktikum</span>
                                    </Link>
                                </li>
                            )} */}
                            {canAccess("nilai-praktikan") && (
                                <li id="nilai-praktikan">
                                    <Link href="/nilai-praktikan" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={nilaiIcon} alt="nilai" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Nilai Praktikan</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("manage-modul") && (
                                <li id="manage-modul">
                                    <Link href="/modul" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={moduleIcon} alt="moduleIcon" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Modul</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian Soal, Ranking, dan Polling */}
                            {canAccess("manage-soal") && (
                                <li id="see-soal">
                                    <Link href="/soal" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={inputSoalIcon} alt="input soal" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Input Soal</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-ranking") && (
                                <li id="ranking-praktikan">
                                    <Link href="/ranking" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={rankingIcon} alt="ranking" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Ranking Praktikan</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-polling") && (
                                <li id="see-polling">
                                    <Link href="/polling" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={pollingIcon} alt="polling" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Polling Assistant</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian Plottingan, Praktikan, dan Pelanggaran */}
                            {canAccess("see-plot") && (
                                <li id="see-plot">
                                    <Link href="/plottingan" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={plottingIcon} alt="plotting" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Plotting Jadwal</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("set-praktikan") && (
                                <li id="set-praktikan">
                                    <Link href="/set-praktikan" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={roleIcon} alt="praktikan" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Set Praktikan</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("see-pelanggaran") && (
                                <li id="see-pelanggaran">
                                    <Link href="/pelanggaran" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={pelanggaranIcon} alt="pelanggaran" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Pelanggaran</span>
                                    </Link>
                                </li>
                            )}

                            {/* Bagian Kunci Jawaban, Role Management, dan Konfigurasi */}
                            {canAccess("manage-role", adminRoles) && (
                                <li id="manage-role">
                                    <Link href="/manage-role" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={praktikanIcon} alt="manage role" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Manage Role</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("check-tugas-pendahuluan") && (
                                <li id="check-tugas-pendahuluan">
                                    <Link href="/lihat-tp" className="flex py-2 px-2 hover:bg-darkGreen items-center">
                                        <img className="w-6" src={jawabanTP} alt="lihat tp" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Lihat TP</span>
                                    </Link>
                                </li>
                            )}
                            {canAccess("unlock-jawaban", adminRoles) && (
                                <li id="unlock-jawaban">
                                    <a onClick={openOpenKJModal} className="flex py-2 px-2 hover:bg-darkGreen items-center cursor-pointer">
                                        <img className="w-6" src={announcementIcon} alt="open-jawaban" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Open Jawaban</span>
                                    </a>
                                </li>
                            )}
                        </ul>

                         <ul className={`py-2 mt-auto flex flex-col gap-1 ${!isCollapsed ? " ml-5 mb-5" : ""}`}>
                            {/* Bagian Pengaturan dan Logout */}
                            {canAccess("lms-configuration", adminRoles) && (
                                <li id="config">
                                    <a onClick={openConfigModal} className="flex py-2 px-2 hover:bg-darkGreen items-center cursor-pointer">
                                        <img className="w-6" src={tpModuleIcon} alt="change password" />
                                        <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                            }`}>Configuration</span>
                                    </a>
                                </li>
                            )}
                            <li id="change-password">
                                <a onClick={openModal} className="flex py-2 px-2 hover:bg-darkGreen items-center cursor-pointer">
                                    <img className="w-6" src={changePassIcon} alt="change password" />
                                    <span className={`self-center text-sm ml-3 text-nowrap transition-opacity duration-300 ${isCollapsed
                                        ? "opacity-0 delay-0"
                                        : isAnimating
                                            ? "opacity-0"
                                            : "opacity-100 delay-300"
                                        }`}>Change Password</span>
                                </a>
                            </li>
                            <li>
                                <a onClick={openLogoutModal} className="flex py-2 px-2 hover:bg-darkGreen items-center cursor-pointer">
                                    <img className="w-6" src={logoutIcon} alt="logout" />
                                    <span className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                        ? "opacity-0 delay-0"
                                        : isAnimating
                                            ? "opacity-0"
                                            : "opacity-100 delay-300"
                                        }`}>Logout</span>
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
