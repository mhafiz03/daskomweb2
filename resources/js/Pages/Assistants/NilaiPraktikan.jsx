import ContentNilai from "@/Components/Assistants/Content/ContentNilai";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function NilaiPraktikan() {
    return (
        <AssistantLayout>
            {({ asisten }) => <ContentNilai asisten={asisten} />}
        </AssistantLayout>
    );
}
