import { useEffect, useState } from 'react';
import { Link, usePage, router } from "@inertiajs/react";
import profileIcon from "../../../../assets/nav/Icon-Profile.svg";
import praktikumIcon from "../../../../assets/nav/Icon-Praktikum.svg";
import nilaiIcon from "../../../../assets/nav/Icon-Nilai.svg";
import leaderboardIcon from "../../../../assets/nav/Icon-Leaderboard.svg";
import asistenIcon from "../../../../assets/nav/Icon-Asisten.svg";
import pollingIcon from "../../../../assets/nav/Icon-Polling.svg";
import changePassIcon from "../../../../assets/nav/Icon-GantiPassword.svg";
import logoutIcon from "../../../../assets/nav/Icon-Logout.svg";
import ModalLogout from '../Modals/ModalLogout';
import ModalPasswordPraktikan from '../Modals/ModalPasswordPraktikan';

const STORAGE_KEY = 'praktikanNavCollapsed';

export default function PraktikanNav({ praktikan }) {
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
    const [isChangePassSuccess, setIsChangePassSuccess] = useState(false);
    const [isChangePassFailed, setIsChangePassFailed] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const openLogoutModal = () => setShowLogoutModal(true);
    const closeLogoutModal = () => setShowLogoutModal(false);

    const handleLogoutConfirm = () => {
        closeLogoutModal();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsChangePassSuccess(false);
        setIsChangePassFailed(false);
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

    return (
        <>
        <nav className="h-screen flex items-center">
            <div
                className={`flex flex-col h-[91vh] ${isCollapsed ? "w-12" : "w-[230px]"
                    } bg-forestGreen text-left text-white mx-[8px] font-poppins font-bold rounded-md transition-all duration-300`}
            >
                <div className="flex relative items-center">
                    <button
                        className="absolute top-3 right-3 flex flex-col justify-center items-center group"
                        onClick={() => {
                            setIsOpen(!isOpen);
                            toggleSidebar();
                        }}
                    >
                        <div
                            className={`${genericHamburgerLine} bg-white transform transition-all duration-300 ease-in-out ${isOpen
                                    ? "rotate-45 translate-y-3"
                                    : "translate-y-1 group-hover:translate-y-0"
                                }`}
                        />
                        <div
                            className={`${genericHamburgerLine} bg-white transform transition-all duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"
                                }`}
                        />
                        <div
                            className={`${genericHamburgerLine} bg-white transform transition-all duration-300 ease-in-out ${isOpen
                                    ? "-rotate-45 -translate-y-3"
                                    : "-translate-y-1 group-hover:translate-y-0"
                                }`}
                        />
                    </button>
                </div>
                <div className="flex-grow flex flex-col justify-center py-16">
                    <ul className="py-5">
                        <li>
                            <Link
                                href="/praktikan"
                                className="flex py-3 px-3 hover:bg-darkGreen items-center"
                            >
                                <img
                                    className="w-6"
                                    src={profileIcon}
                                    alt="profile"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Profile
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/praktikum"
                                className="flex py-3 px-3 hover:bg-darkGreen items-center"
                            >
                                <img
                                    className="w-6"
                                    src={praktikumIcon}
                                    alt="praktikum"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Praktikum
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/score-praktikan"
                                className="flex py-3 px-3 hover:bg-darkGreen items-center"
                            >
                                <img
                                    className="w-6"
                                    src={nilaiIcon}
                                    alt="nilai"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Nilai
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/leaderboard-praktikan"
                                className="flex py-3 px-3 hover:bg-darkGreen items-center"
                            >
                                <img
                                    className="w-6"
                                    src={leaderboardIcon}
                                    alt="leaderboard"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Leaderboard
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact-assistant"
                                className="flex py-3 px-3 hover:bg-darkGreen items-center"
                            >
                                <img
                                    className="w-6"
                                    src={asistenIcon}
                                    alt="asisten"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Asisten
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/polling-assistant"
                                className="flex py-3 px-3 hover:bg-darkGreen items-center"
                            >
                                <img
                                    className="w-6"
                                    src={pollingIcon}
                                    alt="polling"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Polling
                                </span>
                            </Link>
                        </li>
                        <li>
                            <div
                                className="flex py-3 px-3 hover:bg-darkGreen items-center cursor-pointer"
                                onClick={handleOpenModal}
                            >
                                <img
                                    className="w-6"
                                    src={changePassIcon}
                                    alt="change password"
                                />
                                <span
                                    className={`self-center text-sm ml-3 text-nowrap transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Change Password
                                </span>
                            </div>
                        </li>
                        <li>
                            <div
                                className="flex py-3 px-3 hover:bg-darkGreen items-center cursor-pointer"
                                onClick={openLogoutModal}
                            >
                                <img
                                    className="w-6"
                                    src={logoutIcon}
                                    alt="logout"
                                />
                                <span
                                    className={`self-center text-sm ml-3 transition-opacity duration-300 ${isCollapsed
                                            ? "opacity-0 delay-0"
                                            : isAnimating
                                                ? "opacity-0"
                                                : "opacity-100 delay-300"
                                        }`}
                                >
                                    Logout
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        {isModalOpen && <ModalPasswordPraktikan onClose={closeModal} />}
        {showLogoutModal && (
            <ModalLogout onClose={closeLogoutModal} onConfirm={handleLogoutConfirm} />
        )}
        </>
    );
}
