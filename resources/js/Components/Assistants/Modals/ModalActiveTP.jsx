import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useModulesQuery } from "@/hooks/useModulesQuery";
import {
    useTugasPendahuluanQuery,
    TUGAS_PENDAHULUAN_QUERY_KEY,
} from "@/hooks/useTugasPendahuluanQuery";
import { send } from "@/lib/wayfinder";
import { update as updateTugasPendahuluanRoute } from "@/actions/App/Http/Controllers/API/TugasPendahuluanController";

const normaliseModuleId = (module) => Number(module?.idM ?? module?.id ?? module?.modul_id ?? 0);

export default function ModalActiveTP({ onClose }) {
    const queryClient = useQueryClient();

    const modulesQuery = useModulesQuery({
        onError: (error) => {
            toast.error(error?.message ?? "Gagal memuat daftar modul.");
        },
    });
    const tugasPendahuluanQuery = useTugasPendahuluanQuery({
        onError: (error) => {
            toast.error(error?.message ?? "Gagal memuat konfigurasi tugas pendahuluan.");
        },
    });

    const modules = modulesQuery.data ?? [];
    const tugasPendahuluan = tugasPendahuluanQuery.data ?? [];

    const moduleMap = useMemo(() => {
        return new Map(
            modules.map((module) => [normaliseModuleId(module), module])
        );
    }, [modules]);

    const regularModules = useMemo(
        () => modules.filter((module) => Number(module?.isEnglish ?? 0) !== 1),
        [modules]
    );

    const englishModules = useMemo(
        () => modules.filter((module) => Number(module?.isEnglish ?? 0) === 1),
        [modules]
    );

    const [regularSelection, setRegularSelection] = useState("");
    const [englishSelection, setEnglishSelection] = useState("");

    useEffect(() => {
        if (modulesQuery.isLoading || tugasPendahuluanQuery.isLoading) {
            return;
        }

        const activeRegular = tugasPendahuluan.find((item) => {
            const module = moduleMap.get(Number(item.modul_id));
            return item.isActive && Number(module?.isEnglish ?? 0) !== 1;
        });

        const activeEnglish = tugasPendahuluan.find((item) => {
            const module = moduleMap.get(Number(item.modul_id));
            return item.isActive && Number(module?.isEnglish ?? 0) === 1;
        });

        const defaultRegular =
            activeRegular?.modul_id ??
            (regularModules[0] ? normaliseModuleId(regularModules[0]) : "");
        const defaultEnglish =
            activeEnglish?.modul_id ??
            (englishModules[0] ? normaliseModuleId(englishModules[0]) : "");

        setRegularSelection(defaultRegular ? String(defaultRegular) : "");
        setEnglishSelection(defaultEnglish ? String(defaultEnglish) : "");
    }, [
        modulesQuery.isLoading,
        tugasPendahuluanQuery.isLoading,
        tugasPendahuluan,
        moduleMap,
        regularModules,
        englishModules,
    ]);

    const updateMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await send(updateTugasPendahuluanRoute(), payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TUGAS_PENDAHULUAN_QUERY_KEY });
            toast.success("Konfigurasi tugas pendahuluan berhasil disimpan.");
            onClose?.();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal menyimpan konfigurasi.");
        },
    });

    const handleSave = () => {
        if (!Array.isArray(tugasPendahuluan) || tugasPendahuluan.length === 0) {
            toast.error("Belum ada data tugas pendahuluan.");
            return;
        }

        const payload = tugasPendahuluan.map((item) => {
            const module = moduleMap.get(Number(item.modul_id));
            const isEnglishModule = Number(module?.isEnglish ?? 0) === 1;
            const shouldBeActive = isEnglishModule
                ? englishSelection && Number(englishSelection) === Number(item.modul_id)
                : regularSelection && Number(regularSelection) === Number(item.modul_id);

            return {
                id: item.id,
                isActive: shouldBeActive ? 1 : 0,
            };
        });

        updateMutation.mutate({ data: payload });
    };

    const isBusy =
        modulesQuery.isLoading ||
        tugasPendahuluanQuery.isLoading ||
        updateMutation.isPending;

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            className="depth-modal-overlay z-[9999]"
            onClick={handleOverlayClick}
        >
            <div
                className="depth-modal-container w-full max-w-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Konfigurasi Modul Tugas Pendahuluan</h2>
                    <button
                        type="button"
                        className="depth-modal-close"
                        onClick={onClose}
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-depth-secondary">
                    Pilih modul yang aktif untuk praktikan reguler dan kelas English Lab.
                    Perubahan akan segera berlaku setelah disimpan.
                </p>

                <div className="mt-6 space-y-6">
                    <section className="rounded-depth-md border border-depth bg-depth-interactive/40 p-4 shadow-inner">
                        <h3 className="text-sm font-semibold text-depth-primary">Modul Reguler</h3>
                        <p className="mt-1 text-xs text-depth-secondary">
                            Modul yang dipilih akan digunakan sebagai tugas pendahuluan utama.
                        </p>
                        <select
                            className="mt-3 w-full rounded-depth-md border border-depth bg-depth-card/80 p-2 text-sm text-depth-primary shadow-depth-sm focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)]"
                            value={regularSelection}
                            onChange={(event) => setRegularSelection(event.target.value)}
                            disabled={regularModules.length === 0 || isBusy}
                        >
                            {regularModules.length === 0 && (
                                <option value="">Tidak ada modul reguler.</option>
                            )}
                            {regularModules.map((module) => {
                                const moduleId = normaliseModuleId(module);
                                return (
                                    <option key={moduleId} value={moduleId}>
                                        {module.judul}
                                    </option>
                                );
                            })}
                        </select>
                    </section>

                    <section className="rounded-depth-md border border-depth bg-depth-interactive/40 p-4 shadow-inner">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-depth-primary">Modul English Lab</h3>
                                <p className="mt-1 text-xs text-depth-secondary">
                                    Opsional untuk kelas berbahasa Inggris jika tersedia.
                                </p>
                            </div>
                        </div>
                        <select
                            className="mt-3 w-full rounded-depth-md border border-depth bg-depth-card/80 p-2 text-sm text-depth-primary shadow-depth-sm focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)]"
                            value={englishSelection}
                            onChange={(event) => setEnglishSelection(event.target.value)}
                            disabled={englishModules.length === 0 || isBusy}
                        >
                            {englishModules.length === 0 && (
                                <option value="">Tidak ada modul English Lab.</option>
                            )}
                            {englishModules.map((module) => {
                                const moduleId = normaliseModuleId(module);
                                return (
                                    <option key={moduleId} value={moduleId}>
                                        {module.judul}
                                    </option>
                                );
                            })}
                        </select>
                    </section>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        className="rounded-depth-md border border-depth bg-depth-interactive px-4 py-2 text-sm font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={handleSave}
                        disabled={isBusy}
                    >
                        {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                    </button>
                </div>

                {isBusy && (modulesQuery.isLoading || tugasPendahuluanQuery.isLoading) && (
                    <div className="mt-4 rounded-depth-md border border-depth bg-depth-interactive/40 p-3 text-xs text-depth-secondary">
                        Memuat data terbaru...
                    </div>
                )}
            </div>
        </div>
    );
}
