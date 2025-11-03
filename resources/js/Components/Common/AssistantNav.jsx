import { useCallback, useMemo, useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import ThemeToggle from "./ThemeToggle";
import Clock from "./Clock";
import ModalPassword from "./Modals/ModalPassword";
import ModalLogout from "./Modals/ModalLogout";
import ModalKonfigurasi from "../Assistants/Modals/ModalKonfigurasi";
import ModalOpenKJ from "../Assistants/Modals/ModalOpenKJ";
import ModalActiveTP from "../Assistants/Modals/ModalActiveTP";
import ModalSoftware from "../Assistants/Modals/ModalSoftware";
import { updatePassword as updateAssistantPassword } from "@/actions/App/Http/Controllers/API/AsistenController";
import { destroy as logoutAsisten } from "@/actions/App/Http/Controllers/Auth/LoginAsistenController";
import { useAssistantToolbarContext } from "@/Layouts/AssistantToolbarContext";

import profileIcon from "../../../assets/nav/Icon-Profile.svg";
import praktikumIcon from "../../../assets/nav/Icon-Praktikum.svg";
import historyIcon from "../../../assets/nav/Icon-History.svg";
import plottingIcon from "../../../assets/nav/Icon-Plotting.svg";
import moduleIcon from "../../../assets/nav/Icon-Module.svg";
import inputSoalIcon from "../../../assets/nav/Icon-InputSoal.svg";
import announcementIcon from "../../../assets/nav/Icon-Annoucement.svg";
import tpModuleIcon from "../../../assets/nav/Icon-TP.svg";
import nilaiIcon from "../../../assets/nav/Icon-Nilai.svg";
import roleIcon from "../../../assets/nav/Icon-Piket.svg";
import jawabanTP from "../../../assets/nav/Icon-Rating.svg";
import pelanggaranIcon from "../../../assets/nav/Icon-Pelanggaran.svg";
import pollingIcon from "../../../assets/nav/Icon-Polling.svg";
import praktikanIcon from "../../../assets/nav/Icon-Praktikan.svg";
import auditIcon from "../../../assets/nav/Icon-Audit.svg";
import changePassIcon from "../../../assets/nav/Icon-GantiPassword.svg";
import logoutIcon from "../../../assets/nav/Icon-Logout.svg";
import konfigurasiIcon from "../../../assets/nav/Icon-Konfigurasi.svg";

const adminRoles = ["SOFTWARE", "KORDAS", "WAKORDAS", "ADMIN"];

export default function AssisstantNav({ asisten, permission_name = [], roleName }) {
    const { url, component } = usePage();
    const { toolbar } = useAssistantToolbarContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showOpenKJ, setShowOpenKJ] = useState(false);
    const [showOpenTP, setShowOpenTP] = useState(false);
    const [openGroup, setOpenGroup] = useState(null);

    const permissionSet = new Set(permission_name);
    const normalizedRole = roleName?.toUpperCase() ?? null;

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

    const isRoleAllowed = (allowedRoles) => {
        if (!allowedRoles || allowedRoles.length === 0) {
            return true;
        }

        if (!normalizedRole) {
            return false;
        }

        return allowedRoles.map((role) => role.toUpperCase()).includes(normalizedRole);
    };

    const hasPermission = (permission) => {
        if (!permission || permission.length === 0) {
            return true;
        }

        const requiredPermissions = Array.isArray(permission) ? permission : [permission];
        return requiredPermissions.some((required) => permissionSet.has(required));
    };

    const canAccess = (permission, allowedRoles) => hasPermission(permission) && isRoleAllowed(allowedRoles);

    const isActiveItem = useCallback((item) => {
        if (!item.href) {
            return false;
        }

        const matchesComponent = item.components?.some((name) => component === name);
        const matchesPath = item.paths?.some((path) => url?.startsWith(path));

        return Boolean(matchesComponent || matchesPath);
    }, [component, url]);

    const navGroups = [
        {
            id: "praktikum",
            label: "Praktikum",
            items: [
                {
                    id: "start-praktikum",
                    label: "Start Praktikum",
                    href: "/start-praktikum",
                    permission: "see-history",
                    icon: praktikumIcon,
                    components: ["Assistants/StartPraktikum"],
                    paths: ["/start-praktikum"],
                },
                {
                    id: "history-praktikum",
                    label: "History Praktikum",
                    href: "/history",
                    permission: "see-history",
                    icon: historyIcon,
                    components: ["Assistants/HistoryPraktikum"],
                    paths: ["/history"],
                },
                {
                    id: "plotting-jadwal",
                    label: "Plotting Jadwal",
                    href: "/plottingan",
                    permission: "see-plot",
                    icon: plottingIcon,
                    components: ["Assistants/PlottingAssistant"],
                    paths: ["/plottingan"],
                },
                {
                    id: "configuration",
                    label: "Configuration",
                    type: "action",
                    permission: "lms-configuration",
                    allowedRoles: adminRoles,
                    icon: konfigurasiIcon,
                    onSelect: openConfigModal,
                },
            ],
        },
        {
            id: "materi",
            label: "Materi",
            items: [
                {
                    id: "manage-modul",
                    label: "Manage Modul",
                    href: "/modul",
                    permission: "manage-modul",
                    icon: moduleIcon,
                    components: ["Assistants/ModulePraktikum"],
                    paths: ["/modul"],
                },
                {
                    id: "manage-soal",
                    label: "Manage Soal",
                    href: "/soal",
                    permission: "manage-soal",
                    icon: inputSoalIcon,
                    components: ["Assistants/SoalPraktikum"],
                    paths: ["/soal"],
                },
                {
                    id: "open-jawaban",
                    label: "Open Jawaban",
                    type: "action",
                    permission: "unlock-jawaban",
                    allowedRoles: adminRoles,
                    icon: announcementIcon,
                    onSelect: openOpenKJModal,
                },
                {
                    id: "tugas-pendahuluan",
                    label: "Tugas Pendahuluan",
                    type: "action",
                    permission: "check-tugas-pendahuluan",
                    allowedRoles: adminRoles,
                    icon: tpModuleIcon,
                    onSelect: openOpenTPModal,
                },
            ],
        },
        {
            id: "praktikan",
            label: "Praktikan",
            items: [
                {
                    id: "nilai-praktikan",
                    label: "Nilai Praktikan",
                    href: "/nilai-praktikan",
                    permission: "nilai-praktikan",
                    icon: nilaiIcon,
                    components: ["Assistants/NilaiPraktikan"],
                    paths: ["/nilai-praktikan"],
                },
                {
                    id: "set-praktikan",
                    label: "Set Praktikan",
                    href: "/set-praktikan",
                    permission: "set-praktikan",
                    icon: roleIcon,
                    components: ["Assistants/SetPraktikan"],
                    paths: ["/set-praktikan"],
                },
                {
                    id: "lihat-tp",
                    label: "Lihat TP",
                    href: "/lihat-tp",
                    permission: "check-tugas-pendahuluan",
                    icon: jawabanTP,
                    components: ["Assistants/LihatTP", "Assistants/ResultLihatTP"],
                    paths: ["/lihat-tp", "/jawaban-tp"],
                },
            ],
        },
        {
            id: "asisten",
            label: "Asisten",
            items: [
                {
                    id: "manage-role",
                    label: "Manage Role",
                    href: "/manage-role",
                    permission: "manage-role",
                    allowedRoles: adminRoles,
                    icon: praktikanIcon,
                    components: ["Assistants/ManageRole"],
                    paths: ["/manage-role"],
                },
                {
                    id: "pelanggaran",
                    label: "Pelanggaran",
                    href: "/pelanggaran",
                    permission: "see-pelanggaran",
                    icon: pelanggaranIcon,
                    components: ["Assistants/PelanggaranAssistant"],
                    paths: ["/pelanggaran"],
                },
                {
                    id: "polling-assistant",
                    label: "Polling Assistant",
                    href: "/polling",
                    permission: "see-polling",
                    icon: pollingIcon,
                    components: ["Assistants/PollingAssistant"],
                    paths: ["/polling"],
                },
                {
                    id: "audit-logs",
                    label: "Audit Logs",
                    href: "/audit-logs",
                    permission: "manage-role",
                    allowedRoles: adminRoles,
                    icon: auditIcon,
                    components: ["Assistants/AuditLogs"],
                    paths: ["/audit-logs"],
                },
            ],
        },
        {
            id: "profile",
            label: "Profile",
            items: [
                {
                    id: "profile",
                    label: "Profile",
                    href: "/assistant",
                    permission: "manage-profile",
                    icon: profileIcon,
                    components: ["Assistants/ProfileAssistant"],
                    paths: ["/assistant"],
                },
                {
                    id: "change-password",
                    label: "Change Password",
                    type: "action",
                    icon: changePassIcon,
                    onSelect: openModal,
                },
                {
                    id: "logout",
                    label: "Logout",
                    type: "action",
                    icon: logoutIcon,
                    onSelect: openLogoutModal,
                },
            ],
        },
    ];

    const accessibleGroups = navGroups
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => canAccess(item.permission, item.allowedRoles)),
        }))
        .filter((group) => group.items.length > 0);

    const flatAccessibleItems = useMemo(
        () =>
            accessibleGroups.flatMap((group) =>
                group.items.map((item) => ({
                    item,
                    group,
                })),
            ),
        [accessibleGroups],
    );

    const currentNavItemEntry = useMemo(
        () => flatAccessibleItems.find(({ item }) => isActiveItem(item)),
        [flatAccessibleItems, isActiveItem],
    );

    const fallbackTitle = useMemo(() => {
        if (!component) {
            return "Assistant";
        }

        const segment = component.split("/").pop() ?? component;
        return segment
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/[-_]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }, [component]);

    const toolbarActions = useMemo(() => {
        if (!toolbar || !toolbar.actions) {
            return [];
        }

        return Array.isArray(toolbar.actions) ? toolbar.actions : [toolbar.actions];
    }, [toolbar]);

    const navTitle = toolbar?.title ?? currentNavItemEntry?.item?.label ?? fallbackTitle;

    const triggerBaseClass =
        "inline-flex h-10 items-center gap-2 rounded-depth-md px-4 text-sm font-semibold text-depth-primary transition hover:-translate-y-1 hover:bg-depth-interactive hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)]";

    const menuContentBaseClass =
        "pointer-events-none absolute left-1/2 top-full z-40 w-full -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:pointer-events-auto";

    const menuSurfaceClass =
        "w-full rounded-depth-lg border border-depth bg-depth-card p-5 shadow-depth-lg md:p-6";

    const renderMenuItem = (item, closeMenu, { containerClass = "" } = {}) => {
        const isActive = isActiveItem(item);
        const baseClass = `group flex h-full w-full transform items-center justify-start gap-3 rounded-depth-lg border border-depth px-5 py-3 text-left text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)] ${
            isActive
                ? "bg-[var(--depth-color-primary)] text-white shadow-depth-lg"
                : "bg-depth-card/95 text-depth-primary hover:-translate-y-0.5 hover:border-depth hover:bg-depth-interactive hover:text-depth-primary hover:shadow-depth-md"
        }`;

        const iconClass = `h-6 w-6 flex-shrink-0 transition-opacity ${
            isActive ? "opacity-100 nav-icon-filter-active" : "opacity-80 nav-icon-filter group-hover:opacity-100"
        }`;

        if (item.type === "action") {
            return (
                <li key={item.id} className={containerClass}>
                    <button
                        type="button"
                        onClick={() => {
                            item.onSelect?.();
                            closeMenu();
                        }}
                        className={baseClass}
                    >
                        <img src={item.icon} alt={item.label} className={iconClass} />
                        <span>{item.label}</span>
                    </button>
                </li>
            );
        }

        return (
            <li key={item.id} className={`w-full ${containerClass}`}>
                <Link
                    href={item.href}
                    className={baseClass}
                    onClick={() => {
                        closeMenu();
                    }}
                >
                    <img src={item.icon} alt={item.label} className={iconClass} />
                    <span>{item.label}</span>
                </Link>
            </li>
        );
    };

    const renderToolbarAction = (action) => {
        if (!action || !action.label) {
            return null;
        }

        const { label, href, onClick, icon, variant = "secondary", id, disabled = false } = action;
        const actionKey = id ?? `${label}-${href ?? "action"}`;

        const baseButtonClass = "inline-flex items-center gap-2 rounded-depth-md border px-3 py-2 text-xs font-semibold shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--depth-color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--depth-color-background)] md:text-sm";

        const variantClass =
            variant === "primary"
                ? "border-transparent bg-[var(--depth-color-primary)] text-white"
                : variant === "danger"
                ? "border-red-500/60 bg-red-500/15 text-red-500"
                : "border-depth bg-depth-interactive text-depth-primary";

        const disabledClass = disabled ? "pointer-events-none opacity-60" : "";

        const content = (
            <>
                {icon ? <span className="text-lg leading-none">{icon}</span> : null}
                <span>{label}</span>
            </>
        );

        if (href) {
            return (
                <Link key={actionKey} href={href} className={`${baseButtonClass} ${variantClass} ${disabledClass}`}>
                    {content}
                </Link>
            );
        }

        return (
            <button
                key={actionKey}
                type="button"
                onClick={onClick}
                disabled={disabled}
                className={`${baseButtonClass} ${variantClass} ${disabledClass}`}
            >
                {content}
            </button>
        );
    };

    const handleGroupBlur = (event, groupId) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setOpenGroup((current) => (current === groupId ? null : current));
        }
    };

    return (
        <>
            <nav className="relative z-30 flex w-full justify-center px-4">
                <div className="glass-surface w-full max-w-full rounded-depth-lg border border-depth bg-depth-card/80 px-6 py-4 shadow-depth-lg backdrop-blur">
                    <div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,auto)_minmax(0,1fr)] md:items-center md:gap-6">
                        <div className="order-1 flex flex-wrap items-center gap-3">
                            <div className="px-5 py-2">
                                <h1 className="text-base font-semibold text-depth-primary md:text-lg">{navTitle}</h1>
                            </div>
                            {toolbarActions.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    {toolbarActions.map((action) => renderToolbarAction(action))}
                                </div>
                            )}
                        </div>

                        <div className="order-2 w-full md:justify-self-center">
                            <ul className="flex flex-wrap items-center justify-center gap-5" role="menubar">
                                {accessibleGroups.map((group) => {
                                    const groupHasActiveItem = group.items.some((item) => isActiveItem(item));
                                    const isGroupOpen = openGroup === group.id;
                                    const triggerClass = `${triggerBaseClass} ${
                                        groupHasActiveItem || isGroupOpen
                                            ? "bg-[var(--depth-color-primary)] text-white shadow-depth-md"
                                            : "text-depth-primary hover:bg-depth-interactive"
                                    }`;
                                    const menuVisibilityClass = isGroupOpen
                                        ? "pointer-events-auto translate-y-0 opacity-100"
                                        : "";
                                    const isPraktikanGroup = group.id === "praktikan";
                                    const isProfileGroup = group.id === "profile";
                                    const listLayoutClass = isPraktikanGroup
                                        ? "grid grid-cols-1 gap-1.5"
                                        : isProfileGroup
                                        ? "flex flex-col gap-1.5"
                                        : "grid grid-cols-1 gap-1.5";

                                    return (
                                        <li
                                            key={group.id}
                                            className="group relative"
                                            onMouseEnter={() => setOpenGroup(group.id)}
                                            onMouseLeave={() => setOpenGroup(null)}
                                            onFocus={() => setOpenGroup(group.id)}
                                            onBlur={(event) => handleGroupBlur(event, group.id)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Escape") {
                                                    setOpenGroup(null);
                                                }
                                            }}
                                        >
                                            <button
                                                type="button"
                                                className={triggerClass}
                                                aria-haspopup="true"
                                                aria-expanded={isGroupOpen}
                                                onClick={() => {
                                                    setOpenGroup((current) => (current === group.id ? null : group.id));
                                                }}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Escape") {
                                                        event.preventDefault();
                                                        setOpenGroup(null);
                                                    }
                                                }}
                                            >
                                                {group.label}
                                            </button>
                                            <div
                                                className={`${menuContentBaseClass} ${menuVisibilityClass} ${
                                                    isProfileGroup ? "max-w-sm" : "max-w-3xl"
                                                }`}
                                                role="menu"
                                            >
                                                <div
                                                    className={`${menuSurfaceClass} ${
                                                        isProfileGroup
                                                            ? "min-w-[16rem]"
                                                            : isPraktikanGroup
                                                            ? "min-w-[32rem]"
                                                            : "min-w-[18rem]"
                                                    }`}
                                                >
                                                    <ul className={listLayoutClass} data-group={group.id}>
                                                        {group.items.map((item, index) =>
                                                            renderMenuItem(item, () => setOpenGroup(null), {
                                                                containerClass: isPraktikanGroup
                                                                    ? index === 0
                                                                        ? "md:row-span-2 md:h-full"
                                                                        : "md:col-start-2"
                                                                    : isProfileGroup
                                                                    ? ""
                                                                    : "",
                                                            }),
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div className="order-3 flex items-center justify-end gap-3 md:justify-self-end">
                            <ThemeToggle storageKey="assistant-theme" />
                            {/* <ModalSoftware className="flex h-10 w-10" roleName={roleName} /> */}
                            {/* <Clock className="hidden rounded-depth-lg border border-depth bg-depth-interactive px-4 py-2.5 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:shadow-depth-md md:flex" /> */}
                        </div>
                    </div>
                </div>
            </nav>

            {isModalOpen && (
                <ModalPassword
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    updatePasswordAction={updateAssistantPassword}
                    userType="asisten"
                />
            )}
            {showLogoutModal && (
                <ModalLogout
                    isOpen={showLogoutModal}
                    onClose={closeLogoutModal}
                    logoutAction={logoutAsisten}
                    onLogoutSuccess={() => {
                        window.location.href = "/";
                    }}
                />
            )}
            {showConfigModal && <ModalKonfigurasi onClose={closeConfigModal} />}
            {showOpenKJ && <ModalOpenKJ onClose={closeOpenKJModal} />}
            {showOpenTP && <ModalActiveTP onClose={closeOpenTPModal} />}
        </>
    );
}
