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
const boolToInt = (value) => (value ? 1 : 0);
const formatDatetimeLocalValue = (value) => {
    if (!value) {
        return "";
    }

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const timezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
};

const normaliseDatetimePayload = (value) => {
    if (!value) {
        return null;
    }

    return value.length === 16 ? `${value}:00` : value;
};

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
    const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
    const [scheduleStartAt, setScheduleStartAt] = useState("");
    const [scheduleEndAt, setScheduleEndAt] = useState("");

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

    useEffect(() => {
        if (!configuration) {
            setIsScheduleEnabled(false);
            setScheduleStartAt("");
            setScheduleEndAt("");
            return;
        }

        setIsScheduleEnabled(Boolean(configuration.tp_schedule_enabled));
        setScheduleStartAt(formatDatetimeLocalValue(configuration.tp_schedule_start_at));
        setScheduleEndAt(formatDatetimeLocalValue(configuration.tp_schedule_end_at));
    }, [configuration]);

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

    const buildConfigurationPayload = (overrides = {}) => {
        if (!configuration) {
            return null;
        }

        const scheduleEnabled =
            overrides.tp_schedule_enabled !== undefined
                ? Boolean(overrides.tp_schedule_enabled)
                : isScheduleEnabled;

        return {
            tp_activation:
                overrides.tp_activation !== undefined
                    ? overrides.tp_activation
                    : boolToInt(isTpGloballyActive),
            registrationAsisten_activation:
                overrides.registrationAsisten_activation !== undefined
                    ? overrides.registrationAsisten_activation
                    : boolToInt(configuration.registrationAsisten_activation),
            registrationPraktikan_activation:
                overrides.registrationPraktikan_activation !== undefined
                    ? overrides.registrationPraktikan_activation
                    : boolToInt(configuration.registrationPraktikan_activation),
            tubes_activation:
                overrides.tubes_activation !== undefined
                    ? overrides.tubes_activation
                    : boolToInt(configuration.tubes_activation),
            polling_activation:
                overrides.polling_activation !== undefined
                    ? overrides.polling_activation
                    : boolToInt(configuration.polling_activation),
            tp_schedule_enabled: scheduleEnabled ? 1 : 0,
            tp_schedule_start_at:
                overrides.tp_schedule_start_at !== undefined
                    ? overrides.tp_schedule_start_at
                    : scheduleEnabled
                        ? normaliseDatetimePayload(scheduleStartAt)
                        : null,
            tp_schedule_end_at:
                overrides.tp_schedule_end_at !== undefined
                    ? overrides.tp_schedule_end_at
                    : scheduleEnabled
                        ? normaliseDatetimePayload(scheduleEndAt)
                        : null,
        };
    };

    const handleToggleTpActivation = () => {
        if (!configuration) {
            toast.error("Konfigurasi belum dimuat.");
            return;
        }

        const payload = buildConfigurationPayload({
            tp_activation: isTpGloballyActive ? 0 : 1,
        });

        if (!payload) {
            toast.error("Konfigurasi tidak tersedia.");
            return;
        }

        configurationMutation.mutate(payload);
    };

    const handleToggleSchedule = () => {
        if (!configuration) {
            toast.error("Konfigurasi belum dimuat.");
            return;
        }

        if (isScheduleEnabled) {
            setIsScheduleEnabled(false);
            setScheduleStartAt("");
            setScheduleEndAt("");
            const payload = buildConfigurationPayload({
                tp_schedule_enabled: 0,
                tp_schedule_start_at: null,
                tp_schedule_end_at: null,
            });
            configurationMutation.mutate(payload);
            return;
        }

        setIsScheduleEnabled(true);
        if (!scheduleStartAt) {
            const now = new Date();
            setScheduleStartAt(formatDatetimeLocalValue(now));
        }
        if (!scheduleEndAt) {
            const nextHour = new Date();
            nextHour.setHours(nextHour.getHours() + 1);
            setScheduleEndAt(formatDatetimeLocalValue(nextHour));
        }
    };

    const handleSaveSchedule = () => {
        if (!configuration) {
            toast.error("Konfigurasi belum dimuat.");
            return;
        }

        if (isScheduleEnabled) {
            if (!scheduleStartAt || !scheduleEndAt) {
                toast.error("Lengkapi waktu mulai dan selesai jadwal.");
                return;
            }

            const startTime = new Date(scheduleStartAt);
            const endTime = new Date(scheduleEndAt);

            if (!(startTime instanceof Date) || Number.isNaN(startTime.getTime())) {
                toast.error("Format waktu mulai tidak valid.");
                return;
            }

            if (!(endTime instanceof Date) || Number.isNaN(endTime.getTime())) {
                toast.error("Format waktu selesai tidak valid.");
                return;
            }

            if (endTime <= startTime) {
                toast.error("Waktu selesai harus setelah waktu mulai.");
                return;
            }
        }

        const payload = buildConfigurationPayload();

        if (!payload) {
            toast.error("Konfigurasi tidak tersedia.");
            return;
        }

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

                <div className="mt-6 space-y-6">
                    <section className="rounded-depth-md border border-depth/60 bg-depth-card/60 p-4 shadow-depth-sm dark:border-depth/30 dark:bg-depth-card/40">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-sm font-semibold text-depth-primary dark:text-white">
                                    Jadwal Otomatis TP
                                </h3>
                                <p className="mt-1 text-xs text-depth-secondary dark:text-gray-400">
                                    Aktifkan jadwal agar TP menyala dan mati otomatis sesuai rentang waktu.
                                </p>
                            </div>
                            <DepthToggleButton
                                label={isScheduleEnabled ? "Jadwal Aktif" : "Jadwal Mati"}
                                isOn={isScheduleEnabled}
                                onToggle={handleToggleSchedule}
                                disabled={configurationQuery.isLoading || configurationMutation.isPending}
                            />
                        </div>

                        {isScheduleEnabled && (
                            <div className="mt-4 space-y-4">
                                <label className="flex flex-col text-xs font-semibold text-depth-primary dark:text-white">
                                    Mulai Aktif
                                    <input
                                        type="datetime-local"
                                        lang="id-ID"
                                        className="mt-1 w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm font-medium text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 dark:border-depth/70 dark:bg-depth-card/70 dark:text-white"
                                        value={scheduleStartAt}
                                        onChange={(event) => setScheduleStartAt(event.target.value)}
                                        disabled={isBusy}
                                    />
                                </label>

                                <label className="flex flex-col text-xs font-semibold text-depth-primary dark:text-white">
                                    Berakhir
                                    <input
                                        type="datetime-local"
                                        lang="id-ID"
                                        className="mt-1 w-full rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm font-medium text-depth-primary shadow-depth-inset focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 dark:border-depth/70 dark:bg-depth-card/70 dark:text-white"
                                        value={scheduleEndAt}
                                        onChange={(event) => setScheduleEndAt(event.target.value)}
                                        disabled={isBusy}
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleSaveSchedule}
                                    className="w-full rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:bg-[var(--depth-color-primary-dark)] disabled:cursor-not-allowed disabled:bg-depth-secondary"
                                    disabled={isBusy}
                                >
                                    Simpan Jadwal
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="p-4">
                        <h3 className="text-sm font-semibold text-depth-primary dark:text-white">Kelas Reguler</h3>
                        <select
                            className="mt-3 w-full appearance-none rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm font-medium text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 dark:border-depth/70 dark:bg-depth-card/70 dark:text-white"
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
                            className="mt-3 w-full appearance-none rounded-depth-md border border-depth bg-depth-card px-3 py-2 text-sm font-medium text-depth-primary shadow-depth-inset transition focus:border-[var(--depth-color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--depth-color-primary)] focus:ring-offset-0 dark:border-depth/70 dark:bg-depth-card/70 dark:text-white"
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
