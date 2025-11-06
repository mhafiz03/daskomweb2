import { useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import FormSoalInput from "../Forms/FormInputSoal";
import ButtonResetInputSoal from "../Modals/ModalResetInputSoal";

export default function ContentSoal() {
    const [showModalReset, setShowModalReset] = useState(false);

    const handleOpenModalReset = () => setShowModalReset(true);
    const handleCloseModalReset = () => setShowModalReset(false);

    const toolbarConfig = useMemo(
        () => ({
            title: "Manage Soal",
        }),
        [],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section className="space-y-6">

            {/* all dropdown input soal */}
            <div className="mt-4 rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                {/* Panggil komponen dropdown jenis soal */}
                <div className="w-full overflow-y-auto rounded-depth-lg p-6 h-[80vh]">
                    <FormSoalInput />
                </div>
            </div>

            {/* Modal Reset input soal */}
            {/* {showModalReset && <ButtonResetInputSoal onClose={handleCloseModalReset} />} */}
        </section>
    );
}
