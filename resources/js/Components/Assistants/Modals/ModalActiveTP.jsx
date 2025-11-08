import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useModulesQuery } from "@/hooks/useModulesQuery";
import {
    useTugasPendahuluanQuery,
    TUGAS_PENDAHULUAN_QUERY_KEY,
} from "@/hooks/useTugasPendahuluanQuery";
import { useConfigurationQuery, CONFIG_QUERY_KEY } from "@/hooks/useConfigurationQuery";
import { send } from "@/lib/http";
import { update as updateTugasPendahuluanRoute } from "@/lib/routes/tugasPendahuluan";
import { update as updateConfigurationRoute } from "@/lib/routes/configuration";
import ModalCloseButton from "@/Components/Common/ModalCloseButton";
import { ModalOverlay } from "@/Components/Common/ModalPortal";
import DepthToggleButton from "@/Components/Common/DepthToggleButton";

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
    const configurationQuery = useConfigurationQuery({
        onError: (error) => {
            toast.error(error?.message ?? "Gagal memuat konfigurasi global TP.");
        },
    });

    const modules = modulesQuery.data ?? [];
    const tugasPendahuluanPayload = tugasPendahuluanQuery.data ?? { items: [], meta: {} };
    const tugasPendahuluan = tugasPendahuluanPayload.items ?? [];
    const configuration = configurationQuery.data ?? null;
    const isTpGloballyActive = Boolean(configuration?.tp_activation);

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
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal menyimpan konfigurasi.");
        },
    });

    const configurationMutation = useMutation({
        mutationFn: async (payload) => {
            const { data } = await send(updateConfigurationRoute(), payload);
            return data?.config ?? data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONFIG_QUERY_KEY });
            toast.success("Status tugas pendahuluan diperbarui.");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message ?? error?.message ?? "Gagal memperbarui konfigurasi TP.");
        },
    });

    const handleToggleTpActivation = () => {
        if (!configuration) {
            toast.error("Konfigurasi belum dimuat.");
            return;
        }

        const payload = {
            tp_activation: isTpGloballyActive ? 0 : 1,
            registrationAsisten_activation: configuration.registrationAsisten_activation ? 1 : 0,
            registrationPraktikan_activation: configuration.registrationPraktikan_activation ? 1 : 0,
            tubes_activation: configuration.tubes_activation ? 1 : 0,
            polling_activation: configuration.polling_activation ? 1 : 0,
        };

        configurationMutation.mutate(payload);
    };

    const persistSelections = (nextRegularSelection, nextEnglishSelection) => {
        if (!Array.isArray(tugasPendahuluan) || tugasPendahuluan.length === 0) {
            toast.error("Belum ada data tugas pendahuluan.");
            return;
        }

        const payload = tugasPendahuluan.map((item) => {
            const module = moduleMap.get(Number(item.modul_id));
            const isEnglishModule = Number(module?.isEnglish ?? 0) === 1;
            const shouldBeActive = isEnglishModule
                ? nextEnglishSelection && Number(nextEnglishSelection) === Number(item.modul_id)
                : nextRegularSelection && Number(nextRegularSelection) === Number(item.modul_id);

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
        updateMutation.isPending ||
        configurationMutation.isPending;

    return (
        <ModalOverlay onClose={onClose} className="depth-modal-overlay z-[60]">
            <div className="depth-modal-container w-full max-w-2xl" style={{ maxWidth: 'var(--depth-modal-width-xl, 30vw)' }}>
                <div className="depth-modal-header">
                    <h2 className="depth-modal-title">Tugas Pendahuluan</h2>
                    <div className="flex gap-5 items-center">
                        <DepthToggleButton
                            label={isTpGloballyActive ? "ON" : "OFF"}
                            isOn={isTpGloballyActive}
                            onToggle={handleToggleTpActivation}
                            disabled={configurationQuery.isLoading || configurationMutation.isPending}
                        />
                        <ModalCloseButton onClick={onClose} ariaLabel="Tutup konfigurasi TP" />
                    </div>
                </div>

                <div className="mt-6">
                    <section className="p-4">
                        <h3 className="text-sm font-semibold text-depth-primary dark:text-white">Kelas Reguler</h3>
                        <select
                            className="mt-3 w-full rounded-depth-md border border-depth bg-depth-card/80 p-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] dark:border-depth/70 dark:bg-depth-card/50 dark:text-gray-700"
                            value={regularSelection}
                            onChange={(event) => {
                                const value = event.target.value;
                                setRegularSelection(value);
                                persistSelections(value, englishSelection);
                            }}
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

                    <section className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-depth-primary dark:text-white">Kelas Internasional</h3>
                            </div>
                        </div>
                        <select
                            className="mt-3 w-full rounded-depth-md border border-depth bg-depth-card/80 p-2 text-sm text-depth-primary shadow-depth-sm transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] dark:border-depth/70 dark:bg-depth-card/50 dark:text-gray-700"
                            value={englishSelection}
                            onChange={(event) => {
                                const value = event.target.value;
                                setEnglishSelection(value);
                                persistSelections(regularSelection, value);
                            }}
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
            </div>
        </ModalOverlay>
    );
}
