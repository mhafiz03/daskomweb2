import { useEffect, useState } from 'react';
import { Link, usePage } from "@inertiajs/react";
import profileIcon from "../../../assets/nav/Icon-Profile.svg";
import praktikumIcon from "../../../assets/nav/Icon-Praktikum.svg";
import nilaiIcon from "../../../assets/nav/Icon-Nilai.svg";
import leaderboardIcon from "../../../assets/nav/Icon-Leaderboard.svg";
import asistenIcon from "../../../assets/nav/Icon-Asisten.svg";
import pollingIcon from "../../../assets/nav/Icon-Polling.svg";
import changePassIcon from "../../../assets/nav/Icon-GantiPassword.svg";
import logoutIcon from "../../../assets/nav/Icon-Logout.svg";
import ModalLogout from './Modals/ModalLogout';
import ModalPassword from './Modals/ModalPassword';
import { updatePassword as updatePraktikanPassword } from "@/actions/App/Http/Controllers/API/PraktikanController";
import { destroy as logoutPraktikan } from "@/actions/App/Http/Controllers/Auth/LoginPraktikanController";

const STORAGE_KEY = 'praktikanNavCollapsed';

const NAV_ITEMS = [
    {
        href: "/praktikan",
        icon: profileIcon,
        label: "Profile",
        alt: "profile",
        paths: ["/praktikan"],
    },
    {
        href: "/praktikum",
        icon: praktikumIcon,
        label: "Praktikum",
        alt: "praktikum",
        paths: ["/praktikum"],
    },
    {
        href: "/score-praktikan",
        icon: nilaiIcon,
        label: "Nilai",
        alt: "nilai",
        paths: ["/score-praktikan"],
    },
    {
        href: "/contact-assistant",
        icon: asistenIcon,
        label: "Asisten",
        alt: "asisten",
        paths: ["/contact-assistant"],
    },
    {
        href: "/polling-assistant",
        icon: pollingIcon,
        label: "Polling",
        alt: "polling",
        paths: ["/polling-assistant"],
    },
];

export default function PraktikanNav({ praktikan }) {
    const { url } = usePage();

    const getInitialCollapsed = () => {
        if (typeof window === 'undefined') {
            return true;
        }
        const stored = window.localStorage.getItem(STORAGE_KEY);
        return stored !== null ? stored === 'true' : true;
    };

    const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

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

    const isActiveItem = (item) => {
        return item.paths?.some((path) => url?.startsWith(path)) ?? false;
    };

    const navLinkBaseClass =
        "group relative flex w-full items-center gap-3 rounded-depth-md px-2 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)] hover:-translate-y-0.5 hover:shadow-depth-md";
    const activeLinkClass =
        "bg-[var(--depth-color-primary)] text-white shadow-depth-md hover:bg-[var(--depth-color-primary)]";
    const inactiveLinkClass = "text-depth-primary hover:bg-depth-interactive";
    const labelVisibilityClass = isCollapsed
        ? "opacity-0 delay-0"
        : isAnimating
        ? "opacity-0"
        : "opacity-100 delay-300";
    const navLabelBaseClass = `text-sm font-medium transition-opacity duration-300 whitespace-nowrap ${labelVisibilityClass}`;
    const navIconClass = "h-6 w-6 flex-shrink-0 transition-opacity duration-300";

    const genericHamburgerLine = `h-1 w-6 my-1 rounded-full bg-white transition ease transform duration-300`;

    return (
        <>
            <nav className="flex h-screen items-center">
                <div
                    className={`mx-2 flex h-[91vh] flex-col rounded-depth-lg border border-depth bg-depth-card shadow-depth-xl transition-all duration-300 ${
                        isCollapsed ? "w-12" : "w-[230px]"
                    }`}
                >
                    <div className={`relative flex items-center ${isCollapsed ? "justify-center" : "justify-end"}`}>
                        <button
                            className="group flex flex-col items-center justify-center p-3"
                            onClick={toggleSidebar}
                            aria-label="Toggle navigation"
                        >
                            <div
                                className={`${genericHamburgerLine} ${
                                    isCollapsed ? "opacity-100" : "translate-y-3 rotate-45"
                                }`}
                            />
                            <div
                                className={`${genericHamburgerLine} ${
                                    isCollapsed ? "opacity-100" : "opacity-0"
                                }`}
                            />
                            <div
                                className={`${genericHamburgerLine} ${
                                    isCollapsed ? "opacity-100" : "-translate-y-3 -rotate-45"
                                }`}
                            />
                        </button>
                    </div>

                    <div className="flex flex-grow flex-col justify-between py-1">
                        {/* Top Navigation Items */}
                        <ul className={`flex flex-col gap-1 py-1 ${isCollapsed ? "px-1" : "px-4"}`}>
                            {NAV_ITEMS.map((item) => {
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

                                return (
                                    <li key={item.href}>
                                        <Link href={item.href} className={linkClasses}>
                                            {isActive && (
                                                <span
                                                    aria-hidden="true"
                                                    className="absolute inset-y-1 translate-x-1 right-1 w-1 rounded-depth-full bg-white/70"
                                                />
                                            )}
                                            <img
                                                className={iconClasses}
                                                src={item.icon}
                                                alt={item.alt}
                                            />
                                            <span className={labelClasses}>{item.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Bottom Navigation Items */}
                        <ul className={`flex flex-col gap-1 py-8 ${isCollapsed ? "px-1" : "px-4"}`}>
                            <li>
                                <button
                                    type="button"
                                    className={`${navLinkBaseClass} ${inactiveLinkClass}`}
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    <img
                                        className={`${navIconClass} opacity-70 group-hover:opacity-100`}
                                        src={changePassIcon}
                                        alt="change password"
                                    />
                                    <span className={`${navLabelBaseClass} text-depth-primary`}>
                                        Change Password
                                    </span>
                                </button>
                            </li>

                            <li>
                                <button
                                    type="button"
                                    className={`${navLinkBaseClass} ${inactiveLinkClass}`}
                                    onClick={() => setShowLogoutModal(true)}
                                >
                                    <img
                                        className={`${navIconClass} opacity-70 group-hover:opacity-100`}
                                        src={logoutIcon}
                                        alt="logout"
                                    />
                                    <span className={`${navLabelBaseClass} text-depth-primary`}>
                                        Logout
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <ModalPassword
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                updatePasswordAction={updatePraktikanPassword}
                userType="praktikan"
            />

            <ModalLogout
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                logoutAction={logoutPraktikan}
                onLogoutSuccess={() => {
                    window.location.href = "/";
                }}
            />
        </>
    );
}
