import PraktikanNav from "../Components/Praktikans/Layout/PraktikanNav";

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
                <div id="template" className="flex">
                    <PraktikanNav praktikan={praktikanData} />
                    <main className={`mx-auto w-[30%] ${customWidth || ""}`}>
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
