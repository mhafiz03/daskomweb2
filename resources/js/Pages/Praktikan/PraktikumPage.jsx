import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import NoPraktikumSection from "@/Components/Praktikans/Sections/NoPraktikumSection";
import TugasPendahuluan from "@/Components/Praktikans/Sections/TugasPendahuluan";
import TesAwal from "@/Components/Praktikans/Sections/TesAwal";
import Jurnal from "@/Components/Praktikans/Sections/Jurnal";
import Mandiri from "@/Components/Praktikans/Sections/Mandiri";
import TesKeterampilan from "@/Components/Praktikans/Sections/TesKeterampilan";
import { api } from "@/lib/api";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";
import FeedbackModal from "@/Components/Modals/FeedbackModal";

const TASK_COMPONENTS = {
    TugasPendahuluan,
    TesAwal,
    Jurnal,
    Mandiri,
    TesKeterampilan,
};

const TASK_NAMES = Object.keys(TASK_COMPONENTS);
const ALLOWED_COMPONENTS = new Set(["NoPraktikumSection", ...TASK_NAMES]);

const INITIAL_COMPLETED_STATE = TASK_NAMES.reduce((accumulator, key) => {
    accumulator[key] = false;

    return accumulator;
}, {});

const TASK_CONFIG = {
    TugasPendahuluan: {
        questionEndpoint: (modulId) => `/api-v1/soal-tp/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-tp",
        variant: "essay",
    },
    TesAwal: {
        questionEndpoint: (modulId) => `/api-v1/soal-ta/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-ta",
        variant: "multiple-choice",
    },
    Jurnal: {
        questionEndpoint: (modulId) => `/api-v1/soal-jurnal/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-jurnal",
        variant: "essay",
        fitb: {
            questionEndpoint: (modulId) => `/api-v1/soal-fitb/${modulId}`,
            submitEndpoint: "/api-v1/jawaban-fitb",
        },
    },
    Mandiri: {
        questionEndpoint: (modulId) => `/api-v1/soal-tm/${modulId}`,
        answerEndpoint: null, // Mandiri doesn't fetch previous answers
        submitEndpoint: "/api-v1/jawaban-tm",
        variant: "essay",
    },
    TesKeterampilan: {
        questionEndpoint: (modulId) => `/api-v1/soal-tk/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-tk",
        variant: "multiple-choice",
    },
};

const extractQuestions = (response) => {
    const payload = response?.data ?? response;
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.questions)) {
        return payload.questions;
    }

    return [];
};

const normalizeEssayQuestions = (items, questionType = "essay") => {
    return (items ?? [])
        .filter((item) => item && (item.soal || item.pertanyaan))
        .map((item) => ({
            id: item.id,
            text: item.soal ?? item.pertanyaan ?? "",
            questionType,
        }));
};

const normalizeMultipleChoiceQuestions = (items, questionType = "multiple-choice") => {
    return (items ?? [])
        .filter((item) => item && item.pertanyaan)
        .map((item) => ({
            id: item.id,
            text: item.pertanyaan,
            options: (item.options ?? []).map((option) => ({
                id: option.id,
                text: option.text,
            })),
            questionType,
        }))
        .filter((item) => Array.isArray(item.options) && item.options.length > 0);
};

const PHASE_TO_COMPONENT = {
    ta: "TesAwal",
    fitb_jurnal: "Jurnal",
    mandiri: "Mandiri",
    tk: "TesKeterampilan",
    feedback: "Feedback",
};

