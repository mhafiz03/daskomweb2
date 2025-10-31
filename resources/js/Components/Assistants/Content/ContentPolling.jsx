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
                <div className="rounded-depth-md border border-depth bg-depth-card px-32 py-2 shadow-depth-md">
                    <h6 className="text-center text-sm font-semibold text-depth-primary">Assistant</h6>
                </div>

                {/* Panggil komponen dropdown */}
                <DropdownPolling onSelectPolling={handleSelectPolling}/>
            </div>

            {/* Table data polling */}
            <div className="">
                {loading ? (
                    <div className="text-center py-4 text-depth-secondary">Loading...</div>
                ) : (
                    <TablePolling data={pollingData} />
                )}
            </div>
        </section>
    );
}
