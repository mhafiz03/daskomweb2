import { Head } from "@inertiajs/react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import ScoreTable from "@/Components/Praktikans/Tables/ScoreTable";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";

export default function ScorePraktikan({ auth }) {
    return (
        <>
            <PraktikanAuthenticated
                user={auth?.user ?? auth?.praktikan ?? null}
                praktikan={auth?.praktikan ?? auth?.user ?? null}
                customWidth="w-[80%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Nilai Praktikan" />

                <div className="mt-[8vh] flex flex-col gap-6">
                    <ScoreTable />
                </div>
            </PraktikanAuthenticated>
            <PraktikanUtilities />
        </>
    );
}
