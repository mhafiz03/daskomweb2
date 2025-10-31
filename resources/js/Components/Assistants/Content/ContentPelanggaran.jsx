import { useState } from "react";
import ButtonResetPelanggaran from "../Modals/ModalResetPelanggaran";
import TablePelanggaran from "../Tables/TablePelanggaran";

export default function ContentPelanggaran() {
    const [showModalReset, setShowModalReset] = useState(false); 

    const handleOpenModalReset = () => setShowModalReset(true);
    const handleCloseModalReset = () => setShowModalReset(false);

    return (
        <section>
            {/* button pelanggaran */}
            <div className="flex gap-4 items-start">
                <div className="rounded-depth-md border border-depth bg-depth-card px-24 py-2 shadow-depth-md">
                    <h6 className="text-center text-sm font-semibold text-depth-primary">Pelanggaran Assistant</h6>
                </div>

                 {/* Button Reset Plottingan */}
                 <button
                    onClick={handleOpenModalReset}
                    className="mt-0.5 rounded-depth-md border border-red-500/60 bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-400 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                >
                    Reset Pelanggaran
                </button>
            </div>

            {/* Table data pelanggaran */}
            <div className="">
                <TablePelanggaran />
            </div>

            {/* Modal Reset Plottingan */}
                        {showModalReset && <ButtonResetPelanggaran onClose={handleCloseModalReset} />} 
        </section>
    );
}
