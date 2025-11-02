import { useCallback, useEffect, useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";
import TugasPendahuluan from "@/Components/Praktikans/Sections/TugasPendahuluan";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import {
    useTugasPendahuluanQuery,
} from "@/hooks/useTugasPendahuluanQuery";
import { api } from "@/lib/api";

const normaliseModuleId = (module) => Number(module?.idM ?? module?.id ?? module?.modul_id ?? 0);

const normaliseQuestions = (items) =>
    (items ?? [])
        .filter((item) => item && (item.soal || item.pertanyaan))
        .map((item) => ({
            id: item.id,
            text: item.soal ?? item.pertanyaan ?? "",
            questionType: "essay",
        }));

export default function TugasPendahuluanPage() {
    const { auth } = usePage().props ?? {};
    const praktikan = auth?.praktikan ?? null;
    const praktikanId = praktikan?.id ?? null;

    const kelasName = (praktikan?.kelas?.kelas ?? "").toString();
    const isTotClass = kelasName.toUpperCase().startsWith("TOT");
    const isEnglishClass = Boolean(praktikan?.kelas?.isEnglish);

    const modulesQuery = useModulesQuery({
        onError: (error) => {
            toast.error(error?.message ?? "Gagal memuat daftar modul.");
        },
    });

    const tugasQuery = useTugasPendahuluanQuery({
        onError: (error) => {
            toast.error(error?.message ?? "Gagal memuat konfigurasi tugas pendahuluan.");
        },
    });

    const modules = modulesQuery.data ?? [];
    const tugasPendahuluan = tugasQuery.data ?? [];

    const moduleMap = useMemo(
        () => new Map(modules.map((module) => [normaliseModuleId(module), module])),
        [modules]
    );

    const regularModules = useMemo(
        () => modules.filter((module) => Number(module?.isEnglish ?? 0) !== 1),
        [modules]
    );

    const englishModules = useMemo(
        () => modules.filter((module) => Number(module?.isEnglish ?? 0) === 1),
        [modules]
    );

    const defaultModuleId = useMemo(() => {
        if (!Array.isArray(tugasPendahuluan) || tugasPendahuluan.length === 0) {
            const fallbackModule = isEnglishClass ? englishModules[0] : regularModules[0];
            return fallbackModule ? normaliseModuleId(fallbackModule) : null;
        }

        const activeEntry = tugasPendahuluan.find((item) => {
            const module = moduleMap.get(Number(item.modul_id));
            const isEnglishModule = Number(module?.isEnglish ?? 0) === 1;

            return item.isActive && (isEnglishClass ? isEnglishModule : !isEnglishModule);
        });

        if (activeEntry) {
            return Number(activeEntry.modul_id);
        }

        const fallbackModule = isEnglishClass ? englishModules[0] : regularModules[0];
        return fallbackModule ? normaliseModuleId(fallbackModule) : null;
    }, [
        tugasPendahuluan,
        moduleMap,
        isEnglishClass,
        englishModules,
        regularModules,
    ]);

    const [selectedModul, setSelectedModul] = useState(defaultModuleId ? String(defaultModuleId) : "");

    useEffect(() => {
        if (defaultModuleId) {
            setSelectedModul(String(defaultModuleId));
        }
    }, [defaultModuleId]);

    const questionsQuery = useQuery({
        queryKey: ["tp-questions", selectedModul],
        enabled: Boolean(selectedModul),
        queryFn: async () => {
            try {
                const { data } = await api.get(`/api-v1/soal-tp/${selectedModul}`);
                if (Array.isArray(data?.data)) {
                    return normaliseQuestions(data.data);
                }
                if (Array.isArray(data)) {
                    return normaliseQuestions(data);
                }
                return [];
            } catch (error) {
                if (error?.response?.status === 404) {
                    return [];
                }
                throw error;
            }
        },
    });

    const answersQuery = useQuery({
        queryKey: ["tp-answers", selectedModul],
        enabled: Boolean(selectedModul),
        queryFn: async () => {
            const { data } = await api.get(`/api-v1/jawaban-tp/${selectedModul}`);
            if (Array.isArray(data?.jawaban_tp)) {
                return data.jawaban_tp;
            }
            return [];
        },
    });

    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const data = questionsQuery.data ?? [];
        setQuestions(data);
    }, [questionsQuery.data]);

    useEffect(() => {
        const data = questionsQuery.data ?? [];
        const storedAnswers = answersQuery.data ?? [];
        const answerMap = new Map(
            storedAnswers.map((item) => [Number(item?.soal_id), item?.jawaban ?? ""])
        );

        const initialAnswers = data.map((question) => answerMap.get(Number(question.id)) ?? "");
        setAnswers(initialAnswers);
    }, [answersQuery.data, questionsQuery.data]);

    const submitMutation = useMutation({
        mutationFn: async (payload) => {
            await api.post("/api-v1/jawaban-tp", payload);
        },
        onSuccess: () => {
            toast.success("Jawaban berhasil disimpan.");
            answersQuery.refetch();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal menyimpan jawaban.");
        },
    });

    const handleSubmitTask = useCallback(
        (taskName, currentAnswers) => {
            if (taskName !== "TugasPendahuluan" || !praktikanId || !selectedModul) {
                return;
            }

            const payload = questions.map((question, index) => ({
                soal_id: Number(question.id),
                praktikan_id: praktikanId,
                modul_id: Number(selectedModul),
                jawaban: String(currentAnswers[index] ?? "-").trim() || "-",
            }));

            submitMutation.mutate(payload);
        },
        [praktikanId, selectedModul, questions, submitMutation]
    );

    const handleQuestionsCount = useCallback(() => {}, []);

    const hasModules = modules.length > 0;

    return (
        <>
            <PraktikanAuthenticated
                praktikan={praktikan}
                customWidth="w-[80%]"
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dashboard
                    </h2>
                }
            >
                <Head title="Tugas Pendahuluan" />

                <div className="mt-[8vh] flex flex-col gap-6">
                    <div className="rounded-depth-lg border border-depth bg-depth-card/80 p-6 shadow-depth-lg">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h1 className="text-lg font-semibold text-depth-primary">Pilih Modul</h1>
                                <p className="text-sm text-depth-secondary">
                                    Tentukan modul yang ingin kamu kerjakan terlebih dahulu.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                <select
                                    className="rounded-depth-md border border-depth bg-depth-card/80 px-3 py-2 text-sm text-depth-primary shadow-depth-sm focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)]"
                                    value={selectedModul}
                                    onChange={(event) => setSelectedModul(event.target.value)}
                                    disabled={!hasModules || modulesQuery.isLoading}
                                >
                                    {!hasModules && <option value="">Tidak ada modul tersedia</option>}
                                    {hasModules && (
                                        <>
                                            {regularModules.length > 0 && (
                                                <optgroup label="Reguler">
                                                    {regularModules.map((module) => {
                                                        const moduleId = normaliseModuleId(module);
                                                        return (
                                                            <option key={moduleId} value={moduleId}>
                                                                {module.judul}
                                                            </option>
                                                        );
                                                    })}
                                                </optgroup>
                                            )}
                                            {englishModules.length > 0 && (
                                                <optgroup label="English Lab">
                                                    {englishModules.map((module) => {
                                                        const moduleId = normaliseModuleId(module);
                                                        return (
                                                            <option key={moduleId} value={moduleId}>
                                                                {module.judul}
                                                            </option>
                                                        );
                                                    })}
                                                </optgroup>
                                            )}
                                        </>
                                    )}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        answersQuery.refetch();
                                        questionsQuery.refetch();
                                    }}
                                    className="inline-flex items-center justify-center rounded-depth-md border border-depth bg-depth-interactive px-3 py-2 text-xs font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    disabled={modulesQuery.isLoading || questionsQuery.isLoading}
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    </div>

                    <TugasPendahuluan
                        isLoading={questionsQuery.isLoading}
                        errorMessage={questionsQuery.isError ? (questionsQuery.error?.message ?? "Gagal memuat soal.") : null}
                        questions={questions}
                        answers={answers}
                        setAnswers={setAnswers}
                        setQuestionsCount={handleQuestionsCount}
                        onSubmitTask={handleSubmitTask}
                        tipeSoal="tp"
                        praktikanId={praktikanId}
                        isCommentEnabled={isTotClass}
                        variant="standalone"
                        showSubmitButton={Boolean(selectedModul)}
                        submitLabel={submitMutation.isPending ? "Menyimpan..." : "Simpan Jawaban"}
                    />
                </div>
            </PraktikanAuthenticated>
            <PraktikanUtilities />
        </>
    );
}
