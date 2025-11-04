import { Head } from "@inertiajs/react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import LeaderboardTable from "@/Components/Praktikans/Tables/LeaderboardTable";
import PraktikanPageHeader from "@/Components/Praktikans/Common/PraktikanPageHeader";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";

export default function LeaderboardPraktikan({ auth }) {
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
        
                <div className="mt-[8vh] flex flex-col gap-6">
                    <PraktikanPageHeader title="Leaderboard Praktikan" />
                    <div className="relative h-screen">
                        <div className="ml-4 w-[100px] border-2 border-black px-4 py-1 bg-white text-center z-10">
                        Nilai
                    </div>
                </div>
                        <div className="mt-0">
                        <LeaderboardTable />
                    </div>
                </div>
            </PraktikanAuthenticated>
            <PraktikanUtilities />
        </>
    );
}
