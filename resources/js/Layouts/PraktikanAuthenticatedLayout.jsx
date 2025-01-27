import PraktikanNav from "../Components/ComponentsPraktikans/PraktikanNav";

export default function PraktikanAuthenticated({ children, customWidth, praktikan}) {
    return (
        <>
            <div className="relative h-screen overflow-hidden">
                <div id="template" className="flex">
                    <PraktikanNav praktikan={praktikan} permission_name={permission_name} />
                    <main
                        className={`mx-auto w-[30%] ${
                            customWidth || ""
                        }`}
                    >
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
