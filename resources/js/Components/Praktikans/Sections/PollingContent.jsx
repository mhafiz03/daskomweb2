import { useState, useEffect } from "react";
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

    if (loading) return <div>Mengambil Data...</div>;
    if (error) return <div>Error: {error}</div>;
    
    return (
        <div className={`relative ${isSubmitted ? "pointer-events-none" : ""}`}>
            <div className="p-4 mt-4 h-[59vh] overflow-y-auto bg-softIvory rounded-lg shadow-lg relative">
                <div className="grid grid-cols-3 gap-4">
                    {Array.isArray(asistens) && asistens.length > 0 ? (
                        asistens.map((asisten) => (
                            <CardPolling
                                key={asisten.kode}
                                image={asisten.foto ? asisten.foto : daskomIcon}
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
                        <div className="col-span-3 text-center py-8">No asisten data available</div>
                    )}
                </div>
            </div>

            {/* Modal for selected asisten */}
            {activeModalCards[activeCategory] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="pointer-events-auto h-[50vh] w-[23vw] border-4 rounded-lg bg-softIvory shadow-lg p-6">
                        <img
                            src={activeModalCards[activeCategory]?.foto || daskomIcon}
                            alt={activeModalCards[activeCategory]?.nama || "Asisten"}
                            className="w-[165px] mx-auto rounded-full mb-4"
                        />
                        <h2 className="text-center mb-5 font-bold text-xl text-black">
                            {activeModalCards[activeCategory]?.kode || ""} | {activeModalCards[activeCategory]?.nama || ""}
                        </h2>
                        <p className="font-semibold text-center text-sm text-black">
                            {activeModalCards[activeCategory]?.deskripsi || "Asisten Laboratorium Daskom"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
