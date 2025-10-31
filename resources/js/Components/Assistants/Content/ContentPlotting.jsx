import { useState } from "react";
import ButtonAddPlotting from "../Modals/ModalAddPlottingan";
// import ButtonResetPlotting from "../Modals/ModalResetPlottingan";
import TablePlottingan from "../Tables/TablePlottingan";

export default function ContentPlottingan() {
    const [showModal, setShowModal] = useState(false);
    const [showModalReset, setShowModalReset] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenModalReset = () => setShowModalReset(true);
    const handleCloseModalReset = () => setShowModalReset(false);

    return (
        <section className="space-y-6 text-depth-primary">
            <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-depth-lg border border-depth bg-depth-card px-10 py-3 shadow-depth-sm">
                    <h6 className="text-lg font-semibold text-depth-primary">Plotting Jadwal Assistant</h6>
                </div>

                <button
                    type="button"
                    onClick={handleOpenModal}
                    className="rounded-depth-md border border-depth bg-depth-interactive px-4 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                >
                    + Jadwal
                </button>

                {/* <button
                    type="button"
                    onClick={handleOpenModalReset}
                    className="rounded-depth-md border border-red-400/50 bg-red-400/15 px-4 py-2 text-sm font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                >
                    Reset Plottingan
                </button> */}
            </div>

            <TablePlottingan />

            {showModal && <ButtonAddPlotting onClose={handleCloseModal} />}

            {showModalReset && <ButtonResetPlotting onClose={handleCloseModalReset} />}
        </section>
    );
}
