import ContentSoal from "@/Components/Assistants/Content/ContentSoal";
import AssistantLayout from "@/Layouts/AssistantLayout";
import { Head } from "@inertiajs/react";

export default function SoalPraktikum() {
    return (
        <AssistantLayout>
            <Head title="Soal Praktikum" />
            <ContentSoal />
        </AssistantLayout>
    );
}
