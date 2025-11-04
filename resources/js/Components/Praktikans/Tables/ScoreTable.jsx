import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ModalPraktikanAnswers from '@/Components/Praktikans/Modals/ModalPraktikanAnswers';

export default function ScoreTable() {
    const nilaiQuery = useQuery({
        queryKey: ['nilai'],
        queryFn: async () => {
            const { data } = await api.get('/api-v1/nilai');

            if (!Array.isArray(data?.nilai)) {
                return [];
            }

            return data.nilai.map((item) => {
                const createdAt = item.created_at ? new Date(item.created_at) : null;

                return {
                    id: item.id ?? `${item.modul_id}-${item.praktikan_id}`,
                    modulId: item.modul_id,
                    tanggal: createdAt && !Number.isNaN(createdAt.getTime())
                        ? createdAt.toLocaleDateString('id-ID')
                        : '-',
                    modul: item.modul?.judul ?? `Modul ${item.modul_id}`,
                    scores: {
                        tp: item.tp,
                        ta: item.ta,
                        d1: item.d1,
                        d2: item.d2,
                        d3: item.d3,
                        d4: item.d4,
                        i1: item.i1 ?? item.l1,
                        i2: item.i2 ?? item.l2,
                        avg: item.avg,
                    },
                    asisten: item.asisten?.nama ?? 'Tidak diketahui',
                };
            });
        },
        refetchOnWindowFocus: false,
    });

    const rows = useMemo(() => nilaiQuery.data ?? [], [nilaiQuery.data]);
    const loading = nilaiQuery.isLoading || nilaiQuery.isFetching;
    const errorMessage = nilaiQuery.isError
        ? nilaiQuery.error?.response?.data?.message ?? nilaiQuery.error?.message ?? 'Failed to load score data'
        : null;

    const formatScore = (value) => {
        if (value === null || value === undefined) {
            return '-';
        }

        const numeric = Number(value);

        if (Number.isNaN(numeric)) {
            return value;
        }

        return Number.isInteger(numeric) ? numeric : numeric.toFixed(2);
    };

    const [modalState, setModalState] = useState(null);

    const Table = ({ rows, onOpenAnswers }) => {
        if (loading) {
            return (
                <div className="mt-6 flex h-[68vh] items-center justify-center">
                    <div className="text-center">
                        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-depth border-t-[var(--depth-color-primary)]"></div>
                        <p className="text-depth-secondary">Loading scores...</p>
                    </div>
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="mt-6 flex h-[68vh] items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500">{errorMessage}</p>
                        <button 
                            onClick={() => nilaiQuery.refetch()} 
                            className="mt-4 rounded-depth-md bg-[var(--depth-color-primary)] px-6 py-2 text-sm font-semibold text-white shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        if (rows.length === 0) {
            return (
                <div className="mt-6 flex h-[68vh] items-center justify-center">
                    <p className="text-depth-secondary">No score data available</p>
                </div>
            );
        }

        return (
            <div className="mt-6 h-[68vh] overflow-x-auto overflow-y-auto rounded-depth-md border border-depth bg-depth-card/60 scrollbar-thin scrollbar-track-depth scrollbar-thumb-depth-secondary">
                <table className="min-w-[960px] w-full text-sm">
                    <thead className="bg-depth-interactive/80 text-depth-primary">
                        <tr className="text-xs font-semibold uppercase tracking-wide">
                            <th className="px-4 py-3 text-left">Tanggal</th>
                            <th className="px-4 py-3 text-left">Modul</th>
                            <th className="px-4 py-3 text-center">TP</th>
                            <th className="px-4 py-3 text-center">TA</th>
                            <th className="px-4 py-3 text-center">D1</th>
                            <th className="px-4 py-3 text-center">D2</th>
                            <th className="px-4 py-3 text-center">D3</th>
                            <th className="px-4 py-3 text-center">D4</th>
                            <th className="px-4 py-3 text-center">I1</th>
                            <th className="px-4 py-3 text-center">I2</th>
                            <th className="px-4 py-3 text-center">Rata-rata</th>
                            <th className="px-4 py-3 text-left">Asisten</th>
                            <th className="px-4 py-3 text-center">Jawaban</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-depth">
                        {rows.map((row) => (
                            <tr key={row.id} className="transition hover:bg-depth-interactive/50">
                                <td className="px-4 py-3 text-depth-primary">{row.tanggal}</td>
                                <td className="px-4 py-3 text-depth-primary">{row.modul}</td>
                                <td className="px-4 py-3 text-center font-semibold text-[var(--depth-color-primary)]">{formatScore(row.scores.tp)}</td>
                                <td className="px-4 py-3 text-center font-semibold text-[var(--depth-color-primary)]">{formatScore(row.scores.ta)}</td>
                                <td className="px-4 py-3 text-center text-depth-primary">{formatScore(row.scores.d1)}</td>
                                <td className="px-4 py-3 text-center text-depth-primary">{formatScore(row.scores.d2)}</td>
                                <td className="px-4 py-3 text-center text-depth-primary">{formatScore(row.scores.d3)}</td>
                                <td className="px-4 py-3 text-center text-depth-primary">{formatScore(row.scores.d4)}</td>
                                <td className="px-4 py-3 text-center text-depth-primary">{formatScore(row.scores.i1)}</td>
                                <td className="px-4 py-3 text-center text-depth-primary">{formatScore(row.scores.i2)}</td>
                                <td className="px-4 py-3 text-center font-semibold text-[var(--depth-color-primary)]">{formatScore(row.scores.avg)}</td>
                                <td className="px-4 py-3 text-depth-secondary">{row.asisten}</td>
                                <td className="px-4 py-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onOpenAnswers(row)}
                                        className="rounded-depth-md border border-depth bg-depth-interactive px-3 py-1.5 text-xs font-semibold text-depth-primary shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    >
                                        Lihat Jawaban
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="mx-auto w-full max-w-5xl rounded-depth-lg border border-depth bg-depth-card px-6 py-6 shadow-depth-lg">
            <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-3 text-center shadow-depth-md">
                <h1 className="text-xl font-bold text-white">Rekap Nilai Praktikan</h1>
            </div>
            <Table
                rows={rows}
                onOpenAnswers={(row) => setModalState({ modulId: row.modulId, modulTitle: row.modul })}
            />
            <ModalPraktikanAnswers
                isOpen={Boolean(modalState)}
                modulId={modalState?.modulId ?? null}
                modulTitle={modalState?.modulTitle ?? null}
                onClose={() => setModalState(null)}
            />
        </div>
    );
}
