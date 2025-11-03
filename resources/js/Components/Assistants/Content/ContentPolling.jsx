import { useMemo, useState } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import DropdownPolling from "../Dropdowns/DropdownPolling";
import TablePolling from "../Tables/TablePolling";

export default function ContentPolling() {
    const [pollingData, setPollingData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSelectPolling = (data) => {
        setPollingData(data);
        setLoading(false);
    };

    const toolbarConfig = useMemo(
        () => ({
            title: "Polling Assistant",
        }),
        [],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section>
            <div className="mb-6">
                <DropdownPolling onSelectPolling={handleSelectPolling} />
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
