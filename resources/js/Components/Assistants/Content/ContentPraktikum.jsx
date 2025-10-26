import { useMemo, useState } from "react";
import { useModulesQuery } from "@/hooks/useModulesQuery";
import { useKelasQuery } from "@/hooks/useKelasQuery";
import { useAsistensQuery } from "@/hooks/useAsistensQuery";
import { useJadwalJagaQuery } from "@/hooks/useJadwalJagaQuery";

export default function ContentPraktikum() {
    const [selectedModul, setSelectedModul] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");

    const {
        data: kelas = [],
        isLoading: kelasLoading,
        isError: kelasError,
    } = useKelasQuery();

    const {
        data: moduls = [],
        isLoading: modulLoading,
        isError: modulError,
    } = useModulesQuery();

    const {
        data: asistens = [],
    } = useAsistensQuery({
        enabled: true,
    });

    const asistenMap = useMemo(() => {
        const map = new Map();
        asistens.forEach((item) => {
            if (item?.id != null) {
                map.set(Number(item.id), item);
            }
        });
        return map;
    }, [asistens]);

    const selectedKelasData = useMemo(() => {
        if (!selectedKelas) {
            return null;
        }

        return kelas.find((item) => String(item.id) === String(selectedKelas)) ?? null;
    }, [kelas, selectedKelas]);

    const { data: jadwalData = [], isLoading: jadwalLoading } = useJadwalJagaQuery(
        selectedKelas ? { kelas_id: selectedKelas } : {},
        {
            enabled: Boolean(selectedKelas),
        }
    );

    const jadwalForSelectedKelas = useMemo(() => {
        if (!selectedKelas) {
            return null;
        }

        const kelasId = Number(selectedKelas);
        return (
            jadwalData.find((item) => Number(item?.id ?? item?.kelas_id ?? item?.kelasId) === kelasId) ??
            jadwalData.find((item) => (item?.kelas ?? "").toString() === selectedKelasData?.kelas) ??
            null
        );
    }, [jadwalData, selectedKelas, selectedKelasData]);

    const asistenJagaList = useMemo(() => {
        if (!jadwalForSelectedKelas) {
            return [];
        }

        if (Array.isArray(jadwalForSelectedKelas?.jadwal_jagas)) {
            return jadwalForSelectedKelas.jadwal_jagas;
        }

        if (Array.isArray(jadwalForSelectedKelas?.asistens)) {
            return jadwalForSelectedKelas.asistens;
        }

        return [];
    }, [jadwalForSelectedKelas]);

    const praktikanList = useMemo(() => {
        if (Array.isArray(selectedKelasData?.praktikans)) {
            return selectedKelasData.praktikans;
        }

        if (Array.isArray(jadwalForSelectedKelas?.praktikans)) {
            return jadwalForSelectedKelas.praktikans;
        }

        return [];
    }, [selectedKelasData, jadwalForSelectedKelas]);

    return (
        <section>
            {/* Button Praktikan - Kelas */}
            <div className="flex gap-4 items-start">
                <div className="border-2 border-darkBrown rounded-md shadow-md">
                    <h6 className="text-md text-darkBrown text-center py-1 font-semibold px-16">
                        Start Praktikum
                    </h6>
                </div>
            </div>

            <div className="flex gap-5 mt-4 items-start border-2 border-darkBrown rounded-md shadow-md">
                <div className="overflow-y-auto lg:h-[48rem] md:h-96 w-full p-6">
                    <div className="flex justify-start gap-4 mb-4">
                        <div className="w-1/3">
                            <select
                                className="w-full border-2 border-darkBrown rounded-md shadow-md"
                                id="kelas_id"
                                value={selectedKelas}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedKelas(value);
                                }}
                            >
                                <option value="">- Pilih Kelas -</option>
                                {kelasLoading && <option disabled>Loading kelas...</option>}
                                {kelasError && <option disabled>Gagal memuat kelas</option>}
                                {!kelasLoading && !kelasError && kelas.length === 0 && (
                                    <option disabled>Data kelas kosong</option>
                                )}
                                {!kelasLoading && !kelasError &&
                                    kelas.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.kelas}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="w-2/3">
                            <select
                                className="w-full border-2 border-darkBrown rounded-md shadow-md"
                                id="modul_id"
                                value={selectedModul}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedModul(value);
                                }}
                            >
                                <option value="">- Pilih Modul -</option>
                                {modulLoading && <option disabled>Loading modul...</option>}
                                {modulError && <option disabled>Gagal memuat modul</option>}
                                {!modulLoading && !modulError && moduls.length === 0 && (
                                    <option disabled>Data modul kosong</option>
                                )}
                                {!modulLoading && !modulError &&
                                    moduls.map((k) => (
                                        <option key={k.idM} value={k.idM}>
                                            {k.judul}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-darkBrown rounded-md p-4 bg-white shadow-sm">
                                <h3 className="text-lg font-semibold text-darkBrown mb-2">Asisten Jaga</h3>
                                {jadwalLoading ? (
                                    <p className="text-sm text-gray-500">Memuat daftar asisten...</p>
                                ) : asistenJagaList.length > 0 ? (
                                    <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                        {asistenJagaList.map((item, idx) => {
                                            const asistenDetail = item?.asisten ?? asistenMap.get(Number(item?.asisten_id));
                                            const key = item?.id ?? `${item?.asisten_id ?? asistenDetail?.id ?? "asisten"}-${idx}`;

                                            return (
                                                <li
                                                    key={key}
                                                    className="flex justify-between items-center border border-lightBrown rounded px-3 py-2 text-sm text-darkBrown"
                                                >
                                                    <span className="font-semibold">{asistenDetail?.kode ?? item?.kode ?? "Kode tidak tersedia"}</span>
                                                    <span className="text-right">{asistenDetail?.nama ?? item?.nama ?? "Nama tidak tersedia"}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : selectedKelas ? (
                                    <p className="text-sm text-gray-500">Belum ada asisten jaga untuk kelas ini.</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Pilih kelas untuk melihat daftar asisten.</p>
                                )}
                            </div>
                            <div className="border border-darkBrown rounded-md p-4 bg-white shadow-sm">
                                <h3 className="text-lg font-semibold text-darkBrown mb-2">Praktikan</h3>
                                {selectedKelas ? (
                                    praktikanList.length > 0 ? (
                                        <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                            {praktikanList.map((praktikan) => (
                                                <li
                                                    key={praktikan?.id ?? praktikan?.nim}
                                                    className="flex justify-between items-center border border-lightBrown rounded px-3 py-2 text-sm text-darkBrown"
                                                >
                                                    <span className="font-semibold">{praktikan?.nim ?? "NIM tidak tersedia"}</span>
                                                    <span className="text-right ml-3">{praktikan?.nama ?? praktikan?.name ?? "Nama tidak tersedia"}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-gray-500">Belum ada data praktikan untuk kelas ini.</p>
                                    )
                                ) : (
                                    <p className="text-sm text-gray-500">Pilih kelas untuk melihat daftar praktikan.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center space-x-3 mt-10">
                        <button
                            className="px-20 py-3 bg-deepForestGreen text-white font-semibold text-2xl rounded-md shadow hover:bg-darkGreen transition duration-300"
                        >
                            Start
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
