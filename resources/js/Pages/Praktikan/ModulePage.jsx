import { useState, useEffect } from "react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import Clock from "@/Components/Assistants/Common/Clock";
import ModalSoftware from "@/Components/Assistants/Modals/ModalSoftware";
import ModuleSection from "@/Components/Praktikans/Sections/ModuleSection";
import TimerPraktikan from "@/Components/Praktikans/Sections/TimerPraktikan";
import TugasPendahuluan from "@/Components/Praktikans/Sections/TugasPendahuluan";
import TesAwal from "@/Components/Praktikans/Sections/TesAwal";
import Jurnal from "@/Components/Praktikans/Sections/Jurnal";
import Mandiri from "@/Components/Praktikans/Sections/Mandiri";
import TesKeterampilan from "@/Components/Praktikans/Sections/TesKeterampilan";
import TPReview from "@/Components/Praktikans/Sections/TPReview";
import TAReview from "@/Components/Praktikans/Sections/TAReview";
import JurnalReview from "@/Components/Praktikans/Sections/JurnalReview";
import MandiriReview from "@/Components/Praktikans/Sections/MandiriReview";
import TKReview from "@/Components/Praktikans/Sections/TKReview";

export default function ModulePage({ auth }) {
    const [activeComponent, setActiveComponent] = useState("ModuleSection");
    const [showTimer, setShowTimer] = useState(false);
    const [contentShift, setContentShift] = useState("0px");
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [questionsCount, setQuestionsCount] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [completedCategories, setCompletedCategories] = useState({
        TugasPendahuluan: false,
        TesAwal: false,
        Jurnal: false,
        Mandiri: false,
        TesKeterampilan: false,
    });

    useEffect(() => {
        if (!["ModuleSection", "TugasPendahuluan", "TesAwal", "Jurnal", "Mandiri", "TesKeterampilan", "TPReview", "TAReview", "JurnalReview", "MandiriReview", "TKReview"].includes(activeComponent)) {
            setActiveComponent("ModuleSection");
        }
    }, [activeComponent]);    

    const handleNavigate = (componentName) => {
        setActiveComponent(componentName);
        setShowTimer(
            componentName === "TugasPendahuluan" ||
            componentName === "TesAwal" ||
            componentName === "Jurnal" ||
            componentName === "Mandiri" ||
            componentName === "TesKeterampilan" 
        );
    
        if (
            componentName === "TPReview" || 
            componentName === "TAReview" || 
            componentName === "JurnalReview" || 
            componentName === "MandiriReview" || 
            componentName === "TKReview" 
        ) {
            setActiveTask(activeTask);
        } else {
            setActiveTask(componentName);
        }
    };           

    const resetTimer = () => {
        setShowTimer(false);
    };

    const handleShiftContent = (shiftValue) => {
        setContentShift(shiftValue);
    };

    const handleTaskSubmit = (taskName, taskAnswers) => {
        if (!taskName) return;
    
        const storageKey =
            taskName === "TugasPendahuluan"
                ? "tpAnswers"
                : taskName === "TesAwal"
                ? "taAnswers"
                : taskName === "Jurnal"
                ? "jurnalAnswer"
                : taskName === "Mandiri"
                ? "mandiriAnswer" 
                : taskName === "TesKeterampilan"
                ? "tkAnswers" 
                : null;
    
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(taskAnswers));
        }
    
        setCompletedCategories((prev) => {
            const updated = { ...prev, [taskName]: true };
            localStorage.setItem("completedCategories", JSON.stringify(updated));
            return updated;
        });
    
        setAnswers(taskAnswers);
        setActiveTask(taskName);
        setActiveComponent("ModuleSection");
        setShowTimer(false);
    };    

    useEffect(() => {
        const storedCategories = localStorage.getItem("completedCategories");
        if (storedCategories) {
            setCompletedCategories(JSON.parse(storedCategories));
        }
    }, []);    
    
    useEffect(() => {
        let storedAnswers = [];
        if (activeTask === "TugasPendahuluan") {
            const tpAnswers = localStorage.getItem("tpAnswers");
            storedAnswers = tpAnswers ? JSON.parse(tpAnswers) : [];
        } else if (activeTask === "TesAwal") {
            const jurnalAnswers = localStorage.getItem("taAnswers");
            storedAnswers = jurnalAnswers ? JSON.parse(jurnalAnswers) : [];
        } else if (activeTask === "Jurnal") {
            const jurnalAnswers = localStorage.getItem("jurnalAnswer");
            storedAnswers = jurnalAnswers ? JSON.parse(jurnalAnswers) : [];
        } else if (activeTask === "Mandiri") {
            const mandiriAnswers = localStorage.getItem("mandiriAnswer");
            storedAnswers = mandiriAnswers ? JSON.parse(mandiriAnswers) : [];
        } else if (activeTask === "TesKeterampilan") {
            const mandiriAnswers = localStorage.getItem("tkAnswers");
            storedAnswers = mandiriAnswers ? JSON.parse(mandiriAnswers) : [];
        }
        setAnswers(storedAnswers);
    }, [activeTask]);          

    const handleReviewTask = (taskKey) => {
        setActiveTask(taskKey);
        if (taskKey === "TugasPendahuluan") {
            setActiveComponent("TPReview");
        } else if (taskKey === "TesAwal") {
            setActiveComponent("TAReview");
        } else if (taskKey === "Jurnal") {
            setActiveComponent("JurnalReview");
        } else if (taskKey === "Mandiri") {
            setActiveComponent("MandiriReview"); 
        } else if (taskKey === "TesKeterampilan") {
            setActiveComponent("TKReview"); 
        }
    };    

    const praktikanData = auth?.praktikan ?? auth?.user ?? null;
    const kelasId =
        praktikanData?.kelas_id ??
        praktikanData?.kelasId ??
        praktikanData?.kelas?.id ??
        null;

    return (
        <>
            <PraktikanAuthenticated
                user={praktikanData}
                praktikan={praktikanData}
                customWidth="w-[80%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <div className="mt-[8vh] relative">
                    <div
                        className="flex-1 transition-all duration-300"
                        style={{ marginRight: contentShift }}
                    >
                        {activeComponent === "ModuleSection" && (
                            <ModuleSection
                                onNavigate={handleNavigate}
                                completedCategories={completedCategories}
                                setCompletedCategories={setCompletedCategories}
                                onReviewTask={handleReviewTask}
                                kelasId={kelasId}
                            />
                        )}
                        {activeComponent === "TugasPendahuluan" && (
                            <TugasPendahuluan
                                setAnswers={setAnswers}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setQuestionsCount={setQuestionsCount}
                                setQuestions={setQuestions}
                                onNavigate={handleNavigate}
                            />
                        )}
                        {activeComponent === "TesAwal" && (
                            <TesAwal
                                setAnswers={setAnswers}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setQuestionsCount={setQuestionsCount}
                                setQuestions={setQuestions}
                                onNavigate={handleNavigate}
                            />
                        )}
                        {activeComponent === "Jurnal" && (
                            <Jurnal
                                setAnswers={setAnswers}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setQuestionsCount={setQuestionsCount}
                                setQuestions={setQuestions}
                                onNavigate={handleNavigate}
                            />
                        )}
                        {activeComponent === "Mandiri" && (
                            <Mandiri
                                setAnswers={setAnswers}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setQuestionsCount={setQuestionsCount}
                                setQuestions={setQuestions}
                                onNavigate={handleNavigate}
                            />
                        )}
                        {activeComponent === "TesKeterampilan" && (
                            <TesKeterampilan
                                setAnswers={setAnswers}
                                currentQuestion={currentQuestion}
                                setCurrentQuestion={setCurrentQuestion}
                                setQuestionsCount={setQuestionsCount}
                                setQuestions={setQuestions}
                                onNavigate={handleNavigate}
                            />
                        )}
                        {activeComponent === "TPReview" && activeTask && (
                            <TPReview answers={answers} questions={questions} activeTask={activeTask} />
                        )}
                        {activeComponent === "TAReview" && activeTask && (
                            <TAReview answers={answers} questions={questions} activeTask={activeTask} />
                        )}
                        {activeComponent === "JurnalReview" && activeTask && (
                            <JurnalReview answers={answers} questions={questions} activeTask={activeTask} />
                        )}
                        {activeComponent === "MandiriReview" && activeTask && (
                            <MandiriReview answers={answers} questions={questions} activeTask={activeTask} />
                        )}
                        {activeComponent === "TKReview" && activeTask && (
                            <TKReview answers={answers} questions={questions} activeTask={activeTask} />
                        )}
                    </div>
                </div>

                {showTimer && (activeComponent === "TugasPendahuluan" || activeComponent === "TesAwal" || activeComponent === "Jurnal" || activeComponent === "Mandiri" || activeComponent === "TesKeterampilan") && (
                    <TimerPraktikan
                        isRunning={showTimer}
                        setIsRunning={setShowTimer}
                        onShiftContent={handleShiftContent}
                        answers={answers}
                        setAnswers={setAnswers}
                        questions={questions}
                        setCurrentQuestion={setCurrentQuestion}
                        questionsCount={questionsCount}
                        setQuestionsCount={setQuestionsCount}
                        onTaskSubmit={handleTaskSubmit}
                        taskQuestions={questions}
                        activeTask={activeTask}
                    />                                                                 
                )}
            </PraktikanAuthenticated>
            <Clock />
            <ModalSoftware />
        </>
    );
}
