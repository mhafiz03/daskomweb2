import { useCallback, useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import ButtonAddModule from "../Modals/ModalAddModule";
import TableModule from "../Tables/TableModule";

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
            <TableModule />

            {showModal && <ButtonAddModule onClose={handleCloseModal} />}
        </section>
    );
}
