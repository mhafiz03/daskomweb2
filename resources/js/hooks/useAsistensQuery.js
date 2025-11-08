import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const ASISTENS_QUERY_KEY = ["asistens"];

const fetchAsistens = async () => {
    const { data } = await api.get("/api-v1/asisten");

    const assistants = Array.isArray(data?.asisten)
        ? data.asisten
        : (Array.isArray(data?.data) ? data.data : []);

    const filtered = assistants.filter((assistant) => {
        const code = (assistant?.kode ?? "").trim().toUpperCase();
        return code !== "BOT";
    });

    if (Array.isArray(data?.asisten) || Array.isArray(data?.data)) {
        return filtered;
    }

    if (data?.success === false) {
        throw new Error(data?.message ?? "Gagal memuat daftar asisten");
    }

    return filtered;
};

export const useAsistensQuery = (options = {}) =>
    useQuery({
        queryKey: ASISTENS_QUERY_KEY,
        queryFn: fetchAsistens,
        staleTime: 5 * 60 * 1000,
        ...options,
    });
