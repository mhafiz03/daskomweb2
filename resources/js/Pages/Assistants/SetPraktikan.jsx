import ContentSetPraktikan from "@/Components/Assistants/Content/ContentSetPraktikan";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function SetPraktikan() {
    return (
        <AssistantLayout contentClassName="flex-grow md:w-3/4 flex items-center justify-center">
            <ContentSetPraktikan />
        </AssistantLayout>
    );
}
