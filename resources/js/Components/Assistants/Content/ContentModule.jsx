import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";

const ButtonAddModule = lazy(() => import("../Modals/ModalAddModule"));
const TableModule = lazy(() => import("../Tables/TableModule"));

export default function ContentModule() {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

    const toolbarConfig = useMemo(
        () => ({
            title: "Modul Praktikum",
            actions: [
                {
                    id: "add-module",
                    label: "+ Modul",
                    onClick: handleOpenModal,
                },
            ],
        }),
        [handleOpenModal],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section className="space-y-6 text-depth-primary">
            <Suspense fallback={<div className="text-sm text-depth-secondary">Memuat daftar modul...</div>}>
                <TableModule />
            </Suspense>

            {showModal && (
                <Suspense fallback={null}>
                    <ButtonAddModule onClose={handleCloseModal} />
                </Suspense>
            )}
        </section>
    );
}
