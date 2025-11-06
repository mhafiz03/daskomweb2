import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import ModalDeletePlottingan from "../Modals/ModalDeletePlottingan";
import ModalEditPlotting from "../Modals/ModalEditPlottingan";
import trashIcon from "../../../../assets/nav/Icon-Delete.svg";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useKelasQuery, KELAS_QUERY_KEY } from "@/hooks/useKelasQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { index as praktikanIndex } from "@/lib/routes/praktikan";
import { ModalOverlay } from "@/Components/Common/ModalPortal";
import ModalCloseButton from "@/Components/Common/ModalCloseButton";

export default function TablePlottingan() {
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalViewPraktikanOpen, setIsModalViewPraktikanOpen] = useState(false);
    const [selectedKelas, setSelectedKelas] = useState(null);
    const [praktikanList, setPraktikanList] = useState([]);
    const [isLoadingPraktikanList, setIsLoadingPraktikanList] = useState(false);
    const [praktikanError, setPraktikanError] = useState(null);
    const queryClient = useQueryClient();

    // Urutan hari untuk sorting
    const dayOrder = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'];

    // Fungsi untuk sorting data kelas
    const sortKelas = (data) => {
        return [...data].sort((a, b) => {
            // Urutkan berdasarkan hari
            const dayA = dayOrder.indexOf(a.hari);
            const dayB = dayOrder.indexOf(b.hari);

            if (dayA !== dayB) {
                return dayA - dayB;
            }

            // Jika hari sama, urutkan berdasarkan shift
            return a.shift - b.shift;
        });
    };

    const {
        data: kelasData = [],
        isLoading,
        isError,
        error,
    } = useKelasQuery();

    const kelas = useMemo(() => sortKelas(kelasData), [kelasData]);

    const deleteKelasMutation = useMutation({
        mutationFn: async (kelasId) => {
            await api.delete(`/api-v1/kelas/${kelasId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
            toast.success("Kelas berhasil dihapus.");
        },
        onError: (err) => {
            const responseMessage = err?.response?.data?.message ?? "Gagal menghapus kelas. Silakan coba lagi.";
            toast.error(responseMessage);
        },
        onSettled: () => {
            setIsModalOpenDelete(false);
            setSelectedKelas(null);
        },
    });

    const handleOpenModalDelete = (kelasItem) => {
        setSelectedKelas(kelasItem); // Pastikan kelasItem memiliki properti id
        setIsModalOpenDelete(true);
    };

    const handleCloseModalDelete = () => {
        setIsModalOpenDelete(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedKelas?.id) {
            return;
        }
        deleteKelasMutation.mutate(selectedKelas.id);
    };

    const handleOpenModalEdit = (kelas) => {
        setSelectedKelas(kelas);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        queryClient.invalidateQueries({ queryKey: KELAS_QUERY_KEY });
    };

    const handleOpenViewPraktikan = async (kelasItem) => {
        setSelectedKelas(kelasItem);
        setIsModalViewPraktikanOpen(true);
        setIsLoadingPraktikanList(true);
        setPraktikanError(null);
        try {
            const { data } = await api.get(
                praktikanIndex.url({
                    query: {
                        kelas_id: kelasItem.id,
                        per_page: 200,
                    },
                }),
            );

            setPraktikanList(Array.isArray(data?.data) ? data.data : []);
        } catch (err) {
            const message = err?.response?.data?.message ?? err?.message ?? "Gagal memuat daftar praktikan.";
            setPraktikanError(message);
            toast.error(message);
            setPraktikanList([]);
        } finally {
            setIsLoadingPraktikanList(false);
        }
    };

    const handleCloseViewPraktikan = () => {
        setIsModalViewPraktikanOpen(false);
        setSelectedKelas(null);
        setPraktikanList([]);
        setPraktikanError(null);
    };

    // const handleOpenModalPlot = (kelas) => {
    //     setSelectedKelas(kelas);
    //     setIsModalOpenPlot(true);
    // };

    // const handleCloseModalPlot = () => {
    //     setIsModalOpenPlot(false);
    // };

    return (
        <div className="space-y-4">
            <div className="rounded-depth-lg border border-depth bg-depth-card p-3 shadow-depth-md">
                <div className="grid grid-cols-5 gap-2 text-xs font-semibold uppercase tracking-wide text-white">
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Kelas</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Hari</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Shift</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Kelompok</div>
                    <div className="rounded-depth-md bg-[var(--depth-color-primary)] px-3 py-2 text-center shadow-depth-sm">Aksi</div>
                </div>
            </div>

            <div className="h-[73.7vh] overflow-y-auto rounded-depth-lg border border-depth bg-depth-card shadow-depth-lg">
                {isLoading ? (
                    <div className="px-6 py-10 text-center text-depth-secondary">Memuat data...</div>
                ) : isError ? (
                    <div className="px-6 py-10 text-center text-red-500">
                        Error: {error?.message ?? "Gagal memuat data"}
                    </div>
                ) : kelas.length > 0 ? (
                    <div className="divide-y divide-[color:var(--depth-border)]">
                        {kelas.map((kelasItem) => (
                            <div
                                key={kelasItem.id}
                                className="grid grid-cols-5 items-center gap-2 px-4 py-3 text-sm text-depth-primary"
                            >
                                <span className="flex items-center justify-center gap-2 font-semibold">
                                    {kelasItem.kelas}
                                    {Number(kelasItem.isEnglish) === 1 && (
                                        <span className="rounded-depth-full border border-depth bg-depth-interactive px-3 py-1 text-xs font-semibold text-depth-primary">
                                            English
                                        </span>
                                    )}
                                </span>
                                <span className="text-center text-depth-secondary">{kelasItem.hari}</span>
                                <span className="text-center text-depth-secondary">{kelasItem.shift}</span>
                                <span className="text-center text-depth-secondary">{kelasItem.totalGroup}</span>
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleOpenViewPraktikan(kelasItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md bg-[var(--depth-color-primary)] text-white "
                                        aria-label={`Lihat praktikan kelas ${kelasItem.kelas}`}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="2"
                                            stroke="currentColor"
                                            className="h-4 w-4"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModalEdit(kelasItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-depth bg-depth-interactive shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    >
                                        <img className="edit-icon-filter h-4 w-4" src={editIcon} alt="edit icon" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleOpenModalDelete(kelasItem)}
                                        className="flex h-9 w-9 items-center justify-center rounded-depth-md border border-red-400/60 bg-red-400/15 text-red-500 shadow-depth-sm transition hover:-translate-y-0.5 hover:shadow-depth-md"
                                    >
                                        <img className="h-4 w-4" src={trashIcon} alt="delete icon" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="px-6 py-10 text-center text-depth-secondary">
                        Tidak ada data kelas yang tersedia.
                    </div>
                )}
            </div>

            {isModalOpenDelete && (
                <ModalDeletePlottingan
                    onClose={handleCloseModalDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {isModalOpenEdit && (
                <ModalEditPlotting onClose={handleCloseModalEdit} kelas={selectedKelas} />
            )}

            {isModalViewPraktikanOpen && (
                <ModalOverlay onClose={handleCloseViewPraktikan} className="depth-modal-overlay z-[70]">
                    <div className="depth-modal-container w-full max-w-3xl space-y-6">
                        <div className="depth-modal-header">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-depth-secondary">Daftar Praktikan</p>
                                <h2 className="depth-modal-title">
                                    {selectedKelas?.kelas ?? "Kelas"}
                                </h2>
                                <p className="text-xs text-depth-secondary">
                                    Hari {selectedKelas?.hari ?? "-"} • Shift {selectedKelas?.shift ?? "-"}
                                </p>
                            </div>
                            <ModalCloseButton onClick={handleCloseViewPraktikan} ariaLabel="Tutup daftar praktikan" />
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto rounded-depth-md border border-depth bg-depth-card shadow-depth-sm">
                            {isLoadingPraktikanList ? (
                                <div className="px-6 py-10 text-center text-depth-secondary">Memuat daftar praktikan…</div>
                            ) : praktikanError ? (
                                <div className="px-6 py-10 text-center text-red-500">{praktikanError}</div>
                            ) : praktikanList.length === 0 ? (
                                <div className="px-6 py-10 text-center text-depth-secondary">
                                    Belum ada praktikan yang terdaftar di kelas ini.
                                </div>
                            ) : (
                                <table className="min-w-full table-auto text-sm text-depth-primary">
                                    <thead className="bg-depth-interactive/60 text-xs font-semibold uppercase tracking-wide text-depth-secondary">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Nama</th>
                                            <th className="px-4 py-3 text-left">NIM</th>
                                            <th className="px-4 py-3 text-left">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[color:var(--depth-border)]">
                                        {praktikanList.map((praktikan) => (
                                            <tr key={praktikan.id}>
                                                <td className="px-4 py-3 font-semibold text-depth-primary">{praktikan.nama}</td>
                                                <td className="px-4 py-3 text-depth-secondary">{praktikan.nim}</td>
                                                <td className="px-4 py-3">
                                                    <a
                                                        href={`mailto:${praktikan.email}`}
                                                        className="text-[var(--depth-color-primary)] underline-offset-2 hover:underline"
                                                    >
                                                        {praktikan.email}
                                                    </a>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
}
