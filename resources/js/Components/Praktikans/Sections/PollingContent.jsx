import { useState, useEffect } from "react";
import { Image } from "@imagekit/react";
import daskomIcon from "../../../../assets/daskom.svg";
import CardPolling from "./CardPolling";

export default function PollingContent({ 
    activeCategory, 
    asistens, 
    loading, 
    error, 
    selectedCards, 
    setSelectedCards, 
    isSubmitted 
}) {
    const [activeModalCards, setActiveModalCards] = useState({});

    useEffect(() => {
        const storedModalCards = localStorage.getItem("activeModalCards");
        if (storedModalCards) {
            try {
                setActiveModalCards(JSON.parse(storedModalCards));
            } catch (err) {
                console.error("Error parsing stored modal cards:", err);
                localStorage.removeItem("activeModalCards");
            }
        }
    }, []);    

    const handleCardClick = (asisten) => {
        if (isSubmitted || !activeCategory) return;

        setActiveModalCards(prev => {
            const newState = { ...prev, [activeCategory]: asisten };
            localStorage.setItem("activeModalCards", JSON.stringify(newState));
            return newState;
        });

        setSelectedCards(prev => {
            const newState = { ...prev, [activeCategory]: asisten };
            localStorage.setItem("selectedCards", JSON.stringify(newState));
            return newState;
        });
    };

    if (loading) {
        return (
            <div className="mt-4 flex h-[59vh] items-center justify-center rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-depth border-t-[var(--depth-color-primary)]"></div>
                    <p className="text-depth-secondary">Mengambil Data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-4 flex h-[59vh] items-center justify-center rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                <div className="text-center">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className={`relative ${isSubmitted ? "pointer-events-none" : ""}`}>
            <div className="relative mt-4 h-[59vh] overflow-y-auto rounded-depth-lg border border-depth bg-depth-card p-4 shadow-depth-lg scrollbar-thin scrollbar-track-depth scrollbar-thumb-depth-secondary">
                <div className="grid grid-cols-3 gap-4">
                    {Array.isArray(asistens) && asistens.length > 0 ? (
                        asistens.map((asisten) => (
                            <CardPolling
                                key={asisten.kode}
                                image={asisten?.foto}
                                name={`${asisten.kode} | ${asisten.nama}`}
                                description={asisten.deskripsi || "Asisten Laboratorium Daskom"}
                                onClick={() => handleCardClick(asisten)}
                                isDimmed={
                                    !!activeModalCards[activeCategory] &&
                                    activeModalCards[activeCategory]?.kode !== asisten.kode
                                }
                                isSelected={selectedCards[activeCategory]?.kode === asisten.kode}
                            />
                        ))
                    ) : (
                        <div className="col-span-3 py-8 text-center text-depth-secondary">No asisten data available</div>
                    )}
                </div>
            </div>

            {/* Modal for selected asisten */}
            {activeModalCards[activeCategory] && (
                <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
                    <div className="pointer-events-auto h-[50vh] w-[23vw] rounded-depth-lg border-2 border-[var(--depth-color-primary)] bg-depth-card p-6 shadow-depth-xl backdrop-blur-sm">
                        {activeModalCards[activeCategory]?.foto ? (
                            <Image
                                src={activeModalCards[activeCategory].foto}
                                transformation={[{ height: "165", width: "165", crop: "maintain_ratio" }]}
                                alt={activeModalCards[activeCategory]?.nama || "Asisten"}
                                className="mx-auto mb-4 h-[165px] w-[165px] rounded-full object-cover shadow-depth-md ring-2 ring-[var(--depth-color-primary)] ring-offset-2"
                                loading="lazy"
                            />
                        ) : (
                            <img
                                src={daskomIcon}
                                alt={activeModalCards[activeCategory]?.nama || "Asisten"}
                                className="mx-auto mb-4 h-[165px] w-[165px] rounded-full object-cover shadow-depth-md ring-2 ring-[var(--depth-color-primary)] ring-offset-2"
                            />
                        )}
                        <h2 className="mb-5 text-center text-xl font-bold text-depth-primary">
                            {activeModalCards[activeCategory]?.kode || ""} | {activeModalCards[activeCategory]?.nama || ""}
                        </h2>
                        <p className="text-center text-sm font-semibold text-depth-secondary">
                            {activeModalCards[activeCategory]?.deskripsi || "Asisten Laboratorium Daskom"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
