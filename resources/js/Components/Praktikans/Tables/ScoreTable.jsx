import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export default function ScoreTable() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const nilaiQuery = useQuery({
        queryKey: ['nilai'],
        queryFn: async () => {
            const { data } = await api.get('/api-v1/nilai');

            if (Array.isArray(data?.nilai)) {
                return data.nilai.map(item => ({
                    tanggal: new Date(item.created_at).toLocaleDateString('id-ID'),
                    modul: item.modul ? item.modul.judul : `Modul ${item.modul_id}`,
                    nilai: `${item.tp}/${item.ta}/${item.d1}/${item.d2}/${item.d3}/${item.d4}/${item.i1 ?? item.l1}/${item.i2 ?? item.l2}`,
                    asisten: item.asisten ? item.asisten.nama : 'Unknown'
                }));
            }

            return [];
        },
        onSuccess: (data) => {
            setRows(data);
            setLoading(false);
        },
        onError: (err) => {
            console.error('Error fetching nilai data:', err);
            setError('Failed to load score data');
            setRows([]);
            setLoading(false);
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setLoading(nilaiQuery.isLoading);
    }, [nilaiQuery.isLoading]);

    const Table = ({ rows }) => {
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

        if (error) {
            return (
                <div className="mt-6 flex h-[68vh] items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-500">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
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
            <div className="mt-6 h-[68vh] overflow-y-auto scrollbar-thin scrollbar-track-depth scrollbar-thumb-depth-secondary">
                <table className="min-w-full">
                    <tbody className="divide-y divide-depth">
                        {rows.map((row, index) => (
                            <tr key={index} className="group transition hover:bg-depth-interactive/50">
                                <td className="px-4 py-3 text-center text-sm font-medium text-depth-primary w-[20%]">{row.tanggal}</td>
                                <td className="px-4 py-3 text-center text-sm font-medium text-depth-primary w-[20%]">{row.modul}</td>
                                <td className="px-4 py-3 text-center text-sm font-semibold text-[var(--depth-color-primary)] w-[40%]">{row.nilai}</td>
                                <td className="px-4 py-3 text-center text-sm font-medium text-depth-secondary w-[20%]">{row.asisten}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="mx-auto max-w-3xl rounded-depth-lg border border-depth bg-depth-card px-6 py-6 shadow-depth-lg">
            <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-4 py-3 shadow-depth-md">
                <div className="flex items-center justify-evenly gap-4">
                    <div className="w-[25%] rounded-depth-sm p-2 text-center transition hover:bg-white/10">
                        <h1 className="font-bold text-white">Tanggal</h1>
                    </div>
                    <div className="w-[25%] rounded-depth-sm p-2 text-center transition hover:bg-white/10">
                        <h1 className="font-bold text-white">Modul</h1>
                    </div>
                    <div className="w-[30%] rounded-depth-sm p-2 text-center transition hover:bg-white/10">
                        <h1 className="font-bold text-white">Nilai</h1>
                    </div>
                    <div className="w-[20%] rounded-depth-sm p-2 text-center transition hover:bg-white/10">
                        <h1 className="font-bold text-white">Asisten</h1>
                    </div>
                </div>
            </div>
            <Table rows={rows} />
        </div>
    );
}
