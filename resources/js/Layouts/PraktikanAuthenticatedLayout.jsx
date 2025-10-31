import PraktikanNav from "@/Components/Common/PraktikanNav";

export default function PraktikanAuthenticated({
    children,
    customWidth,
    user,
    praktikan,
}) {
    const praktikanData = praktikan || user || null;

    return (
        <>
            <div className="relative h-screen overflow-hidden">
                <div id="template" className="flex min-h-screen items-center gap-10 pl-10 pr-6">
                    <PraktikanNav praktikan={praktikanData} />
                    <main className={`mx-auto w-[30%] ${customWidth || ""}`}>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
