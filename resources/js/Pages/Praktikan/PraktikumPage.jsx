import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import Clock from "@/Components/Assistants/Common/Clock";
import ModalSoftware from "@/Components/Assistants/Modals/ModalSoftware";
import NoPraktikumSection from "@/Components/Praktikans/Sections/NoPraktikumSection";
import TimerPraktikan from "@/Components/Praktikans/Sections/TimerPraktikan";
import TugasPendahuluan from "@/Components/Praktikans/Sections/TugasPendahuluan";
import TesAwal from "@/Components/Praktikans/Sections/TesAwal";
import Jurnal from "@/Components/Praktikans/Sections/Jurnal";
import Mandiri from "@/Components/Praktikans/Sections/Mandiri";
import TesKeterampilan from "@/Components/Praktikans/Sections/TesKeterampilan";
import { api } from "@/lib/api";

const ATTEMPT_COMPONENTS = [
    "TugasPendahuluan",
    "TesAwal",
    "Jurnal",
    "Mandiri",
    "TesKeterampilan",
];

const TASK_CONFIG = {
    TugasPendahuluan: {
        questionEndpoint: (modulId) => `/api-v1/soal-tp/${modulId}`,
        answerEndpoint: (modulId) => `/api-v1/jawaban-tp/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-tp",
        variant: "essay",
    },
    TesAwal: {
        questionEndpoint: (modulId) => `/api-v1/soal-ta/${modulId}`,
        answerEndpoint: (modulId) => `/api-v1/jawaban-ta/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-ta",
        variant: "multiple-choice",
    },
    Jurnal: {
        questionEndpoint: (modulId) => `/api-v1/soal-jurnal/${modulId}`,
        answerEndpoint: (modulId) => `/api-v1/jawaban-jurnal/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-jurnal",
        variant: "essay",
        fitb: {
            questionEndpoint: (modulId) => `/api-v1/soal-fitb/${modulId}`,
            answerEndpoint: (modulId) => `/api-v1/jawaban-fitb/${modulId}`,
            submitEndpoint: "/api-v1/jawaban-fitb",
        },
    },
    Mandiri: {
        questionEndpoint: (modulId) => `/api-v1/soal-tm/${modulId}`,
        answerEndpoint: (modulId) => `/api-v1/jawaban-tm/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-tm",
        variant: "essay",
    },
    TesKeterampilan: {
        questionEndpoint: (modulId) => `/api-v1/soal-tk/${modulId}`,
        answerEndpoint: (modulId) => `/api-v1/jawaban-tk/${modulId}`,
        submitEndpoint: "/api-v1/jawaban-tk",
        variant: "multiple-choice",
    },
};

const PHASE_TO_COMPONENT = {
    ta: "TesAwal",
    fitb_jurnal: "Jurnal",
    mandiri: "Mandiri",
    tk: "TesKeterampilan",
};

const INITIAL_COMPLETED_STATE = {
    TugasPendahuluan: false,
    TesAwal: false,
    Jurnal: false,
    Mandiri: false,
    TesKeterampilan: false,
};

