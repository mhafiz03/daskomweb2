import { useMemo } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import DropdownKelasRanking from "../Dropdowns/DropdownKelasRanking";
import TableRanking from "../Tables/TableRanking";

export default function ContentRanking() {
    const toolbarConfig = useMemo(
        () => ({
            title: "Ranking Praktikan",
        }),
        [],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section>
            <div className="mb-6">
                <DropdownKelasRanking />
            </div>

            {/* Table data rangking */}
            <div className="">
                <TableRanking />
            </div>
        </section>
    );
}
