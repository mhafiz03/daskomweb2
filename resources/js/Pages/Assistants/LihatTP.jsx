import FormLihatTP from "@/Components/Assistants/Forms/FormLihatTP";
import AssistantLayout from "@/Layouts/AssistantLayout";

export default function LihatTP() {
    return (
        <AssistantLayout contentClassName="flex-grow md:w-3/4 flex items-center justify-center">
            <FormLihatTP />
        </AssistantLayout>
    );
}
