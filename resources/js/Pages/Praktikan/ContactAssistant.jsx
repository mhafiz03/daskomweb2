import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import ContactAssistantTable from "@/Components/Praktikans/Tables/ContactAssistantTable";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";

export default function ContactAssistant() {
    const { auth } = usePage().props; //data praktikan
    const praktikan = auth.praktikan;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    console.log(praktikan)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <PraktikanAuthenticated
                praktikan={praktikan}
                customWidth="w-[80%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Contact Assistant" />

                <div className="mt-[8vh] flex mx-auto h-screen">
                    <div
                        className={`transition-all duration-300 flex-1 ${isSidebarOpen ? 'ml-[240px]' : 'ml-14'}`}
                    >
                        <ContactAssistantTable />
                    </div>
                </div>
            </PraktikanAuthenticated>
            <PraktikanUtilities />
        </>
    );
}
