import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from '@inertiajs/react';
import daskomIcon from "../../../assets/daskom.svg";
import CardPolling from "./CardPolling";

export default function PollingContent({ activeCategory, pollingsData, onSubmit, isSubmitted, submitRef }) {
    
    const [selectedCards, setSelectedCards] = useState({});
    const [activeModalCards, setActiveModalCards] = useState({});
    const [asistens, setAsistens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { auth } = usePage().props;
    const user = auth?.praktikan;

    // Fix the polling ID function to use the category ID directly
    const getPollingId = (categoryId) => {
        return categoryId; // Simply return the ID that was passed from PollingHeader
    };

    useEffect(() => {
        const storedCards = localStorage.getItem("selectedCards");
        if (storedCards) {
            try {
                setSelectedCards(JSON.parse(storedCards));
            } catch (err) {
                console.error("Error parsing stored cards:", err);
                localStorage.removeItem("selectedCards");
            }
        }

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

    useEffect(() => {
        if (activeCategory) {
            setLoading(true);
    
            axios.get('/api-v1/asisten')
                .then(response => {
                    if (response.data && response.data.success) {
                        setAsistens(response.data.asisten || []);
                    } else {
                        setError(response.data?.message || 'Failed to fetch asisten');
                        console.error('Failed to fetch asisten:', response.data?.message);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    setError(error.message || 'Failed to fetch asisten');
                    setLoading(false);
                    console.error('Failed to fetch asisten:', error);
                });    
        }
    }, [activeCategory]);

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

    const handleSubmitAll = async () => {
        if (!user || !selectedCards) {
            console.error("User or selectedCards missing", { user, selectedCards });
            return { success: false, message: 'User information or selections are missing' };
        }
        
        try {
            const submissions = Object.entries(selectedCards)
                .filter(([categoryId, asisten]) => categoryId && asisten && asisten.kode)
                .map(([categoryId, asisten]) => ({
                    polling_id: getPollingId(categoryId),
                    kode: asisten.kode,
                    praktikan_id: user.id
                }));

            if (submissions.length === 0) {
                return { success: false, message: 'Please select at least one asisten' };
            }

            const response = await axios.post('/api-v1/pollings', submissions, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '', 
                }
            });

            // Check if response exists and has data property
            if (response && response.data) {
                const data = response.data;

                if (data.status === 'success') {
                    if (onSubmit && typeof onSubmit === 'function') {
                        onSubmit(selectedCards);
                        // Clear selections after successful submission
                        setSelectedCards({});
                        setActiveModalCards({});
                        localStorage.removeItem("selectedCards");
                        localStorage.removeItem("activeModalCards");
                    }
                    return { success: true, message: 'Polling submitted successfully!' };
                } else {
                    throw new Error(data.message || 'Server returned non-success status');
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            console.error('Submission error:', err);
            return { success: false, message: 'Failed to submit pollings: ' + (err.message || 'Unknown error') };
        }
    };

    useEffect(() => {
        if (submitRef) {
            submitRef.current = handleSubmitAll;
        }
    }, [submitRef, user, selectedCards]);

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