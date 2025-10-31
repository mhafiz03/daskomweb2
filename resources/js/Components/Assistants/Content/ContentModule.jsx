import { useState } from "react";
import ButtonAddModule from "../Modals/ModalAddModule";
import TableModule from "../Tables/TableModule";

export default function ContentModule() {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <section className="space-y-6 text-depth-primary">
            <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-depth-lg border border-depth bg-depth-card px-10 py-3 shadow-depth-sm">
                    <h6 className="text-lg font-semibold text-depth-primary">Modul Praktikum</h6>
                </div>

                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="rounded-depth-md border border-depth bg-depth-interactive px-4 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                >
                    + Modul
                </button>
            </div>

            <TableModule />

            {showModal && <ButtonAddModule onClose={handleCloseModal} />}
        </section>
    );
}
