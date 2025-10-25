import { index as kelasIndex } from "@/actions/App/Http/Controllers/API/KelasController";
import { index as modulIndex} from "@/actions/App/Http/Controllers/API/ModulController";
import DropdownListKelas from "./DropdownListKelas";
import TabelStartPraktikum from "./TabelStartPraktikum";
import { useState, useEffect } from "react";


export default function ContentModulePraktikum() {
    const [kelas, setKelas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [moduls, setModuls] = useState([]);
    const [selectedModul, setSelectedModul] = useState('');
    const [selectedKelas, setSelectedKelas] = useState('');

    const fetchKelas = async () => {
        setLoading(true);
        try {
            const response = await fetch(kelasIndex.url());
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched kelas:", data.kelas);
                setKelas(data.kelas || []);
            } else {
                console.error("Failed to fetch kelas:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching kelas:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await fetch(modulIndex.url());
            if (response.ok) {
                const data = await response.json();
                console.log("Fetched modules:", data.data);
                setModuls(Array.isArray(data.data) ? data.data : []);
            } else {
                console.error('Failed to fetch modules:', response.statusText);
                setModuls([]);
            }
        } catch (error) {
            console.error("Error fetching modules:", error);
            setModuls([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchKelas()
        fetchModules()
    }, [])

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
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedKelas(value);
                                }}
                            >
                                <option value="">- Pilih Kelas -</option>
                                {kelas.length > 0 ? (
                                    kelas.map((k) => (
                                        <option key={k.id} value={k.kelas}>
                                            {k.kelas}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Loading...</option>
                                )}
                            </select>
                        </div>
                        <div className="w-2/3">
                            <select
                                className="w-full border-2 border-darkBrown rounded-md shadow-md"
                                id="modul_id"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSelectedModul(value);
                                }}
                            >
                                <option value="">- Pilih Modul -</option>
                                {moduls.length > 0 ? (
                                    moduls.map((k) => (
                                        <option key={k.idM} value={k.idM}>
                                            {k.judul}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Loading...</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
