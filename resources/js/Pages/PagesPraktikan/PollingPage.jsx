import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import Clock from "@/Components/ComponentsAssistants/Clock";
import ModalSoftware from "@/Components/ComponentsAssistants/ModalSoftware";
import PollingHeader from "@/Components/ComponentsPraktikans/PollingHeader";
import PollingContent from "@/Components/ComponentsPraktikans/PollingContent";
import ModalSuccessData from "@/Components/ComponentsPraktikans/ModalSuccessData";

export default function PollingPage({ auth }) {
    const { ziggy } = usePage().props;
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedCards, setSelectedCards] = useState(() => {
        const storedCards = localStorage.getItem("selectedCards");
        return storedCards ? JSON.parse(storedCards) : {};
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const submitAllRef = useRef(null);
    
    // Moved from PollingContent
    const [asistens, setAsistens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user = auth?.praktikan;

    // New states for tracking categories
    const [categories, setCategories] = useState([]);
    const [submittedCategories, setSubmittedCategories] = useState(() => {
        const stored = localStorage.getItem("submittedCategories");
        return stored ? JSON.parse(stored) : [];
    });
    const [availableCategories, setAvailableCategories] = useState([]);
    const [allCategoriesSubmitted, setAllCategoriesSubmitted] = useState(false);

    const getPollingId = (categoryId) => {
        return categoryId;
    };

    // Fetch categories to know total count
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api-v1/jenis-polling');
                setCategories(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Filter available categories (exclude submitted ones)
    useEffect(() => {
        if (categories.length > 0) {
            const available = categories.filter(category => 
                !submittedCategories.includes(category.id.toString())
            );
            setAvailableCategories(available);
            
            // Set first available category as active if none selected
            if (!activeCategory && available.length > 0) {
                setActiveCategory(available[0].id.toString());
            }
            
            // Check if all categories are submitted
            if (available.length === 0 && categories.length > 0) {
                setAllCategoriesSubmitted(true);
            }
        }
    }, [categories, submittedCategories, activeCategory]);

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
                return { success: false, message: 'Pilih minimal 1 asisten sebelum mengirim' };
            }

            const response = await axios.post('/api-v1/pollings', submissions, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '', 
                }
            });

            if (response && response.data) {
                const data = response.data;

                if (data.status === 'success') {
                    // Track submitted categories
                    const newSubmittedCategories = [...new Set([...submittedCategories, ...submissions.map(s => s.polling_id.toString())])];
                    setSubmittedCategories(newSubmittedCategories);
                    localStorage.setItem("submittedCategories", JSON.stringify(newSubmittedCategories));
                    
                    // Clear selections after successful submission
                    setSelectedCards({});
                    localStorage.removeItem("selectedCards");
                    localStorage.removeItem("activeModalCards");
                    
                    // Reset active category to null so it gets set to next available category
                    setActiveCategory(null);
                    
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

    const handleSubmit = async() => {
        if (isSubmitted) return; 

        try {
            const result = await handleSubmitAll();

            if (result.success){
                setIsSubmitted(true);
                setShowModal(true);
                localStorage.setItem("submittedCards", JSON.stringify(selectedCards));

                setTimeout(() => {
                    setShowModal(false);
                    setIsSubmitted(false); // Reset for next category
                }, 2000);
            } else {
                setSubmitError(result.message);
                alert(result.message);
            }
        } catch (error) {
            console.error("Error submitting:", error);
            setSubmitError("An unexpected error accured");
            alert("An unexpected error accured");
        }
    };

    // Show thank you message if all categories are submitted
    if (allCategoriesSubmitted) {
        return (
            <>
                <PraktikanAuthenticated
                    user={auth.user}
                    customWidth="w-[65%]"
                    header={
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Dashboard
                        </h2>
                    }
                >
                    <Head title="Polling Selesai" />
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-deepForestGreen mb-4">
                                Terimakasih sudah melakukan praktikum
                            </h1>
                            <p className="text-lg text-gray-600">
                                Semua kategori polling telah berhasil dikirim
                            </p>
                        </div>
                    </div>
                </PraktikanAuthenticated>
                <Clock />
                <ModalSoftware />
            </>
        );
    }

    return (
        <>
            <PraktikanAuthenticated
                user={auth.user}
                customWidth="w-[65%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Leaderboard Praktikan" />

                <div className="relative mt-[11vh] h-screen">
                <div
                    onClick={handleSubmit}
                    className={`mb-[2vh] w-[100px] border-2 rounded-lg text-white font-bold bg-deepForestGreen ${
                        isSubmitted
                            ? "bg-gray-400 cursor-not-allowed"
                            : "hover:bg-deepForestGreenDark cursor-pointer"
                    } px-4 py-1 text-center z-10`}
                >
                    Submit
                </div>
                
                <PollingHeader
                    onCategoryClick={(category) =>
                        setActiveCategory(category)
                    }
                    activeCategory={activeCategory}
                    availableCategories={availableCategories}
                />
                <PollingContent
                    activeCategory={activeCategory}
                    asistens={asistens}
                    loading={loading}
                    error={error}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                    isSubmitted={isSubmitted}
                />
            </div>
            </PraktikanAuthenticated>
            <Clock />
            <ModalSoftware />

            <ModalSuccessData isVisible={showModal} />
        </>
    );
}