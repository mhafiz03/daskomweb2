import CardAssistant from "@/Components/Assistants/Buttons/CardAssistant";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function ProfileAssistant() {
    return (
        <AssistantLayout>
            {({ asisten }) => (
                <div className="flex min-h-full w-full items-center justify-center p-6">
                    <CardAssistant asisten={asisten} />
                </div>
            )}
        </AssistantLayout>
    );
}
