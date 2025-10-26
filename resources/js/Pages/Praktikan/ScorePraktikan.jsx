import { Head } from "@inertiajs/react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import Clock from "@/Components/Assistants/Common/Clock";
import ModalSoftware from "@/Components/Assistants/Modals/ModalSoftware";
import ScoreTable from "@/Components/Praktikans/Tables/ScoreTable";

export default function ScorePraktikan({ auth }) {
    return (
        <>
            <PraktikanAuthenticated
                user={auth?.user ?? auth?.praktikan ?? null}
                praktikan={auth?.praktikan ?? auth?.user ?? null}
                customWidth="w-[65%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Leaderboard Praktikan" />
        
                <div className="relative mt-[12vh] h-screen">
                    <div className="mt-0">
                        <ScoreTable />
                    </div>
                </div>
            </PraktikanAuthenticated>
            <Clock />
            <ModalSoftware />
        </>
    );
}
