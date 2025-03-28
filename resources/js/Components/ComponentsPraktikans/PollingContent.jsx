import { useState, useEffect } from "react";
import axios from "axios";
import { usePage } from '@inertiajs/react';
import daskomIcon from "../../../assets/daskom.svg";
import CardPolling from "./CardPolling";

export default function PollingContent({ activeCategory, onSubmit, isSubmitted }) {
    
    const [selectedCards, setSelectedCards] = useState({});
    const [activeModalCards, setActiveModalCards] = useState({});
    const [asistens, setAsistens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = usePage().props;
    const user = auth.praktikan;
    console.log('Praktikan user:', user);



    // Load selected cards from localStorage
    useEffect(() => {
        const storedCards = localStorage.getItem("selectedCards");
        if (storedCards) setSelectedCards(JSON.parse(storedCards));

        const storedModalCards = localStorage.getItem("activeModalCards");
        if (storedModalCards) setActiveModalCards(JSON.parse(storedModalCards));
    }, []);

    // Fetch asisten data when activeCategory changes
    useEffect(() => {
        const fetchAsistens = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api-v1/pollings/asistens');
                setAsistens(response.data.asistens);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch asisten data');
                setLoading(false);
                console.error('Error fetching asisten data:', err);
            }
        };

        if (activeCategory) fetchAsistens();
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
            console.log("User or selectedCards missing", { user, selectedCards });
            return;
        }
    
        try {
            // Prepare submissions data
            const submissions = Object.entries(selectedCards)
                .filter(([pollingId, asisten]) => asisten)
                .map(([pollingId, asisten]) => ({
                    polling_id: pollingId,
                    asisten_id: asisten.id,
                    praktikan_id: user.id
                }));
    
            if (submissions.length === 0) {
                alert('Please select at least one asisten');
                return;
            }
    
//            const response = await fetch('/api-v1/pollings/submit-all', {
//                method: 'POST',
//                headers: {
//                    'Content-Type': 'application/json',
//                    'Accept': 'application/json',
//                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content, 
//                },
//                body: JSON.stringify({ submissions }),
//                credentials: 'include'
//            });

            const response = await axios.post('/api-v1/pollings/submit-all', submissions, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content, 
                },
                credentials: 'include'
            });
            // First check if the response is OK (status 200-299)
            if (!response.ok) {
                // Try to get error message from response
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                throw new Error(errorData.message || 'Failed to submit pollings');
            }
    
            // Parse successful response
            const data = await response.json();
            
            // Check if data exists and has status property
            if (!data || typeof data.status === 'undefined') {
                throw new Error('Invalid server response format');
            }
    
            if (data.status === 'success') {
                if (onSubmit) {
                    onSubmit(selectedCards);
                    setSelectedCards({});
                    setActiveModalCards({});
                }
                alert('Polling submitted successfully!');
            } else {
                throw new Error(data.message || 'Server returned non-success status');
            }
        } catch (err) {
            console.error('Submission error:', err);
            alert('Failed to submit pollings: ' + (err.message || 'Unknown error'));
        }
    };

    if (loading) return <div>Loading asisten data...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className={`relative ${isSubmitted ? "pointer-events-none" : ""}`}>
            <div className="p-4 mt-4 h-[59vh] overflow-y-auto bg-softIvory rounded-lg shadow-lg relative">
                <div className="grid grid-cols-3 gap-4">
                    {asistens.map((asisten) => (
                        <CardPolling
                            key={asisten.id}
                            image={daskomIcon}
                            name={`${asisten.kode} | ${asisten.nama}`}
                            description={asisten.deskripsi || "Asisten Laboratorium Daskom"}
                            onClick={() => handleCardClick(asisten)}
                            isDimmed={
                                !!activeModalCards[activeCategory] &&
                                activeModalCards[activeCategory]?.id !== asisten.id
                            }
                            isSelected={selectedCards[activeCategory]?.id === asisten.id}
                        />
                    ))}
                </div>
            </div>

            {/* Submit button */}
            <div className="mt-4 flex justify-center">
                <button
                    onClick={handleSubmitAll}
                    disabled={isSubmitted}
                    className={`px-6 py-2 rounded-lg font-bold ${
                        isSubmitted 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-deepForestGreen text-white hover:bg-green-800'
                    }`}
                >
                    {isSubmitted ? 'Submitted' : 'Submit Polling'}
                </button>
            </div>

            {/* Modal for selected asisten */}
            {activeModalCards[activeCategory] && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                    <div className="pointer-events-auto h-[50vh] w-[23vw] border-4 rounded-lg bg-softIvory shadow-lg p-6">
                        <img
                            src={daskomIcon}
                            alt={activeModalCards[activeCategory]?.nama}
                            className="w-[165px] mx-auto rounded-full mb-4"
                        />
                        <h2 className="text-center mb-5 font-bold text-xl text-black">
                            {activeModalCards[activeCategory]?.kode} | {activeModalCards[activeCategory]?.nama}
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