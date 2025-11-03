import { useMemo } from "react";
import { useAssistantToolbar } from "@/Layouts/AssistantToolbarContext";
import TableHistory from "../Tables/TableHistory";

export default function ContentHistory() {
    const toolbarConfig = useMemo(
        () => ({
            title: "History Praktikum",
        }),
        [],
    );

    useAssistantToolbar(toolbarConfig);

    return (
        <section className="space-y-6 text-depth-primary">
            <TableHistory />
        </section>
    );
}
