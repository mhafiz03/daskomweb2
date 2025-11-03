import { useCallback, useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import ButtonAddRole from "../Modals/ModalAddRole";
import TableManageRole from "../Tables/TableRole";

export default function ContentManageRole({ asisten }) {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = useCallback(() => setShowModal(true), []);
    const handleCloseModal = useCallback(() => setShowModal(false), []);

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
        }),
        [handleOpenModal],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section className="space-y-6 text-depth-primary">
            <TableManageRole asisten={asisten} />

            {showModal && <ButtonAddRole onClose={handleCloseModal} />}
        </section>
    );
}
