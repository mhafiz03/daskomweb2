import { useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import ModalConfirmDeleteRole from "../Modals/ModalConfirmDeleteRole";
import ModalEditRole from "../Modals/ModalEditRole";
import editIcon from "../../../../assets/nav/Icon-Edit.svg";
import { useAsistensQuery, ASISTENS_QUERY_KEY } from "@/hooks/useAsistensQuery";
import { submit } from "@/lib/wayfinder";
import { destroy as destroyAsistens } from "@/actions/App/Http/Controllers/API/AsistenController";

const ROLE_BADGE = {
    SOFTWARE: "bg-blue-100 text-blue-800",
    KORDAS: "bg-emerald-100 text-emerald-800",
    WAKORDAS: "bg-amber-100 text-amber-800",
    KOORPRAK: "bg-purple-100 text-purple-800",
    ADMIN: "bg-rose-100 text-rose-800",
    HARDWARE: "bg-teal-100 text-teal-800",
    DDC: "bg-indigo-100 text-indigo-800",
    ATC: "bg-pink-100 text-pink-800",
    RDC: "bg-slate-100 text-slate-800",
    HRD: "bg-orange-100 text-orange-800",
    CMD: "bg-cyan-100 text-cyan-800",
    MLC: "bg-lime-100 text-lime-800",
};

export default function TableManageRole({ asisten }) {
    const [search, setSearch] = useState("");
    const [checkedAsistens, setCheckedAsistens] = useState([]);
    const [isModalOpenConfirmDelete, setIsModalOpenConfirmDelete] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [selectedAsistenId, setSelectedAsistenId] = useState(null);
    const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);
    const queryClient = useQueryClient();

    const {
        data: asistens = [],
        isFetching,
        isError,
    } = useAsistensQuery({
        onError: () => toast.error("Whoops terjadi kesalahan saat memuat data."),
    });

    const filteredAsistens = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return asistens
            .filter((item) => item.kode !== asisten?.kode)
            .filter((item) => {
                if (!keyword) {
                    return true;
                }

                return [item.nama, item.kode, item.role]
                    .filter(Boolean)
                    .map((value) => value.toLowerCase())
                    .some((value) => value.includes(keyword));
            });
    }, [asistens, asisten?.kode, search]);

    const isAllChecked = filteredAsistens.length > 0 && filteredAsistens.every((item) => checkedAsistens.includes(item.kode));

    const toggleCheckedAsisten = (kode) => {
        setCheckedAsistens((prev) =>
            prev.includes(kode) ? prev.filter((item) => item !== kode) : [...prev, kode]
        );
    };

    const toggleSelectAll = () => {
        if (isAllChecked) {
            setCheckedAsistens((prev) => prev.filter((kode) => !filteredAsistens.some((item) => item.kode === kode)));
        } else {
            setCheckedAsistens((prev) => {
                const codes = filteredAsistens.map((item) => item.kode);
                const unique = new Set([...prev, ...codes]);
                return Array.from(unique);
            });
        }
    };

    const handleOpenModalDelete = () => {
        if (!checkedAsistens.length) {
            toast("Pilih minimal satu asisten untuk dihapus.");
            return;
        }

        setIsModalOpenConfirmDelete(true);
    };

    const handleConfirmDelete = () => {
        setIsModalOpenConfirmDelete(false);
        setIsSubmittingDelete(true);

        submit(destroyAsistens(), {
            data: { asistens: checkedAsistens },
            onSuccess: () => {
                toast.success("Asisten berhasil dihapus 🎉");
                setCheckedAsistens([]);
            },
            onError: () => {
                toast.error("Whoops terjadi kesalahan 😢");
            },
            onFinish: () => {
                queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
                setIsSubmittingDelete(false);
            },
        });
    };

    const handleOpenModalEdit = (kode) => {
        setSelectedAsistenId(kode);
        setIsModalOpenEdit(true);
    };

    const handleCloseModalEdit = () => {
        setIsModalOpenEdit(false);
        queryClient.invalidateQueries({ queryKey: ASISTENS_QUERY_KEY });
    };

    const assistenCountLabel = checkedAsistens.length
        ? `${checkedAsistens.length} asisten dipilih`
        : "Tidak ada asisten yang dipilih";

    return (
        <div className="mt-5 space-y-4">
            <Toaster />

            <div className="flex flex-col gap-3 rounded-lg bg-deepForestGreen p-4 text-white shadow">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="text-sm text-white/80">{assistenCountLabel}</div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="relative sm:w-64">
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Cari nama, kode, role..."
                                className="w-full rounded-md border border-white/20 bg-white py-2 pl-3 pr-10 text-sm text-darkBrown focus:border-softBrown focus:outline-none focus:ring-1 focus:ring-softBrown"
                            />
                            <span className="absolute inset-y-0 right-3 flex items-center text-softBrown">🔍</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleOpenModalDelete}
                            disabled={isSubmittingDelete || checkedAsistens.length === 0}
                            className="inline-flex items-center justify-center rounded-md bg-redredDark px-5 py-2 text-sm font-semibold text-white transition hover:bg-softRed disabled:cursor-not-allowed disabled:bg-redredDark/60"
                        >
                            {isSubmittingDelete ? "Menghapus..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="rounded-lg border border-forestGreen bg-white shadow">
                <div className="max-h-[70vh] overflow-y-auto overflow-x-auto lg:max-h-[48rem]">
                    <table className="min-w-full divide-y divide-forestGreen/30 text-sm text-darkBrown">
                        <thead className="bg-softIvory">
                            <tr className="text-left">
                                <th scope="col" className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={isAllChecked}
                                            onChange={toggleSelectAll}
                                            className="h-4 w-4"
                                        />
                                        <span>Pilih</span>
                                    </div>
                                </th>
                                <th scope="col" className="px-4 py-3">Nama</th>
                                <th scope="col" className="px-4 py-3">Kode</th>
                                <th scope="col" className="px-4 py-3">Role</th>
                                <th scope="col" className="px-4 py-3 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-forestGreen/15">
                            {isFetching && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-darkBrown">
                                        Memuat data asisten...
                                    </td>
                                </tr>
                            )}

                            {isError && !isFetching && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-fireRed">
                                        Gagal memuat data asisten.
                                    </td>
                                </tr>
                            )}

                            {!isFetching && !isError && filteredAsistens.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-darkBrown/70">
                                        Tidak ada data yang cocok dengan pencarian kamu.
                                    </td>
                                </tr>
                            )}

                            {!isFetching && !isError && filteredAsistens.map((item) => {
                                const isChecked = checkedAsistens.includes(item.kode);
                                const badgeTone = ROLE_BADGE[item.role] ?? "bg-slate-100 text-slate-800";

                                return (
                                    <tr key={item.kode} className="hover:bg-softIvory/70">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => toggleCheckedAsisten(item.kode)}
                                                className="h-4 w-4"
                                            />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{item.nama}</td>
                                        <td className="px-4 py-3 font-semibold text-darkBrown/80">{item.kode}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badgeTone}`}>
                                                {item.role ?? "-"}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModalEdit(item.kode)}
                                                className="inline-flex items-center gap-1 rounded-md border border-forestGreen px-3 py-1 text-xs font-semibold text-darkBrown transition hover:bg-softBrown"
                                            >
                                                <img src={editIcon} alt="Edit" className="h-4 w-4" />
                                                Edit Role
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpenConfirmDelete && (
                <ModalConfirmDeleteRole
                    onClose={() => setIsModalOpenConfirmDelete(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {isModalOpenEdit && (
                <ModalEditRole onClose={handleCloseModalEdit} asistenId={selectedAsistenId} />
            )}
        </div>
    );
}
