import { useQuery } from "@tanstack/react-query";
import { index as kelasIndex } from "@/lib/routes/kelas";
import { api } from "@/lib/api";

export const KELAS_QUERY_KEY = ["kelas"];

export const fetchKelas = async () => {
    const { data } = await api.get(kelasIndex.url());
    if (Array.isArray(data?.kelas)) {
        return data.kelas;
    }

    if (data?.status === "success" && Array.isArray(data?.data)) {
        return data.data;
    }

    return [];
};

export const useKelasQuery = (options = {}) =>
    useQuery({
        queryKey: KELAS_QUERY_KEY,
        queryFn: fetchKelas,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
