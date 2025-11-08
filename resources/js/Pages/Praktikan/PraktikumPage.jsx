import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Head, router } from "@inertiajs/react";
import debounce from "lodash/debounce";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

const NoPraktikumSection = lazy(() => import("@/Components/Praktikans/Sections/NoPraktikumSection"));
const TesAwal = lazy(() => import("@/Components/Praktikans/Sections/TesAwal"));
const Jurnal = lazy(() => import("@/Components/Praktikans/Sections/Jurnal"));
const Mandiri = lazy(() => import("@/Components/Praktikans/Sections/Mandiri"));
const TesKeterampilan = lazy(() => import("@/Components/Praktikans/Sections/TesKeterampilan"));
const PraktikanUtilities = lazy(() => import("@/Components/Praktikans/Layout/PraktikanUtilities"));
const ScoreDisplayModal = lazy(() => import("@/Components/Modals/ScoreDisplayModal"));

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

const STICKY_TASKS = new Set(["TesAwal", "Mandiri", "TesKeterampilan"]);

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
            enable_file_upload: Boolean(item.enable_file_upload),
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

const reorderQuestionsByIds = (questions, questionIds) => {
    if (!Array.isArray(questionIds) || questionIds.length === 0) {
        return questions;
    }

    const questionMap = new Map();
    questions.forEach((question) => {
        if (question?.id !== undefined && question?.id !== null) {
            questionMap.set(String(question.id), question);
        }
    });

    const ordered = [];
    const usedKeys = new Set();

    questionIds.forEach((id) => {
        const key = String(id);
        if (questionMap.has(key) && !usedKeys.has(key)) {
            ordered.push(questionMap.get(key));
            usedKeys.add(key);
        }
    });

    questions.forEach((question) => {
        const key = question?.id;
        if (key === undefined || key === null) {
            return;
        }
        const normalizedKey = String(key);
        if (!usedKeys.has(normalizedKey)) {
            ordered.push(question);
            usedKeys.add(normalizedKey);
        }
    });

    return ordered;
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
    const hasNavigatedToFeedbackRef = useRef(false);

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

    const fetchStoredQuestionIds = useCallback(
        async (autosaveType, modulId) => {
            if (!praktikanId || !autosaveType || !modulId) {
                return {
                    questionIds: [],
                    hasStoredQuestions: false,
                };
            }

            try {
                const { data } = await api.get("/api-v1/praktikan/autosave/questions", {
                    params: {
                        praktikan_id: praktikanId,
                        modul_id: modulId,
                        tipe_soal: autosaveType,
                    },
                });

                const ids = Array.isArray(data?.question_ids)
                    ? data.question_ids
                        .map((value) => Number(value))
                        .filter((value) => Number.isInteger(value) && value > 0)
                    : [];

                return {
                    questionIds: ids,
                    hasStoredQuestions: Boolean(data?.has_stored_questions),
                };
            } catch (error) {
                console.warn(`[Autosave] Failed to fetch stored question ids for ${autosaveType}`, error);
                return {
                    questionIds: [],
                    hasStoredQuestions: false,
                };
            }
        },
        [praktikanId]
    );

    const persistQuestionIdsSnapshot = useCallback(
        async (autosaveType, modulId, questionIds) => {
            if (!praktikanId || !autosaveType || !modulId) {
                return;
            }

            if (!Array.isArray(questionIds) || questionIds.length === 0) {
                return;
            }

            try {
                await api.post("/api-v1/praktikan/autosave/questions", {
                    praktikan_id: praktikanId,
                    modul_id: modulId,
                    tipe_soal: autosaveType,
                    question_ids: questionIds,
                });
            } catch (error) {
                console.warn(`[Autosave] Failed to persist question ids for ${autosaveType}`, error);
            }
        },
        [praktikanId]
    );


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
                const autosaveType = AUTOSAVE_TYPE_MAP[taskKey];
                const shouldPersistQuestions = autosaveType && STICKY_TASKS.has(taskKey);
                let storedQuestionIds = [];
                let hasStoredQuestionSet = false;

                if (shouldPersistQuestions) {
                    const stored = await fetchStoredQuestionIds(autosaveType, modulId);
                    storedQuestionIds = stored.questionIds ?? [];
                    hasStoredQuestionSet = Boolean(stored.hasStoredQuestions);
                }

                const questionConfig = storedQuestionIds.length > 0
                    ? { params: { question_ids: storedQuestionIds } }
                    : undefined;

                const questionResponse = await api.get(
                    config.questionEndpoint(modulId),
                    questionConfig
                );

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

                if (shouldPersistQuestions) {
                    const normalizedIds = normalizedQuestions
                        .map((question) => question?.id)
                        .filter((id) => id !== undefined && id !== null);

                    if (!hasStoredQuestionSet && normalizedIds.length > 0) {
                        await persistQuestionIdsSnapshot(autosaveType, modulId, normalizedIds);
                        storedQuestionIds = normalizedIds;
                        hasStoredQuestionSet = true;
                    }

                    if (storedQuestionIds.length > 0) {
                        normalizedQuestions = reorderQuestionsByIds(
                            normalizedQuestions,
                            storedQuestionIds
                        );
                    }
                }

                const defaultAnswers = normalizedQuestions.map((question) =>
                    question.questionType === "multiple-choice" ? null : ""
                );

                setQuestions(normalizedQuestions);
                setQuestionsCount(normalizedQuestions.length);

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
        [clearTaskProgress, fetchStoredQuestionIds, persistQuestionIdsSnapshot, praktikanId]
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
        if (moduleMeta?.current_phase !== "feedback") {
            hasNavigatedToFeedbackRef.current = false;
        }
    }, [moduleMeta?.current_phase]);

    const ActiveTaskComponent = TASK_COMPONENTS[activeComponent] ?? null;
    const activeTaskConfig = TASK_CONFIG[activeComponent] ?? null;
    const activeCommentType = activeTaskConfig?.commentType ?? null;
    const reminderModuleLabel = useMemo(() => {
        if (moduleMeta?.modul?.judul) {
            return moduleMeta.modul.judul;
        }

        if (moduleMeta?.modul_name) {
            return moduleMeta.modul_name;
        }

        if (feedbackReminder.modulId) {
            return `Modul #${feedbackReminder.modulId}`;
        }

        return null;
    }, [feedbackReminder.modulId, moduleMeta?.modul?.judul, moduleMeta?.modul_name]);
    const showFeedbackReminderBanner = feedbackReminder.isPending;

    const navigateToFeedback = useCallback(
        (options = {}) => {
            const primaryModulId = options.modulId ?? feedbackReminder.modulId ?? activeModulId;

            if (!primaryModulId) {
                toast.error("Modul feedback tidak ditemukan.");
                return;
            }

            const query = { modul_id: primaryModulId };
            const assistantCandidate = options.asistenId ?? feedbackReminder.asistenId ?? moduleMeta?.pj_id ?? null;

            if (assistantCandidate) {
                query.asisten_id = assistantCandidate;
            }

            hasNavigatedToFeedbackRef.current = true;
            router.visit(route("praktikum.feedback", query));
        },
        [activeModulId, feedbackReminder.asistenId, feedbackReminder.modulId, moduleMeta?.pj_id],
    );

    const handlePhaseChange = useCallback(
        (currentPhase) => {
            if (currentPhase === "feedback") {
                if (!hasNavigatedToFeedbackRef.current) {
                    navigateToFeedback({
                        modulId: moduleMeta?.modul_id ?? activeModulId ?? feedbackReminder.modulId ?? null,
                        asistenId: moduleMeta?.pj_id ?? feedbackReminder.asistenId ?? null,
                    });
                }
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
        [activeModulId, feedbackReminder.asistenId, feedbackReminder.modulId, handleNavigate, moduleMeta?.modul_id, moduleMeta?.pj_id, navigateToFeedback]
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
                <Head title="Praktikum Praktikan" />
                <div className="mt-[8vh] relative items-center flex flex-col">
                    <div className="flex-1 transition-all duration-300">
                        {showFeedbackReminderBanner && (
                            <div className="mb-4 rounded-depth-lg border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900 shadow-depth-sm">
                                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <p className="font-semibold">Feedback praktikum belum terkirim</p>
                                        <p className="text-xs text-amber-800/80">
                                            Segera lengkapi feedback untuk {reminderModuleLabel ?? "modul terkait"} sebelum meninggalkan halaman.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => navigateToFeedback()}
                                        className="inline-flex items-center justify-center rounded-depth-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    >
                                        Buka Form Feedback
                                    </button>
                                </div>
                            </div>
                        )}
                        <Suspense fallback={<div className="mt-6 text-sm text-depth-secondary">Memuat status praktikum...</div>}>
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
                        </Suspense>
                        {activeComponent !== "NoPraktikumSection" && ActiveTaskComponent && (
                            <Suspense fallback={<div className="mt-6 text-sm text-depth-secondary">Memuat soal...</div>}>
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
                            </Suspense>
                        )}
                    </div>
                </div>
            </PraktikanAuthenticated>
            <Suspense fallback={null}>
                <PraktikanUtilities />
            </Suspense>
            <Suspense fallback={null}>
                <ScoreDisplayModal
                    isOpen={scoreModalState.isOpen}
                    onClose={closeScoreModal}
                    phaseType={scoreModalState.phaseType}
                    correctAnswers={scoreModalState.correctAnswers}
                    totalQuestions={scoreModalState.totalQuestions}
                    percentage={scoreModalState.percentage}
                    isTotClass={isTotClass}
                />
            </Suspense>
        </>
    );
}
