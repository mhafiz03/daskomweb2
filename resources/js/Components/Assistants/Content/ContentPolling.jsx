import { useState } from "react";
import DropdownPolling from "../Dropdowns/DropdownPolling";
import TablePolling from "../Tables/TablePolling";

export default function ContentPolling() {
    const [pollingData, setPollingData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSelectPolling = (data) => {
        setPollingData(data);
        setLoading(false);
    };

    return (
        <section>
            {/* button praktikan - kelas */}
            <div className="flex gap-4 items-start">
                <div className="border-2 border-darkBrown rounded-md shadow-md ">
                    <h6 className="text-md text-darkBrown text-center py-1 font-semibold px-32">Assistant</h6>
                </div>

                {/* Panggil komponen dropdown */}
                <DropdownPolling onSelectPolling={handleSelectPolling}/>
            </div>

            {/* Table data polling */}
            <div className="">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <TablePolling data={pollingData} />
                )}
            </div>
        </section>
    );
}
