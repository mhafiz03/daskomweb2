import { useEffect, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ModalPasswordAssistant from '../Modals/ModalPasswordAssistant';
import ModalLogout from '../Modals/ModalLogout';
import ModalKonfigurasi from '../Modals/ModalKonfigurasi';
import ModalOpenKJ from '../Modals/ModalOpenKJ';
import ModalActiveTP from "../Modals/ModalActiveTP";

import profileIcon from "../../../../assets/nav/Icon-Profile.svg";
import praktikumIcon from "../../../../assets/nav/Icon-Praktikum.svg";
import nilaiIcon from "../../../../assets/nav/Icon-Nilai.svg";
import historyIcon from "../../../../assets/nav/Icon-History.svg";
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
    const { url, component } = usePage();


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
    const genericHamburgerLine =
        "h-1 w-6 my-1 rounded-full bg-[var(--depth-text-primary)] transition ease transform duration-300";

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

    const navItems = [
        {
            id: "manage-profile",
            permission: "manage-profile",
            href: "/assistant",
            label: "Profile",
            icon: profileIcon,
            components: ["Assistants/ProfileAssistant"],
            paths: ["/assistant"],
        },
        {
            id: "manage-praktikum",
            permission: "see-history",
            href: "/start-praktikum",
            label: "Start Praktikum",
            icon: praktikumIcon,
            components: ["Assistants/StartPraktikum"],
            paths: ["/start-praktikum"],
        },
        {
            id: "see-history",
            permission: "see-history",
            href: "/history",
            label: "History Praktikum",
            icon: historyIcon,
            components: ["Assistants/HistoryPraktikum"],
            paths: ["/history"],
        },
        {
            id: "nilai-praktikan",
            permission: "nilai-praktikan",
            href: "/nilai-praktikan",
            label: "Nilai Praktikan",
            icon: nilaiIcon,
            components: ["Assistants/NilaiPraktikan"],
            paths: ["/nilai-praktikan"],
        },
        {
            id: "manage-modul",
            permission: "manage-modul",
            href: "/modul",
            label: "Manage Modul",
            icon: moduleIcon,
            components: ["Assistants/ModulePraktikum"],
            paths: ["/modul"],
        },
        {
            id: "see-soal",
            permission: "manage-soal",
            href: "/soal",
            label: "Input Soal",
            icon: inputSoalIcon,
            components: ["Assistants/SoalPraktikum"],
            paths: ["/soal"],
        },
        {
            id: "ranking-praktikan",
            permission: "see-ranking",
            href: "/ranking",
            label: "Ranking Praktikan",
            icon: rankingIcon,
            components: ["Assistants/RankingPraktikan"],
            paths: ["/ranking"],
        },
        {
            id: "see-polling",
            permission: "see-polling",
            href: "/polling",
            label: "Polling Assistant",
            icon: pollingIcon,
            components: ["Assistants/PollingAssistant"],
            paths: ["/polling"],
        },
        {
            id: "see-plot",
            permission: "see-plot",
            href: "/plottingan",
            label: "Plotting Jadwal",
            icon: plottingIcon,
            components: ["Assistants/PlottingAssistant"],
            paths: ["/plottingan"],
        },
        {
            id: "set-praktikan",
            permission: "set-praktikan",
            href: "/set-praktikan",
            label: "Set Praktikan",
            icon: roleIcon,
            components: ["Assistants/SetPraktikan"],
            paths: ["/set-praktikan"],
        },
        {
            id: "see-pelanggaran",
            permission: "see-pelanggaran",
            href: "/pelanggaran",
            label: "Pelanggaran",
            icon: pelanggaranIcon,
            components: ["Assistants/PelanggaranAssistant"],
            paths: ["/pelanggaran"],
        },
        {
            id: "manage-role",
            permission: "manage-role",
            allowedRoles: adminRoles,
            href: "/manage-role",
            label: "Manage Role",
            icon: praktikanIcon,
            components: ["Assistants/ManageRole"],
            paths: ["/manage-role"],
        },
        {
            id: "check-tugas-pendahuluan",
            permission: "check-tugas-pendahuluan",
            href: "/lihat-tp",
            label: "Lihat TP",
            icon: jawabanTP,
            components: ["Assistants/LihatTP", "Assistants/ResultLihatTP"],
            paths: ["/lihat-tp", "/jawaban-tp"],
        },
    ];

    const navLinkBaseClass =
        "group relative flex w-full items-center gap-3 rounded-depth-md px-2 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)] hover:-translate-y-0.5 hover:shadow-depth-md";
    const activeLinkClass =
        "bg-[var(--depth-color-primary)] text-white shadow-depth-md hover:bg-[var(--depth-color-primary)]";
    const inactiveLinkClass = "text-depth-primary hover:bg-depth-interactive";
    const labelVisibilityClass = ''; isCollapsed
        ? "opacity-0 delay-0"
        : isAnimating
        ? "opacity-0"
        : "opacity-100 delay-300";
    const navLabelBaseClass = `text-sm font-medium transition-opacity duration-300 whitespace-nowrap ${labelVisibilityClass}`;
    const navIconClass = "h-6 w-6 flex-shrink-0 transition-opacity duration-300";

    const isActiveItem = (item) => {
        const matchesComponent = item.components?.some((name) => component === name);
        const matchesPath = item.paths?.some((path) => url?.startsWith(path));

        return Boolean(matchesComponent || matchesPath);
    };

    return (
        <>
            <nav className="h-screen fixed top-0 left-0 flex items-start">
                <div
                    className={`flex h-[91vh] flex-col ${
                        isCollapsed ? "w-12" : "w-[260px]"
                    } border border-depth bg-depth-card text-left text-depth-primary font-depth font-semibold shadow-depth-lg transition-all duration-300 mx-[8px] my-[27px] rounded-depth-lg`}
                >
                    <div className="relative flex h-12 items-center justify-end">
                        <button
                            type="button"
                            className="group flex flex-col items-center justify-center p-2 transition mr-0.5"
                            onClick={() => {
                                setIsOpen(!isOpen);
                                toggleSidebar();
                            }}
                        >
                            <div
                                className={`${genericHamburgerLine} transform transition-all duration-300 ease-in-out ${
                                    isOpen ? "rotate-45 translate-y-3" : "translate-y-1 group-hover:translate-y-0"
                                }`}
                            />
                            <div
                                className={`${genericHamburgerLine} transform transition-all duration-300 ease-in-out ${
                                    isOpen ? "opacity-0" : "opacity-100"
                                }`}
                            />
                            <div
                                className={`${genericHamburgerLine} transform transition-all duration-300 ease-in-out ${
                                    isOpen
                                        ? "-rotate-45 -translate-y-3"
                                        : "-translate-y-1 group-hover:translate-y-0"
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden scrollbar-hidden scroll-smooth pt-1">
                        <ul className={`flex flex-col gap-1 py-2 ${isCollapsed ? "px-1" : "px-4"}`}>
                            {navItems.map((item) => {
                                if (!canAccess(item.permission, item.allowedRoles)) {
                                    return null;
                                }

                                const isActive = isActiveItem(item);
                                const linkClasses = `${navLinkBaseClass} ${
                                    isActive ? activeLinkClass : inactiveLinkClass
                                }`;
                                const iconClasses = `${navIconClass} ${
                                    isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                                }`;
                                const labelClasses = `${navLabelBaseClass} ${
                                    isActive ? "text-white" : "text-depth-primary"
                                }`;
                                const altText = item.alt ?? item.label.toLowerCase();

                                return (
                                    <li key={item.id} id={item.id}>
                                        <Link href={item.href} className={linkClasses}>
                                            {isActive && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute inset-y-1 left-1 w-1 rounded-depth-full bg-white/70"
                                                />
                                            )}
                                            <img className={iconClasses} src={item.icon} alt={altText} />
                                            <span className={labelClasses}>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                            {canAccess("unlock-jawaban", adminRoles) && (
                                <li id="unlock-jawaban">
                                    <button
                                        type="button"
                                        onClick={openOpenKJModal}
                                        className={`${navLinkBaseClass} ${inactiveLinkClass}`}
                                    >
                                        <img
                                            className={`${navIconClass} opacity-80 group-hover:opacity-100`}
                                            src={announcementIcon}
                                            alt="open jawaban"
                                        />
                                        <span className={`${navLabelBaseClass} text-depth-primary`}>Open Jawaban</span>
                                    </button>
                                </li>
                            )}
                        </ul>

                        <ul className={`mt-auto flex flex-col gap-1 py-2 ${isCollapsed ? "px-1" : "px-4"}`}>
                            {/* Bagian Pengaturan dan Logout */}
                            {canAccess("lms-configuration", adminRoles) && (
                                <li id="config">
                                    <button
                                        type="button"
                                        onClick={openConfigModal}
                                        className={`${navLinkBaseClass} ${inactiveLinkClass}`}
                                    >
                                        <img
                                            className={`${navIconClass} opacity-80 group-hover:opacity-100`}
                                            src={tpModuleIcon}
                                            alt="configuration"
                                        />
                                        <span className={`${navLabelBaseClass} text-depth-primary`}>Configuration</span>
                                    </button>
                                </li>
                            )}
                            <li id="change-password">
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className={`${navLinkBaseClass} ${inactiveLinkClass}`}
                                >
                                    <img
                                        className={`${navIconClass} opacity-80 group-hover:opacity-100`}
                                        src={changePassIcon}
                                        alt="change password"
                                    />
                                    <span className={`${navLabelBaseClass} text-depth-primary text-nowrap`}>
                                        Change Password
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={openLogoutModal}
                                    className={`${navLinkBaseClass} ${inactiveLinkClass}`}
                                >
                                    <img
                                        className={`${navIconClass} opacity-80 group-hover:opacity-100`}
                                        src={logoutIcon}
                                        alt="logout"
                                    />
                                    <span className={`${navLabelBaseClass} text-depth-primary`}>Logout</span>
                                </button>
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
