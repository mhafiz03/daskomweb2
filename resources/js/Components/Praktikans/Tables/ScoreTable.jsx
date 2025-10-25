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
            const token = localStorage.getItem('token');
            const { data } = await api.get('/api-v1/nilai', {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            });

            if (Array.isArray(data?.nilai)) {
                return data.nilai.map(item => ({
                    tanggal: new Date(item.created_at).toLocaleDateString('id-ID'),
                    modul: item.modul ? item.modul.judul : `Modul ${item.modul_id}`,
                    nilai: `${item.tp}/${item.ta}/${item.d1}/${item.d2}/${item.d3}/${item.d4}/${item.l1}/${item.l2}`,
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
                <div className="mt-[3vh] h-[68vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deepForestGreen mx-auto mb-4"></div>
                        <p>Loading scores...</p>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="mt-[3vh] h-[68vh] flex items-center justify-center">
                    <div className="text-center text-red-600">
                        <p>{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="mt-2 px-4 py-2 bg-deepForestGreen text-white rounded hover:bg-darkOliveGreen"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }

        if (rows.length === 0) {
            return (
                <div className="mt-[3vh] h-[68vh] flex items-center justify-center">
                    <p className="text-gray-500">No score data available</p>
                </div>
            );
        }

        return (
            <div className="mt-[3vh] h-[68vh] overflow-y-auto">
                <table className="min-w-full border-collapse border-2 border-black">
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index}>
                                <td className="border-2 border-black px-2 py-2 text-center w-[20%]">{row.tanggal}</td>
                                <td className="border-2 border-black px-2 py-2 text-center w-[20%]">{row.modul}</td>
                                <td className="border-2 border-black px-2 py-2 text-center w-[40%]">{row.nilai}</td>
                                <td className="border-2 border-black px-2 py-2 text-center w-[20%]">{row.asisten}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="mt-[-25px] bg-white rounded-lg py-4 px-4 max-w-3xl mx-auto">
            <div className="bg-deepForestGreen rounded-lg py-2 px-2">
                <div className="flex items-center gap-5">
                    <div className="ml-2 min-w-[100px] max-w-[110px] bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[25%]">
                        <h1 className="mx-auto font-bold text-white text-center">Tanggal</h1>
                    </div>
                    <div className="ml-[13px] min-w-[100px] max-w-[110px] bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[25%]">
                        <h1 className="mx-auto font-bold text-white text-center">Modul</h1>
                    </div>
                    <div className="ml-[33px] bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[30%]">
                        <h1 className="mx-auto font-bold text-white text-center">Nilai</h1>
                    </div>
                    <div className="ml-[30px] min-w-[110px] max-w-[120px] bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 w-[20%]">
                        <h1 className="mx-auto font-bold text-white text-center">Asisten</h1>
                    </div>
                </div>
            </div>
            <Table rows={rows} />
        </div>
    );
}
