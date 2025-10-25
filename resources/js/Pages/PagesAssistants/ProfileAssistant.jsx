import CardAssistant from "@/Components/ComponentsAssistants/CardAssistant";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function ProfileAssistant() {
    return (
        <AssistantLayout contentClassName="flex-grow md:w-3/4 flex items-center justify-center">
            {({ asisten }) => <CardAssistant asisten={asisten} />}
        </AssistantLayout>
    );
}
