import { useState } from "react";
import ButtonAddRole from "../Modals/ModalAddRole";
import TableManageRole from "../Tables/TableRole";

export default function ContentManageRole({ asisten }) {
    const [showModal, setShowModal] = useState(false);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <section>
            {/* Button Praktikan - Kelas */}
            <div className="flex gap-4 items-start">
                <div className="border-2 border-darkBrown rounded-md shadow-md">
                    <h6 className="text-md text-darkBrown text-center py-1 font-semibold px-16">
                        Manage Role
                    </h6>
                </div>

                {/* Button Add role */}
                <button
                    onClick={handleOpenModal}
                    className="text-darkBrown text-md font-semibold px-4 py-1 border-2 border-darkBrown rounded-md shadow-md hover:bg-softBrown transition"
                >
                    + Role
                </button>

            </div>

            {/* Table Data role asistant */}
            <div className="">
                <TableManageRole asisten={asisten}/>
            </div>

            {/* Modal Add role */}
            {showModal && <ButtonAddRole onClose={handleCloseModal} />}
        </section>
    );
}
