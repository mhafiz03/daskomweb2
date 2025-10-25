import { useModulesQuery } from "@/hooks/useModulesQuery";
import { useKelasQuery } from "@/hooks/useKelasQuery";
import { useState } from "react";

export default function ContentModulePraktikum() {
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
                <div className="overflow-y-auto lg:h-[48rem] md:h-96 w-full">
                    <div className="flex justify-start gap-4 mb-4 p-6">
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
                                        <option key={k.id} value={k.kelas}>
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
                </div>
            </div>
        </section>
    );
}