export default function PraktikumPage({ auth }) {
    const [activeComponent, setActiveComponent] = useState("NoPraktikumSection");
    const [showTimer, setShowTimer] = useState(false);
    const [contentShift, setContentShift] = useState("0px");
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(1);
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

    const praktikanData = auth?.praktikan ?? auth?.user ?? null;
    const praktikanId = praktikanData?.id ?? null;
    const kelasId =
        praktikanData?.kelas_id ??
        praktikanData?.kelasId ??
        praktikanData?.kelas?.id ??
        null;

    useEffect(() => {
        if (
            ![
                "NoPraktikumSection",
                "TugasPendahuluan",
                "TesAwal",
                "Jurnal",
                "Mandiri",
                "TesKeterampilan",
            ].includes(activeComponent)
        ) {
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
            setCompletedCategories(INITIAL_COMPLETED_STATE);

            return;
        }

        try {
            const stored = localStorage.getItem(localStorageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                setCompletedCategories({ ...INITIAL_COMPLETED_STATE, ...parsed });
            } else {
                setCompletedCategories(INITIAL_COMPLETED_STATE);
            }
        } catch (error) {
            console.error("Failed to restore completed categories", error);
            setCompletedCategories(INITIAL_COMPLETED_STATE);
        }
    }, [localStorageKey]);

    useEffect(() => {
        if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(completedCategories));
        }
    }, [completedCategories, localStorageKey]);

    const normalizeEssayQuestions = useCallback((items, questionType = "essay") => {
        return items
            .filter((item) => item && (item.soal || item.pertanyaan))
            .map((item) => ({
                id: item.id,
                text: item.soal ?? item.pertanyaan ?? "",
                questionType,
            }));
    }, []);

    const normalizeMultipleChoiceQuestions = useCallback((items, questionType = "multiple-choice") => {
        return items
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
    }, []);

    const buildAnswerMap = useCallback((taskKey, payload) => {
        if (!payload) {
            return new Map();
        }

        switch (taskKey) {
            case "TugasPendahuluan":
                return new Map(
                    (payload.jawaban_tp ?? []).map((item) => [item.soal_id, item.jawaban ?? ""])
                );
            case "Jurnal":
                return new Map(
                    (payload.jawaban_jurnal ?? []).map((item) => [item.soal_id, item.jawaban ?? ""])
                );
            case "Mandiri":
                return new Map(
                    (payload.jawaban_mandiri ?? []).map((item) => [item.soal_id, item.jawaban ?? ""])
                );
            case "TesAwal":
                return new Map(
                    (payload.jawaban_ta ?? []).map((item) => [item.soal_id, item.selected_opsi_id ?? null])
                );
            case "TesKeterampilan":
                return new Map(
                    (payload.jawaban_tk ?? []).map((item) => [item.soal_id, item.selected_opsi_id ?? null])
                );
            default:
                return new Map();
        }
    }, []);

    const fetchTaskData = useCallback(
        async (taskKey, modulId) => {
            const config = TASK_CONFIG[taskKey];
            if (!config || !modulId) {
                setQuestions([]);
                setAnswers([]);
                setQuestionsCount(0);
                setCurrentQuestion(0);

                return;
            }

            setIsLoadingTask(true);
            setTaskError(null);
            setSubmissionError(null);

            try {
                const questionPromise = api.get(config.questionEndpoint(modulId));
                const answerPromise = config.answerEndpoint
                    ? api
                          .get(config.answerEndpoint(modulId))
                          .then((response) => response.data)
                          .catch((error) => {
                              const status = error?.response?.status;
                              if (status === 403 || status === 404) {
                                  return null;
                              }

                              throw error;
                          })
                    : Promise.resolve(null);

                const [questionResponse, answerPayload] = await Promise.all([questionPromise, answerPromise]);

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

                const rawQuestions = extractQuestions(questionResponse);

                let normalizedQuestions = [];
                let answerMap = buildAnswerMap(taskKey, answerPayload);

                if (taskKey === "Jurnal" && config.fitb) {
                    const [fitbQuestionResponse, fitbAnswerPayload] = await Promise.all([
                        api
                            .get(config.fitb.questionEndpoint(modulId))
                            .catch(() => ({ data: [] })),
                        api
                            .get(config.fitb.answerEndpoint(modulId))
                            .then((response) => response.data)
                            .catch((error) => {
                                const status = error?.response?.status;
                                if (status === 403 || status === 404) {
                                    return null;
                                }

                                throw error;
                            }),
                    ]);

                    const rawFitbQuestions = extractQuestions(fitbQuestionResponse);
                    const fitbQuestions = normalizeEssayQuestions(rawFitbQuestions, "fitb");
                    const fitbAnswerMap = new Map(
                        (fitbAnswerPayload?.jawaban_fitb ?? []).map((item) => [item.soal_id, item.jawaban ?? ""])
                    );

                    answerMap = new Map([...answerMap, ...fitbAnswerMap]);

                    const jurnalQuestions = normalizeEssayQuestions(rawQuestions, "jurnal");
                    normalizedQuestions = [...fitbQuestions, ...jurnalQuestions];
                } else {
                    normalizedQuestions =
                        config.variant === "multiple-choice"
                            ? normalizeMultipleChoiceQuestions(rawQuestions)
                            : normalizeEssayQuestions(rawQuestions);
                }

                const initialAnswers = normalizedQuestions.map((question) => {
                    if (question.questionType === "multiple-choice") {
                        return answerMap.get(question.id) ?? null;
                    }

                    return answerMap.get(question.id) ?? "";
                });

                setQuestions(normalizedQuestions);
                setAnswers(initialAnswers);
                setQuestionsCount(normalizedQuestions.length);
                setCurrentQuestion(normalizedQuestions.length ? 1 : 0);
            } catch (error) {
                console.error("Failed to fetch task data", error);
                const message = error?.response?.data?.message ?? error.message ?? "Gagal memuat data tugas.";
                setTaskError(message);
                setQuestions([]);
                setAnswers([]);
                setQuestionsCount(0);
                setCurrentQuestion(0);
            } finally {
                setIsLoadingTask(false);
            }
        },
        [buildAnswerMap, normalizeEssayQuestions, normalizeMultipleChoiceQuestions]
    );

    const handlePraktikumStateChange = useCallback((praktikumState) => {
        if (!praktikumState) {
            setActiveModulId(null);
            setModuleMeta(null);

            return;
        }

        setActiveModulId(praktikumState.modul_id ?? null);
        setModuleMeta(praktikumState);
    }, []);

    const handleNavigate = useCallback(
        (componentName) => {
            setActiveComponent(componentName);

            if (ATTEMPT_COMPONENTS.includes(componentName)) {
                setActiveTask(componentName);
                setShowTimer(true);
                if (activeModulId) {
                    fetchTaskData(componentName, activeModulId);
                } else {
                    setQuestions([]);
                    setAnswers([]);
                    setQuestionsCount(0);
                    setCurrentQuestion(0);
                }
            } else {
                setActiveTask(null);
                setShowTimer(false);
            }
        },
        [activeModulId, fetchTaskData]
    );

    const handleShiftContent = useCallback((shiftValue) => {
        setContentShift(shiftValue);
    }, []);

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
        async (taskName, taskAnswers = answers) => {
            if (!taskName || !ATTEMPT_COMPONENTS.includes(taskName)) {
                return;
            }

            if (!activeModulId || !praktikanId) {
                setSubmissionError("Modul aktif atau data praktikan tidak ditemukan.");

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
                const selectedCount = normalizedAnswers.filter(
                    (entry) => entry.answer !== null && entry.answer !== undefined
                ).length;
                if (selectedCount === 0) {
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

                    if (fitbPayload.length > 0) {
                        await api.post(config.fitb.submitEndpoint, fitbPayload);
                    }

                    if (jurnalPayload.length > 0) {
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

                setActiveComponent("NoPraktikumSection");
                setShowTimer(false);
            } catch (error) {
                console.error("Failed to submit answers", error);
                const message = error?.response?.data?.message ?? error.message ?? "Terjadi kesalahan saat menyimpan jawaban.";
                setSubmissionError(message);
            } finally {
                setIsSubmittingTask(false);
            }
        },
        [activeModulId, answers, persistAnswersToLocalStorage, praktikanId, questions]
    );

    const handleReviewTask = useCallback((taskKey) => {
        if (!taskKey) {
            return;
        }

        setActiveTask(taskKey);
        const reviewComponent = REVIEW_COMPONENT_BY_TASK[taskKey] ?? "NoPraktikumSection";
        setActiveComponent(reviewComponent);
        setShowTimer(false);
    }, []);

    const resetTimer = useCallback(() => {
        setShowTimer(false);
    }, []);

    const previousPhaseRef = useRef();

    useEffect(() => {
        previousPhaseRef.current = undefined;
    }, [activeModulId]);

    useEffect(() => {
        if (!moduleMeta?.current_phase || !activeModulId) {
            return;
        }

        if (previousPhaseRef.current === moduleMeta.current_phase) {
            return;
        }

        previousPhaseRef.current = moduleMeta.current_phase;

        const targetComponent = PHASE_TO_COMPONENT[moduleMeta.current_phase];
        if (!targetComponent) {
            return;
        }

        handleNavigate(targetComponent);
    }, [moduleMeta?.current_phase, activeModulId, handleNavigate]);

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
                <div className="mt-[8vh] relative">
                    <div
                        className="flex-1 transition-all duration-300"
                        style={{ marginRight: contentShift }}
                    >
                        {activeComponent === "NoPraktikumSection" && (
                            <NoPraktikumSection
                                onNavigate={handleNavigate}
                                completedCategories={completedCategories}
                                setCompletedCategories={setCompletedCategories}
                                onReviewTask={handleReviewTask}
                                kelasId={kelasId}
                                onPraktikumStateChange={handlePraktikumStateChange}
                                moduleMeta={moduleMeta}
                            />
                        )}
                        {activeComponent === "TugasPendahuluan" && (
                            <TugasPendahuluan
                                isLoading={isLoadingTask}
                                errorMessage={taskError}
                                setAnswers={setAnswers}
                                answers={answers}
                                questions={questions}
                                setQuestionsCount={setQuestionsCount}
                                onSubmitTask={handleTaskSubmit}
                            />
                        )}
                        {activeComponent === "TesAwal" && (
                            <TesAwal
                                isLoading={isLoadingTask}
                                errorMessage={taskError}
                                setAnswers={setAnswers}
                                answers={answers}
                                questions={questions}
                                setQuestionsCount={setQuestionsCount}
                                onSubmitTask={handleTaskSubmit}
                            />
                        )}
                        {activeComponent === "Jurnal" && (
                            <Jurnal
                                isLoading={isLoadingTask}
                                errorMessage={taskError}
                                setAnswers={setAnswers}
                                answers={answers}
                                questions={questions}
                                setQuestionsCount={setQuestionsCount}
                                onSubmitTask={handleTaskSubmit}
                            />
                        )}
                        {activeComponent === "Mandiri" && (
                            <Mandiri
                                isLoading={isLoadingTask}
                                errorMessage={taskError}
                                setAnswers={setAnswers}
                                answers={answers}
                                questions={questions}
                                setQuestionsCount={setQuestionsCount}
                                onSubmitTask={handleTaskSubmit}
                            />
                        )}
                        {activeComponent === "TesKeterampilan" && (
                            <TesKeterampilan
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

                {showTimer && ATTEMPT_COMPONENTS.includes(activeComponent) && (
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
                        submissionError={submissionError}
                        isSubmitting={isSubmittingTask}
                    />
                )}
            </PraktikanAuthenticated>
            <Clock />
            <ModalSoftware />
        </>
    );
}
