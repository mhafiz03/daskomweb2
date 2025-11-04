import AssistantLayout from "@/Layouts/AssistantLayout";
import ContentManagePraktikan from "@/Components/Assistants/Content/ContentManagePraktikan";

export default function ManagePraktikan() {
    return (
        <AssistantLayout>
            {({ asisten }) => <ContentManagePraktikan asisten={asisten} />}
        </AssistantLayout>
    );
}
