import CardAssistant from "@/Components/Assistants/Buttons/CardAssistant";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function ProfileAssistant() {
    return (
        <AssistantLayout contentClassName="flex-grow md:w-3/4 flex items-center justify-center">
            {({ asisten }) => <CardAssistant asisten={asisten} />}
        </AssistantLayout>
    );
}
