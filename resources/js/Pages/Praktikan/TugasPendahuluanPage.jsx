import { useCallback, useEffect, useMemo, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import PraktikanAuthenticated from "@/Layouts/PraktikanAuthenticatedLayout";
import PraktikanUtilities from "@/Components/Praktikans/Layout/PraktikanUtilities";
import TugasPendahuluan from "@/Components/Praktikans/Sections/TugasPendahuluan";
import PraktikanPageHeader from "@/Components/Praktikans/Common/PraktikanPageHeader";
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

    const activeModuleEntry = useMemo(() => {
        if (!Array.isArray(tugasPendahuluan) || tugasPendahuluan.length === 0) {
            return null;
        }

        return (
            tugasPendahuluan.find((item) => {
                const module = moduleMap.get(Number(item.modul_id));
                if (!module) {
                    return false;
                }
                const isEnglishModule = Number(module?.isEnglish ?? 0) === 1;
                return item.isActive && (isEnglishClass ? isEnglishModule : !isEnglishModule);
            }) ?? null
        );
    }, [tugasPendahuluan, moduleMap, isEnglishClass]);

    const defaultModuleId = activeModuleEntry ? Number(activeModuleEntry.modul_id) : null;
    const activeModule = defaultModuleId ? moduleMap.get(defaultModuleId) ?? null : null;

    const [selectedModul, setSelectedModul] = useState(defaultModuleId ? String(defaultModuleId) : "");

    useEffect(() => {
        setSelectedModul(defaultModuleId ? String(defaultModuleId) : "");
    }, [defaultModuleId]);

    useEffect(() => {
        if (!selectedModul) {
            setQuestions([]);
            setAnswers([]);
        }
    }, [selectedModul]);

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
            if (taskName !== "TugasPendahuluan" || !praktikanId) {
                return;
            }

            if (!selectedModul) {
                toast.error("Tidak ada modul tugas pendahuluan yang aktif saat ini.");
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

    const handleQuestionsCount = useCallback(() => { }, []);

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

                <div className="mt-1 flex flex-col gap-6">
                    <PraktikanPageHeader title="Tugas Pendahuluan" />

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
                        showSubmitButton={Boolean(selectedModul)}
                        submitLabel={submitMutation.isPending ? "Menyimpan..." : "Simpan Jawaban"}
                    />
                </div>
            </PraktikanAuthenticated>
            <PraktikanUtilities />
        </>
    );
}
