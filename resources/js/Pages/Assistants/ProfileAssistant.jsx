import AssistantCard from "@/Components/Assistants/Buttons/AssistantCard";
import AssistantLayout from "@/Layouts/AssistantLayout";
import { Head } from "@inertiajs/react";

export default function ProfileAssistant() {
    return (
        <AssistantLayout>
            {({ asisten }) => (
                <>
                    <Head title="Profil Asisten" />
                    <div className="flex min-h-full w-full items-center justify-center p-6 mt-[15vh]">
                        <AssistantCard asisten={asisten} />
                    </div>
                </>
            )}
        </AssistantLayout>
    );
}
