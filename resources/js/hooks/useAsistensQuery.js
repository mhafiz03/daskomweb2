import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const ASISTENS_QUERY_KEY = ["asistens"];

const fetchAsistens = async () => {
    const { data } = await api.get("/api-v1/asisten");

    if (Array.isArray(data?.asisten)) {
        return data.asisten;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (data?.success === false) {
        throw new Error(data?.message ?? "Gagal memuat daftar asisten");
    }

    return [];
};

export const useAsistensQuery = (options = {}) =>
    useQuery({
        queryKey: ASISTENS_QUERY_KEY,
        queryFn: fetchAsistens,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
