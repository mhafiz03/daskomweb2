import ContentManageRole from "@/Components/ComponentsAssistants/ContentManageRole";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function ManageRole() {
    return (
        <AssistantLayout>
            {({ asisten }) => <ContentManageRole asisten={asisten} />}
        </AssistantLayout>
    );
}
