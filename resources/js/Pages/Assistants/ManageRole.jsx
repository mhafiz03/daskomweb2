import ContentManageRole from "@/Components/Assistants/Content/ContentManageRole";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function ManageRole() {
    return (
        <AssistantLayout
            layoutClassName="relative flex min-h-screen w-full items-start justify-center p-6"
            contentClassName="flex-grow md:w-3/4 mt-4"
        >
            {({ asisten }) => <ContentManageRole asisten={asisten} />}
        </AssistantLayout>
    );
}
