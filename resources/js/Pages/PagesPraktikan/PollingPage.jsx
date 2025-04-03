import { Head, usePage, router } from "@inertiajs/react";
import { useState, useRef } from "react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import Clock from "@/Components/ComponentsAssistants/Clock";
import ModalSoftware from "@/Components/ComponentsAssistants/ModalSoftware";
import PollingHeader from "@/Components/ComponentsPraktikans/PollingHeader";
import PollingContent from "@/Components/ComponentsPraktikans/PollingContent";
import ModalSuccessData from "@/Components/ComponentsPraktikans/ModalSuccessData";

export default function PollingPage({ auth }) {
    const { ziggy } = usePage().props;
    const [activeCategory, setActiveCategory] = useState("Tercantik");
    const [selectedCards, setSelectedCards] = useState(() => {
        const storedCards = localStorage.getItem("selectedCards");
        return storedCards ? JSON.parse(storedCards) : {};
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const submitAllRef = useRef(null);

    const handleSubmit = async() => {
        if (isSubmitted) return; 

        if (submitAllRef.current){
            try {
                const result = await submitAllRef.current();

                if (result.success){
                    setIsSubmitted(true);
                    setShowModal(true);
                    localStorage.setItem("submittedCards", JSON.stringify(selectedCards));

                    setTimeout(() => {
                        setShowModal(false);
                        router.visit(`${ziggy.url}/polling-assistant`);
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
        }
    };

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
                    onClick={handleSubmit} // Use handleSubmit here, not handleSubmitAll directly
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
                />
                <PollingContent
                    activeCategory={activeCategory}
                    onSubmit={setSelectedCards}
                    isSubmitted={isSubmitted}
                    submitRef={submitAllRef} // Pass the ref to the child
                />
            </div>
            </PraktikanAuthenticated>
            <Clock />
            <ModalSoftware />

            <ModalSuccessData isVisible={showModal} />
        </>
    );
}