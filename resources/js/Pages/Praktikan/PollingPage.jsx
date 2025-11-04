import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { send } from "@/lib/http";
import { store as storePollings } from "@/lib/routes/pollings";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import PollingHeader from "@/Components/Praktikans/Sections/PollingHeader";
import PollingContent from "@/Components/Praktikans/Sections/PollingContent";
import PraktikanPageHeader from "@/Components/Praktikans/Common/PraktikanPageHeader";
import ModalSuccessData from "@/Components/Praktikans/Modals/ModalSuccessData";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";

export default function PollingPage({ auth }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedCards, setSelectedCards] = useState(() => {
        const storedCards = localStorage.getItem("selectedCards");
        return storedCards ? JSON.parse(storedCards) : {};
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitError, setSubmitError] = useState(null);

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
    const categoriesQuery = useQuery({
        queryKey: ['jenis-polling'],
        queryFn: async () => {
            const { data } = await api.get('/api-v1/jenis-polling');
            return data?.categories ?? [];
        },
    });

    useEffect(() => {
        if (categoriesQuery.data) {
            setCategories(categoriesQuery.data);
        }
    }, [categoriesQuery.data]);

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

    const asistenQuery = useQuery({
        queryKey: ['asisten', activeCategory],
        enabled: Boolean(activeCategory),
        queryFn: async () => {
            const { data } = await api.get('/api-v1/asisten');
            if (data?.success) {
                return data.asisten ?? [];
            }
            throw new Error(data?.message ?? 'Failed to fetch asisten');
        },
        onSuccess: (data) => {
            setAsistens(data);
            setError(null);
        },
        onError: (err) => {
            setError(err.message ?? 'Failed to fetch asisten');
        },
    });

    useEffect(() => {
        setLoading(asistenQuery.isLoading);
    }, [asistenQuery.isLoading]);

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

            const { data } = await send(storePollings(), submissions);

            if (data?.status === 'success') {
                const newSubmittedCategories = [...new Set([...submittedCategories, ...submissions.map(s => s.polling_id.toString())])];
                setSubmittedCategories(newSubmittedCategories);
                localStorage.setItem("submittedCategories", JSON.stringify(newSubmittedCategories));

                setSelectedCards({});
                localStorage.removeItem("selectedCards");
                localStorage.removeItem("activeModalCards");

                setActiveCategory(null);

                return { success: true, message: 'Polling submitted successfully!' };
            }

            throw new Error(data?.message ?? 'Server returned non-success status');
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
                setSubmitError(null);
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
                    user={auth?.user ?? auth?.praktikan ?? null}
                    praktikan={auth?.praktikan ?? auth?.user ?? null}
                    customWidth="w-[80%]"
                    header={
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Dashboard
                        </h2>
                    }
                >
                    <Head title="Polling Selesai" />
                    <div className="mt-[8vh] flex flex-col gap-6">
                        <PraktikanPageHeader title="Polling Asisten" />
                                                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
                            <h1 className="text-4xl font-bold text-deepForestGreen">
                            Terimakasih sudah melakukan praktikum
                        </h1>
                        <p className="text-lg text-gray-600">
                            Semua kategori polling telah berhasil dikirim
                                                    </p>
                        </div>
                    </div>
                </PraktikanAuthenticated>
                <PraktikanUtilities />
            </>
        );
    }

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
                <Head title="Polling Praktikan" />

                <div className="-mt-[10vh] flex flex-col gap-6">
                    <PraktikanPageHeader title="Polling Asisten" />
                    <div className="flex items-center justify-end">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={`inline-flex w-[120px] items-center justify-center rounded-depth-md border-2 border-depth px-4 py-2 text-sm font-semibold text-white shadow-depth-md transition-all ${
                                isSubmitted
                                    ? "cursor-not-allowed bg-gray-400"
                                    : "cursor-pointer bg-[var(--depth-color-primary)] hover:-translate-y-0.5 hover:shadow-depth-lg"
                            }`}
                            disabled={isSubmitted}
                        >
                            Submit
                        </button>
                    </div>
                    {submitError && (
                        <p className="text-sm text-red-500">{submitError}</p>
                    )}
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
            <PraktikanUtilities />

            <ModalSuccessData isVisible={showModal} />
        </>
    );
}
