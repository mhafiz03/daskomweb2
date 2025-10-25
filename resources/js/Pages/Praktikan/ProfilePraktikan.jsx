import { Head } from "@inertiajs/react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import PraktikanCard from "@/Components/Praktikans/Sections/PraktikanCard";
import Clock from "@/Components/Assistants/Common/Clock";
import ModalSoftware from "@/Components/Assistants/Modals/ModalSoftware";
import { usePage } from "@inertiajs/react";

export default function ProfilePraktikan() {
    const { auth } = usePage().props; //data praktikan
    const praktikan = auth.praktikan;

    return (
        <>
            <PraktikanAuthenticated
                praktikan={praktikan}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Dashboard" />

                <PraktikanCard praktikan={praktikan} />
            </PraktikanAuthenticated>
            <Clock />
            <ModalSoftware />
        </>
    );
}
