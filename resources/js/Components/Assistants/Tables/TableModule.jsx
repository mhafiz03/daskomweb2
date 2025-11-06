import { useState } from "react";
import toast from "react-hot-toast";
import ButtonEditModule from "../Modals/ModalEditModule";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import iconPPT from "../../../../assets/practicum/iconPPT.svg";
import iconVideo from "../../../../assets/practicum/iconVideo.svg";
import iconModule from "../../../../assets/practicum/iconModule.svg";
import { useModulesQuery, MODULES_QUERY_KEY } from "@/hooks/useModulesQuery";
import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ModalOverlay } from "@/Components/Common/ModalPortal";
import ModalCloseButton from "@/Components/Common/ModalCloseButton";


export default function TableModule() {
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [moduleToDelete, setModuleToDelete] = useState(null);
    const [selectedModuleId, setSelectedModuleId] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);
    const queryClient = useQueryClient();

    const {
        data: modules = [],
        isLoading: modulesLoading,
        isError: modulesError,
        error: modulesQueryError,
    } = useModulesQuery();

    const handleModuleUpdate = (updatedModule) => {
        queryClient.setQueryData(MODULES_QUERY_KEY, (prev) => {
            if (!Array.isArray(prev)) {
                return prev;
            }

            return prev.map((module) =>
                module.idM === updatedModule.idM ? { ...module, ...updatedModule } : module
            );
        });
    };

    const deleteModuleMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/api-v1/modul/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MODULES_QUERY_KEY });
            toast.success("Modul berhasil dihapus!");
            setIsDeleteModalOpen(false);
            setModuleToDelete(null);
        },
        onError: (err) => {
            const responseMessage = err?.response?.data?.message ?? err?.message ?? "Gagal menghapus modul.";
            toast.error(responseMessage);
            setIsDeleteModalOpen(false);
        },
    });

    const handleOpenModalEdit = (module) => {
        setSelectedModuleId(module.idM);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        setSelectedModuleId(null); // Clear the selected module ID when closing modal
    };

    // Updated delete handler to show confirmation modal
    const handleDeleteClick = (id) => {
        setModuleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // Cancel delete
    const handleCancelDelete = () => {
        setIsDeleteModalOpen(false);
        setModuleToDelete(null);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        if (!moduleToDelete) {
            setIsDeleteModalOpen(false);
            return;
        }

        deleteModuleMutation.mutate(moduleToDelete);
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-4">
            <div className="h-[81vh] overflow-y-auto rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                {modulesLoading ? (
                    <div className="px-6 py-10 text-center text-depth-secondary">Memuat data...</div>
                ) : modulesError ? (
                    <div className="px-6 py-10 text-center text-red-500">
                        {modulesQueryError?.message ?? "Gagal memuat data modul"}
                    </div>
                ) : modules.length === 0 ? (
                    <div className="px-6 py-10 text-center text-depth-secondary">Tidak ada modul yang tersedia.</div>
                ) : (
                    <ul className="divide-y divide-[color:var(--depth-border)]">
                        {modules.map((module, index) => (
                            <li key={`module-${module.idM}-${index}`} className="transition hover:bg-depth-interactive/60">
                                <button
                                    type="button"
                                    onClick={() => toggleAccordion(index)}
                                    className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold text-depth-primary">{module.judul}</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {module.isUnlocked === 0 && (
                                            <span className="rounded-depth-full border border-depth bg-depth-interactive px-2 py-1 text-xs text-depth-secondary">
                                                🔒
                                            </span>
                                        )}
                                        {module.isEnglish === 1 && (
                                            <span className="rounded-depth-full border border-depth bg-depth-interactive px-3 py-1 text-xs font-semibold text-depth-primary">
                                                English
                                            </span>
                                        )}
                                        <span className="text-depth-secondary">{openIndex === index ? "▲" : "▼"}</span>
                                    </div>
                                </button>

                                {openIndex === index && (
                                    <div className="space-y-6 px-6 pb-6">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(module.idM)}
                                                className="inline-flex items-center gap-2 rounded-depth-md border border-red-500/60 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                            >
                                                <img className="h-4 w-4" src={trashIcon} alt="Delete" />
                                                Hapus
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModalEdit(module)}
                                                className="inline-flex items-center gap-2 rounded-depth-md border border-depth bg-depth-interactive px-3 py-2 text-xs font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                            >
                                                <img className="edit-icon-filter h-4 w-4" src={editIcon} alt="Edit" />
                                                Edit
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-semibold uppercase tracking-wide text-depth-secondary">
                                                Pencapaian Pembelajaran
                                            </h4>
                                            <div className="rounded-depth-md border border-depth bg-depth-card p-4 text-sm text-depth-primary shadow-depth-sm">
                                                {module.deskripsi ? (
                                                    <pre className="whitespace-pre-wrap break-words">
                                                        {module.deskripsi}
                                                    </pre>
                                                ) : (
                                                    <p className="italic text-depth-secondary">
                                                        Belum ada poin pembelajaran.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <h5 className="text-sm font-semibold uppercase tracking-wide text-depth-secondary">
                                                Sumber Pembelajaran
                                            </h5>
                                            <div className="grid gap-2 md:grid-cols-3">
                                                <ResourceLink href={module.ppt_link} icon={iconPPT} label="PPT" tone="green" />
                                                <ResourceLink href={module.video_link} icon={iconVideo} label="Video" tone="red" />
                                                <ResourceLink href={module.modul_link} icon={iconModule} label="Modul" tone="blue" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {isModalOpenEdit && (
                <ButtonEditModule
                    onClose={handleCloseModalEdit}
                    modules={modules}
                    selectedModuleId={selectedModuleId}
                    onUpdate={handleModuleUpdate}
                />
            )}

            {isDeleteModalOpen && (
                <ModalOverlay onClose={handleCancelDelete} className="depth-modal-overlay z-50">
                    <div className="depth-modal-container max-w-sm text-center space-y-4">
                        <div className="depth-modal-header justify-center">
                            <h2 className="depth-modal-title">Konfirmasi Hapus</h2>
                            <ModalCloseButton onClick={handleCancelDelete} ariaLabel="Tutup konfirmasi hapus modul" />
                        </div>
                        <p className="text-sm text-depth-secondary">
                            Apakah Anda yakin ingin menghapus modul ini?
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={handleCancelDelete}
                                className="rounded-depth-md border border-depth bg-depth-interactive px-5 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="rounded-depth-md border border-red-500/60 bg-red-500/15 px-5 py-2 text-sm font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
}

function ResourceLink({ href, icon, label, tone }) {
    if (!href) {
        return (
            <span className="rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm text-depth-secondary shadow-depth-sm">
                {label} belum tersedia
            </span>
        );
    }

    const toneBadge = {
        green: "bg-green-500/15 text-green-400",
        red: "bg-red-500/15 text-red-400",
        blue: "bg-blue-500/15 text-blue-400",
    }[tone];

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
        >
            <span className={`flex h-6 w-6 items-center justify-center rounded-depth-full ${toneBadge}`}>
                <img className="h-4 w-4" src={icon} alt={label} />
            </span>
            {label}
        </a>
    );
}
