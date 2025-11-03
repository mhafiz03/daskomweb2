import { useCallback, useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import ButtonAddRole from "../Modals/ModalAddRole";
import TableManageRole from "../Tables/TableRole";

export default function ContentManageRole({ asisten }) {
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpenModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);
    const handleSearchChange = useCallback((event) => setSearchTerm(event.target.value), []);

    const toolbarConfig = useMemo(
        () => ({
            title: "Manage Role",
            actions: [
                {
                    id: "add-role",
                    label: "+ Role",
                    onClick: handleOpenModal,
                },
            ],
            right: (
                <div className="relative min-w-[15rem] max-w-full">
                    <input
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Cari nama, kode, role..."
                        className="w-full rounded-depth-full border border-depth bg-depth-interactive py-2.5 pl-4 pr-11 text-sm text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-depth-secondary">
                        🔍
                    </span>
                </div>
            ),
        }),
        [handleOpenModal, handleSearchChange, searchTerm],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section className="space-y-6 text-depth-primary">
            <TableManageRole
                asisten={asisten}
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
                showSearchInput={false}
            />

            {showModal && <ButtonAddRole onClose={handleCloseModal} />}
        </section>
    );
}
