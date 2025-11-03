import CardAssistant from "@/Components/Assistants/Buttons/CardAssistant";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function ProfileAssistant() {
    return (
        <AssistantLayout contentClassName="mt-10 flex w-full justify-center">
            {({ asisten }) => <CardAssistant asisten={asisten} />}
        </AssistantLayout>
    );
}
