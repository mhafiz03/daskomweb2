import { useState } from "react";
import SoalInputForm from "../Forms/FormInputSoal";
import ButtonResetInputSoal from "../Modals/ModalResetInputSoal";

export default function ContentSoal() {
    const [showModalReset, setShowModalReset] = useState(false);

    const handleOpenModalReset = () => setShowModalReset(true);
    const handleCloseModalReset = () => setShowModalReset(false);

    return (
        <section className="space-y-6">
            {/* header input soal */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-depth-lg border border-depth bg-depth-card px-10 py-3 shadow-depth-sm">
                    <h6 className="text-lg font-semibold text-depth-primary">Manage Soal</h6>
                </div>

                {/* Button Reset Plottingan */}
                {/* <button
                    onClick={handleOpenModalReset}
                    className="rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--depth-color-card)]"
                >
                    Reset Soal
                </button> */}
            </div>

            {/* all dropdown input soal */}
            <div className="mt-4 rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                {/* Panggil komponen dropdown jenis soal */}
                <div className="w-full overflow-y-auto rounded-depth-lg p-6 md:h-96 lg:h-[48rem]">
                    <SoalInputForm />
                </div>
            </div>

            {/* Modal Reset input soal */}
            {/* {showModalReset && <ButtonResetInputSoal onClose={handleCloseModalReset} />} */}
        </section>
    );
}
