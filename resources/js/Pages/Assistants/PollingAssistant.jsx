import ContentPolling from "@/Components/Assistants/Content/ContentPolling";
import AssistantLayout from "@/Layouts/AssistantLayout";
import { Head } from "@inertiajs/react";

export default function PollingAssistant() {
    return (
        <AssistantLayout>
            <Head title="Polling Assistant" />
            <ContentPolling />
        </AssistantLayout>
    );
}