export default function PraktikumPage({ auth }) {
    const [activeComponent, setActiveComponent] = useState("NoPraktikumSection");
    const [answers, setAnswers] = useState([]);
    const [questionsCount, setQuestionsCount] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [activeTask, setActiveTask] = useState(null);
    const [completedCategories, setCompletedCategories] = useState(INITIAL_COMPLETED_STATE);
    const [activeModulId, setActiveModulId] = useState(null);
    const [moduleMeta, setModuleMeta] = useState(null);
    const [isLoadingTask, setIsLoadingTask] = useState(false);
    const [taskError, setTaskError] = useState(null);
    const [isSubmittingTask, setIsSubmittingTask] = useState(false);
    const [submissionError, setSubmissionError] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isFeedbackPending, setIsFeedbackPending] = useState(false);

    const praktikanData = auth?.praktikan ?? auth?.user ?? null;
    const praktikanId = praktikanData?.id ?? null;
    const kelasId =
        praktikanData?.kelas_id ??
        praktikanData?.kelasId ??
        praktikanData?.kelas?.id ??
        null;

    const clearTaskProgress = useCallback(() => {
        setQuestions([]);
        setAnswers([]);
        setQuestionsCount(0);
    }, []);

    const resetActiveTaskState = useCallback(() => {
        clearTaskProgress();
        setActiveTask(null);
    }, [clearTaskProgress]);

    useEffect(() => {
        if (!ALLOWED_COMPONENTS.has(activeComponent)) {
            setActiveComponent("NoPraktikumSection");
        }
    }, [activeComponent]);

    const localStorageKey = useMemo(() => {
        if (!activeModulId) {
            return null;
        }

        return `praktikum:completed:${activeModulId}`;
    }, [activeModulId]);

    useEffect(() => {
        if (!localStorageKey) {
            setCompletedCategories({ ...INITIAL_COMPLETED_STATE });

            return;
        }

        try {
            const stored = localStorage.getItem(localStorageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                setCompletedCategories({ ...INITIAL_COMPLETED_STATE, ...parsed });
            } else {
                setCompletedCategories({ ...INITIAL_COMPLETED_STATE });
            }
        } catch (error) {
            console.error("Failed to restore completed categories", error);
            setCompletedCategories({ ...INITIAL_COMPLETED_STATE });
        }
    }, [localStorageKey]);

    useEffect(() => {
        if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(completedCategories));
        }
    }, [completedCategories, localStorageKey]);

    const fetchTaskData = useCallback(
        async (taskKey, modulId) => {
            const config = TASK_CONFIG[taskKey];
            if (!config || !modulId) {
                clearTaskProgress();
                return;
            }

            console.log(`[${new Date().toISOString()}] Fetching task data`, {
                taskKey,
                modulId,
            });
            setIsLoadingTask(true);
            setTaskError(null);
            setSubmissionError(null);

            try {
                const questionResponse = await api.get(config.questionEndpoint(modulId));

                const rawQuestions = extractQuestions(questionResponse);

                let normalizedQuestions = [];

                if (taskKey === "Jurnal" && config.fitb) {
                    const fitbQuestionResponse = await api
                        .get(config.fitb.questionEndpoint(modulId))
                        .catch(() => ({ data: [] }));

                    const rawFitbQuestions = extractQuestions(fitbQuestionResponse);
                    const fitbQuestions = normalizeEssayQuestions(rawFitbQuestions, "fitb");
                    const jurnalQuestions = normalizeEssayQuestions(rawQuestions, "jurnal");
                    normalizedQuestions = [...fitbQuestions, ...jurnalQuestions];
                } else {
                    normalizedQuestions =
                        config.variant === "multiple-choice"
                            ? normalizeMultipleChoiceQuestions(rawQuestions)
                            : normalizeEssayQuestions(rawQuestions);
                }

                const initialAnswers = normalizedQuestions.map((question) =>
                    question.questionType === "multiple-choice" ? null : ""
                );

                setQuestions(normalizedQuestions);
                setAnswers(initialAnswers);
                setQuestionsCount(normalizedQuestions.length);
            } catch (error) {
                console.error("Failed to fetch task data", error);
                const message = error?.response?.data?.message ?? error.message ?? "Gagal memuat data tugas.";
                setTaskError(message);
                clearTaskProgress();
            } finally {
                setIsLoadingTask(false);
            }
        },
        [clearTaskProgress]
    );

    const handlePraktikumStateChange = useCallback(
        (praktikumState) => {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Praktikum state update:`, praktikumState);
            if (!praktikumState) {
                setActiveModulId(null);
                setModuleMeta(null);
                resetActiveTaskState();
                setActiveComponent("NoPraktikumSection");

                return;
            }

            setActiveModulId(praktikumState.modul_id ?? null);
            setModuleMeta(praktikumState);

            if (praktikumState.status === "exited" || praktikumState.status === "paused") {
                resetActiveTaskState();
                setActiveComponent("NoPraktikumSection");
            }
        },
        [resetActiveTaskState]
    );

    const handleNavigate = useCallback(
        (componentName) => {
            console.log(`[${new Date().toISOString()}] Navigating praktikum task`, {
                requested: componentName,
                activeModulId,
            });
            const nextComponent = ALLOWED_COMPONENTS.has(componentName)
                ? componentName
                : "NoPraktikumSection";

            setActiveComponent(nextComponent);

            if (TASK_NAMES.includes(nextComponent)) {
                setActiveTask(nextComponent);
                if (activeModulId) {
                    fetchTaskData(nextComponent, activeModulId);
                } else {
                    clearTaskProgress();
                }
            } else {
                setActiveTask(null);
            }
        },
        [activeModulId, fetchTaskData, clearTaskProgress]
    );

    const persistAnswersToLocalStorage = useCallback((taskName, taskAnswers, modulId) => {
        if (!modulId) {
            return;
        }

        try {
            const key = `praktikum:answers:${taskName}:${modulId}`;
            localStorage.setItem(key, JSON.stringify(taskAnswers));
        } catch (error) {
            console.warn("Failed to persist answers", error);
        }
    }, []);

    const handleTaskSubmit = useCallback(
        async (taskName, taskAnswers = answers, silent = false) => {
            if (!taskName || !TASK_NAMES.includes(taskName)) {
                return;
            }

            if (!activeModulId || !praktikanId) {
                if (!silent) {
                    setSubmissionError("Modul aktif atau data praktikan tidak ditemukan.");
                }

                return;
            }

            const config = TASK_CONFIG[taskName];
            if (!config) {
                return;
            }

            const normalizedAnswers = questions.map((question, index) => ({
                question,
                answer: taskAnswers[index],
            }));

            if (config.variant === "multiple-choice") {
                const selectedAnswers = normalizedAnswers.filter(
                    (entry) => entry.answer !== null && entry.answer !== undefined
                );

                if (!selectedAnswers.length && !silent) {
                    setSubmissionError("Pilih minimal satu jawaban sebelum mengirimkan.");

                    return;
                }
            }

            setIsSubmittingTask(true);
            setSubmissionError(null);

            try {
                if (taskName === "Jurnal" && config.fitb) {
                    const fitbPayload = normalizedAnswers
                        .filter((entry) => entry.question.questionType === "fitb")
                        .map((entry) => ({
                            praktikan_id: praktikanId,
                            modul_id: activeModulId,
                            soal_id: entry.question.id,
                            jawaban: typeof entry.answer === "string" ? entry.answer : "",
                        }));

                    const jurnalPayload = normalizedAnswers
                        .filter((entry) => entry.question.questionType !== "fitb")
                        .map((entry) => ({
                            praktikan_id: praktikanId,
                            modul_id: activeModulId,
                            soal_id: entry.question.id,
                            jawaban: typeof entry.answer === "string" ? entry.answer : "",
                        }));

                    if (fitbPayload.length) {
                        await api.post(config.fitb.submitEndpoint, fitbPayload);
                    }

                    if (jurnalPayload.length) {
                        await api.post(config.submitEndpoint, jurnalPayload);
                    }
                } else if (config.variant === "multiple-choice") {
                    const payload = {
                        praktikan_id: praktikanId,
                        modul_id: activeModulId,
                        answers: normalizedAnswers
                            .filter((entry) => entry.answer !== null && entry.answer !== undefined)
                            .map((entry) => ({
                                soal_id: entry.question.id,
                                opsi_id: entry.answer,
                            })),
                    };

                    await api.post(config.submitEndpoint, payload);
                } else {
                    const payload = normalizedAnswers.map((entry) => ({
                        praktikan_id: praktikanId,
                        modul_id: activeModulId,
                        soal_id: entry.question.id,
                        jawaban: typeof entry.answer === "string" ? entry.answer : "",
                    }));

                    await api.post(config.submitEndpoint, payload);
                }

                persistAnswersToLocalStorage(taskName, taskAnswers, activeModulId);
                setCompletedCategories((prev) => ({ ...prev, [taskName]: true }));
                clearTaskProgress();

                if (!silent) {
                    setActiveComponent("NoPraktikumSection");
                }
            } catch (error) {
                console.error("Failed to submit answers", error);
                const message = error?.response?.data?.message ?? error.message ?? "Terjadi kesalahan saat menyimpan jawaban.";
                setSubmissionError(message);
            } finally {
                setIsSubmittingTask(false);
            }
        },
        [activeModulId, answers, clearTaskProgress, persistAnswersToLocalStorage, praktikanId, questions]
    );

    const handleReviewTask = useCallback(
        (taskKey) => {
            if (!taskKey || !TASK_NAMES.includes(taskKey)) {
                return;
            }

            handleNavigate(taskKey);
        },
        [handleNavigate]
    );

    const previousPhaseRef = useRef();

    useEffect(() => {
        previousPhaseRef.current = undefined;
    }, [activeModulId]);

    const ActiveTaskComponent = TASK_COMPONENTS[activeComponent] ?? null;

    const handlePhaseChange = useCallback(
        (currentPhase) => {
            if (currentPhase === "feedback") {
                setIsFeedbackModalOpen(true);
                setActiveComponent("NoPraktikumSection");

                return;
            }

            const targetComponent = PHASE_TO_COMPONENT[currentPhase];
            console.log(`[${new Date().toISOString()}] Phase change received`, {
                phase: currentPhase,
                targetComponent,
            });
            if (targetComponent) {
                handleNavigate(targetComponent);
            }
        },
        [handleNavigate]
    );

    // Combined phase change handler with auto-submit
    useEffect(() => {
        if (!moduleMeta?.current_phase || !activeModulId) {
            previousPhaseRef.current = undefined;

            return;
        }

        const newPhase = moduleMeta.current_phase;
        const previousPhase = previousPhaseRef.current;

        if (previousPhase === newPhase) {
            return;
        }

        previousPhaseRef.current = newPhase;

        const shouldAutoSubmit =
            Boolean(previousPhase) &&
            previousPhase !== newPhase &&
            activeComponent !== "NoPraktikumSection" &&
            answers.length > 0 &&
            !isSubmittingTask &&
            Boolean(activeTask);

        if (shouldAutoSubmit) {
            (async () => {
                try {
                    await handleTaskSubmit(activeTask, answers, true);
                } catch (error) {
                    console.error("Auto-submit failed:", error);
                } finally {
                    handlePhaseChange(newPhase);
                }
            })();

            return;
        }

        handlePhaseChange(newPhase);
    }, [moduleMeta?.current_phase, activeModulId, answers, activeComponent, activeTask, isSubmittingTask, handleTaskSubmit, handlePhaseChange]);

    const handleFeedbackSubmit = async ({ feedback, rating }) => {
        setIsFeedbackPending(true);
        try {
            await api.post('/api-v1/laporan-praktikan', {
                praktikan_id: praktikanId,
                modul_id: activeModulId,
                laporan: feedback,
                rating: rating || null,
            });
            
            setIsFeedbackModalOpen(false);
        } catch (error) {
            console.error('Failed to submit feedback:', error);
            throw error;
        } finally {
            setIsFeedbackPending(false);
        }
    };

    // Join presence channel for online status tracking
    useEffect(() => {
        if (!window.Echo || !kelasId || !praktikanId) {
            return undefined;
        }

        const presenceChannelName = `presence-kelas.${kelasId}`;
        const presenceChannel = window.Echo.join(presenceChannelName);

        presenceChannel
            .error((error) => {
                console.error('Presence channel error:', error);
            });

        return () => {
            window.Echo.leave(presenceChannelName);
        };
    }, [kelasId, praktikanId]);

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
                <div className="mt-[8vh] relative items-center flex flex-col">
                    <div className="flex-1 transition-all duration-300">
                        <NoPraktikumSection
                            isVisible={activeComponent === "NoPraktikumSection"}
                            onNavigate={handleNavigate}
                            completedCategories={completedCategories}
                            setCompletedCategories={setCompletedCategories}
                            onReviewTask={handleReviewTask}
                            kelasId={kelasId}
                            onPraktikumStateChange={handlePraktikumStateChange}
                            moduleMeta={moduleMeta}
                        />
                        {activeComponent !== "NoPraktikumSection" && ActiveTaskComponent && (
                            <ActiveTaskComponent
                                isLoading={isLoadingTask}
                                errorMessage={taskError}
                                setAnswers={setAnswers}
                                answers={answers}
                                questions={questions}
                                setQuestionsCount={setQuestionsCount}
                                onSubmitTask={handleTaskSubmit}
                            />
                        )}
                    </div>
                </div>
            </PraktikanAuthenticated>
            <PraktikanUtilities />

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={isFeedbackModalOpen}
                onClose={() => setIsFeedbackModalOpen(false)}
                onSubmit={handleFeedbackSubmit}
                isPending={isFeedbackPending}
                praktikumId={activeModulId}
            />
        </>
    );
}
