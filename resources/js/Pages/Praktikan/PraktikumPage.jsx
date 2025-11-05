import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import NoPraktikumSection from "@/Components/Praktikans/Sections/NoPraktikumSection";
import TesAwal from "@/Components/Praktikans/Sections/TesAwal";
import Jurnal from "@/Components/Praktikans/Sections/Jurnal";
import Mandiri from "@/Components/Praktikans/Sections/Mandiri";
import TesKeterampilan from "@/Components/Praktikans/Sections/TesKeterampilan";
import { api } from "@/lib/api";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";
import FeedbackModal from "@/Components/Modals/FeedbackModal";
import ScoreDisplayModal from "@/Components/Modals/ScoreDisplayModal";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";

const TASK_COMPONENTS = {
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
    TesAwal: {
        questionEndpoint: (modulId) => `/api-v1/soal-ta/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-ta",
        variant: "multiple-choice",
        commentType: "ta",
    },
    Jurnal: {
        questionEndpoint: (modulId) => `/api-v1/soal-jurnal/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-jurnal",
        variant: "essay",
        commentType: "jurnal",
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
        commentType: "mandiri",
    },
    TesKeterampilan: {
        questionEndpoint: (modulId) => `/api-v1/soal-tk/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-tk",
        variant: "multiple-choice",
        commentType: "tk",
    },
};

const AUTOSAVE_TYPE_MAP = {
    TesAwal: "ta",
    Jurnal: "jurnal",
    Mandiri: "mandiri",
    TesKeterampilan: "tk",
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
    const [feedbackReminder, setFeedbackReminder] = useState({
        isPending: false,
        modulId: null,
        asistenId: null,
    });
    const [scoreModalState, setScoreModalState] = useState({
        isOpen: false,
        phaseType: null,
        correctAnswers: 0,
        totalQuestions: 0,
        percentage: 0,
    });

    const autosaveDebouncersRef = useRef({});
    const isRestoringAutosaveRef = useRef(false);

    const praktikanData = auth?.praktikan ?? auth?.user ?? null;
    const praktikanId = praktikanData?.id ?? null;
    const kelasId =
        praktikanData?.kelas_id ??
        praktikanData?.kelas?.id ??
        null;
    const kelasName = praktikanData?.kelas?.kelas ?? "";
    const isTotClass = kelasName.trim().toUpperCase().startsWith("TOT");

    const clearTaskProgress = useCallback(() => {
        setQuestions([]);
        setAnswers([]);
        setQuestionsCount(0);
    }, []);

    const { data: assistantOptions = [] } = useAsistensQuery();

    const getAutosaveHandler = useCallback((tipeSoal) => {
        if (!tipeSoal) {
            return null;
        }

        if (!autosaveDebouncersRef.current[tipeSoal]) {
            autosaveDebouncersRef.current[tipeSoal] = debounce(async (payload) => {
                try {
                    await api.post("/api-v1/praktikan/autosave", payload);
                } catch (error) {
                    console.warn(`[Autosave] Failed to save ${tipeSoal} snapshot`, error);
                }
            }, 600);
        }

        return autosaveDebouncersRef.current[tipeSoal];
    }, []);

    useEffect(() => {
        return () => {
            Object.values(autosaveDebouncersRef.current).forEach((handler) => {
                if (handler && typeof handler.cancel === "function") {
                    handler.cancel();
                }
            });
        };
    }, []);

    const resetActiveTaskState = useCallback(() => {
        clearTaskProgress();
        setActiveTask(null);
    }, [clearTaskProgress]);

    const scoreFetchLocksRef = useRef(new Set());

    const closeScoreModal = useCallback(() => {
        setScoreModalState((previous) => ({
            ...previous,
            isOpen: false,
        }));
    }, []);

    const fetchPhaseScore = useCallback(
        async (phase) => {
            if (!praktikanId || !activeModulId || !["ta", "tk"].includes(phase)) {
                return;
            }

            const cacheKey = `${phase}:${activeModulId}`;
            if (scoreFetchLocksRef.current.has(cacheKey)) {
                return;
            }

            scoreFetchLocksRef.current.add(cacheKey);

            try {
                const endpoint =
                    phase === "ta"
                        ? `/api-v1/nilai-ta/${praktikanId}/${activeModulId}`
                        : `/api-v1/nilai-tk/${praktikanId}/${activeModulId}`;

                const { data } = await api.get(endpoint);

                const totalQuestions = data?.total_questions ?? data?.totalQuestions ?? 0;
                const correctAnswersRaw = data?.correct_answers ?? data?.correctAnswers;
                const resolvedPercentage = typeof data?.score === "number" ? data.score : null;
                const correctAnswers =
                    typeof correctAnswersRaw === "number"
                        ? correctAnswersRaw
                        : totalQuestions > 0 && typeof resolvedPercentage === "number"
                            ? Math.round((resolvedPercentage / 100) * totalQuestions)
                            : 0;

                const percentage =
                    typeof resolvedPercentage === "number"
                        ? resolvedPercentage
                        : totalQuestions > 0
                            ? (correctAnswers / totalQuestions) * 100
                            : 0;

                setScoreModalState({
                    isOpen: true,
                    phaseType: phase,
                    correctAnswers,
                    totalQuestions,
                    percentage,
                });
            } catch (error) {
                console.error(`Failed to fetch ${phase.toUpperCase()} score`, error);
                scoreFetchLocksRef.current.delete(cacheKey);
            }
        },
        [praktikanId, activeModulId]
    );

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

                const defaultAnswers = normalizedQuestions.map((question) =>
                    question.questionType === "multiple-choice" ? null : ""
                );

                setQuestions(normalizedQuestions);
                setQuestionsCount(normalizedQuestions.length);

                const autosaveType = AUTOSAVE_TYPE_MAP[taskKey];
                let answersToUse = defaultAnswers;

                if (autosaveType && praktikanId) {
                    try {
                        const { data: autosaveResponse } = await api.get("/api-v1/praktikan/autosave", {
                            params: {
                                praktikan_id: praktikanId,
                                modul_id: modulId,
                                tipe_soal: autosaveType,
                            },
                        });

                        const snapshotList = Array.isArray(autosaveResponse?.data)
                            ? autosaveResponse.data
                            : [];
                        const snapshot = snapshotList.find(
                            (item) => item?.tipe_soal === autosaveType
                        );

                        if (snapshot?.jawaban && typeof snapshot.jawaban === "object") {
                            answersToUse = normalizedQuestions.map((question) => {
                                const questionId = question?.id;
                                if (!questionId) {
                                    return question.questionType === "multiple-choice" ? null : "";
                                }

                                const storedAnswer = snapshot.jawaban[questionId];
                                if (storedAnswer === undefined || storedAnswer === null) {
                                    return question.questionType === "multiple-choice" ? null : "";
                                }

                                if (question.questionType === "multiple-choice") {
                                    return storedAnswer;
                                }

                                const textAnswer =
                                    typeof storedAnswer === "string"
                                        ? storedAnswer
                                        : String(storedAnswer ?? "");

                                return textAnswer;
                            });
                        }
                    } catch (error) {
                        console.warn(`[Autosave] Failed to load ${autosaveType} snapshot`, error);
                    }
                }

                isRestoringAutosaveRef.current = true;
                setAnswers(answersToUse);
                setTimeout(() => {
                    isRestoringAutosaveRef.current = false;
                }, 0);
            } catch (error) {
                console.error("Failed to fetch task data", error);
                const message = error?.response?.data?.message ?? error.message ?? "Gagal memuat data tugas.";
                setTaskError(message);
                clearTaskProgress();
            } finally {
                setIsLoadingTask(false);
            }
        },
        [clearTaskProgress, praktikanId]
    );

    useEffect(() => {
        const currentTask = activeTask;
        const autosaveType = AUTOSAVE_TYPE_MAP[currentTask];

        if (!autosaveType || !praktikanId || !activeModulId) {
            return;
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            return;
        }

        if (!Array.isArray(answers) || answers.length === 0) {
            return;
        }

        if (isRestoringAutosaveRef.current) {
            return;
        }

        const jawabanEntries = {};

        questions.forEach((question, index) => {
            const questionId = question?.id;
            if (!questionId) {
                return;
            }

            const answerValue = answers[index];
            if (question.questionType === "multiple-choice") {
                if (answerValue === null || answerValue === undefined) {
                    return;
                }

                jawabanEntries[questionId] = answerValue;

                return;
            }

            const textAnswer = typeof answerValue === "string" ? answerValue : String(answerValue ?? "");
            if (textAnswer.trim() === "") {
                return;
            }

            jawabanEntries[questionId] = textAnswer;
        });

        if (Object.keys(jawabanEntries).length === 0) {
            return;
        }

        const debouncedSaver = getAutosaveHandler(autosaveType);
        if (!debouncedSaver) {
            return;
        }

        debouncedSaver({
            praktikan_id: praktikanId,
            modul_id: activeModulId,
            tipe_soal: autosaveType,
            jawaban: jawabanEntries,
        });
    }, [answers, questions, activeTask, praktikanId, activeModulId, getAutosaveHandler]);

    const handlePraktikumStateChange = useCallback(
        (praktikumState) => {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] Praktikum state update:`, praktikumState);
            if (!praktikumState) {
                setActiveModulId(null);
                setModuleMeta(null);
                resetActiveTaskState();
                setActiveComponent("NoPraktikumSection");
                setFeedbackReminder({ isPending: false, modulId: null, asistenId: null });

                return;
            }

            const pending = Boolean(praktikumState.feedback_pending ?? praktikumState.feedbackPending);
            const pendingModulId = praktikumState.feedback_modul_id ?? praktikumState.modul_id ?? null;
            const pendingAsistenId = praktikumState.feedback_asisten_id ?? praktikumState.pj_id ?? null;

            setFeedbackReminder({
                isPending: pending,
                modulId: pendingModulId,
                asistenId: pendingAsistenId,
            });

            setActiveModulId(praktikumState.modul_id ?? pendingModulId ?? null);
            setModuleMeta(praktikumState);

            if (praktikumState.status === "exited" || praktikumState.status === "paused") {
                resetActiveTaskState();
                setActiveComponent("NoPraktikumSection");
            }

            // Only open feedback modal on explicit phase change, not on refresh with pending feedback
            if (praktikumState.current_phase === "feedback" && !isFeedbackModalOpen) {
                setIsFeedbackModalOpen(true);
            }
            // Note: pending feedback reminder is tracked in feedbackReminder state
            // but modal won't auto-open on page refresh to avoid disrupting user flow
        },
        [resetActiveTaskState, isFeedbackModalOpen]
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

                const autosaveType = AUTOSAVE_TYPE_MAP[taskName];
                if (autosaveType) {
                    try {
                        await api.delete("/api-v1/praktikan/autosave", {
                            data: {
                                praktikan_id: praktikanId,
                                modul_id: activeModulId,
                                tipe_soal: autosaveType,
                            },
                        });
                    } catch (error) {
                        console.warn(`[Autosave] Failed to clear ${autosaveType} snapshot`, error);
                    }
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

    useEffect(() => {
        scoreFetchLocksRef.current = new Set();
        setScoreModalState({
            isOpen: false,
            phaseType: null,
            correctAnswers: 0,
            totalQuestions: 0,
            percentage: 0,
        });
    }, [activeModulId]);

    useEffect(() => {
        if (!activeModulId) {
            return;
        }

        const currentPhase = moduleMeta?.current_phase;
        if (currentPhase && ["ta", "tk"].includes(currentPhase)) {
            const key = `${currentPhase}:${activeModulId}`;
            scoreFetchLocksRef.current.delete(key);
        }
    }, [moduleMeta?.current_phase, activeModulId]);

    useEffect(() => {
        if (moduleMeta?.current_phase !== "feedback" && !feedbackReminder.isPending && isFeedbackModalOpen) {
            setIsFeedbackModalOpen(false);
        }
    }, [moduleMeta?.current_phase, feedbackReminder.isPending, isFeedbackModalOpen]);

    const ActiveTaskComponent = TASK_COMPONENTS[activeComponent] ?? null;
    const activeTaskConfig = TASK_CONFIG[activeComponent] ?? null;
    const activeCommentType = activeTaskConfig?.commentType ?? null;

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

        const shouldShowScore = ["ta", "tk"].includes(previousPhase ?? "");

        if (shouldAutoSubmit) {
            (async () => {
                try {
                    await handleTaskSubmit(activeTask, answers, true);
                    if (shouldShowScore) {
                        await fetchPhaseScore(previousPhase);
                    }
                } catch (error) {
                    console.error("Auto-submit failed:", error);
                } finally {
                    handlePhaseChange(newPhase);
                }
            })();

            return;
        }

        if (shouldShowScore) {
            fetchPhaseScore(previousPhase);
        }

        handlePhaseChange(newPhase);
    }, [moduleMeta?.current_phase, activeModulId, answers, activeComponent, activeTask, isSubmittingTask, handleTaskSubmit, handlePhaseChange, fetchPhaseScore]);

    const handleFeedbackSubmit = async ({ feedback, rating_praktikum, rating_asisten, asisten_id }) => {
        setIsFeedbackPending(true);
        try {
            const resolvedModulId = feedbackReminder.modulId ?? activeModulId;

            if (!resolvedModulId) {
                throw new Error("Modul feedback tidak ditemukan.");
            }

            await api.post('/api-v1/laporan-praktikan', {
                praktikan_id: praktikanId,
                modul_id: resolvedModulId,
                laporan: feedback,
                pesan: feedback,
                rating: rating_praktikum ?? null,
                rating_praktikum: rating_praktikum ?? null,
                rating_asisten: rating_asisten ?? null,
                asisten_id: asisten_id ?? null,
            });

            setIsFeedbackModalOpen(false);
            setFeedbackReminder({ isPending: false, modulId: null, asistenId: null });
            setModuleMeta((previous) => {
                if (!previous) {
                    return previous;
                }

                return {
                    ...previous,
                    feedback_pending: false,
                };
            });

            try {
                const { data: refreshData } = await api.get('/api-v1/praktikum/check-praktikum');
                if (refreshData?.status === 'success') {
                    const refreshedPayload = refreshData?.data ?? null;
                    const refreshedPending = refreshData?.feedback_pending ?? refreshedPayload?.feedback_pending ?? false;
                    const mergedPayload = refreshedPayload ? { ...refreshedPayload } : null;
                    const payloadHasMeta = refreshedPending || (refreshData?.feedback_modul_id ?? null) !== null;

                    if (mergedPayload || payloadHasMeta) {
                        handlePraktikumStateChange({
                            ...(mergedPayload ?? {}),
                            feedback_pending: refreshedPending,
                            feedback_modul_id: refreshData?.feedback_modul_id ?? mergedPayload?.feedback_modul_id ?? mergedPayload?.modul_id ?? null,
                            feedback_asisten_id: refreshData?.feedback_asisten_id ?? mergedPayload?.feedback_asisten_id ?? mergedPayload?.pj_id ?? null,
                        });
                    } else {
                        handlePraktikumStateChange(null);
                    }
                }
            } catch (refreshError) {
                console.warn('Failed to refresh praktikum state after feedback submission', refreshError);
            }
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
                                tipeSoal={activeCommentType}
                                praktikanId={praktikanId}
                                isCommentEnabled={isTotClass && Boolean(activeCommentType)}
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
                praktikumId={feedbackReminder.modulId ?? activeModulId}
                assistantOptions={assistantOptions}
                defaultAssistantId={feedbackReminder.asistenId ?? moduleMeta?.pj_id ?? null}
                modulLabel={moduleMeta?.modul?.judul ?? moduleMeta?.modul_name ?? null}
            />

            <ScoreDisplayModal
                isOpen={scoreModalState.isOpen}
                onClose={closeScoreModal}
                phaseType={scoreModalState.phaseType}
                correctAnswers={scoreModalState.correctAnswers}
                totalQuestions={scoreModalState.totalQuestions}
                percentage={scoreModalState.percentage}
            />
        </>
    );
}
