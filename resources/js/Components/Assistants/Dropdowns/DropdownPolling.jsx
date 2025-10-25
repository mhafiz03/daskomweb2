import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function DropdownPolling({ onSelectPolling }) {
    const [selectedCategory, setSelectedCategory] = useState("");
    const categoriesQuery = useQuery({
        queryKey: ['jenis-polling'],
        queryFn: async () => {
            const { data } = await api.get('/api-v1/jenis-polling');
            if (data?.status === 'success') {
                return data.categories ?? [];
            }
            throw new Error(data?.message ?? 'Gagal memuat kategori polling');
        },
        onError: (err) => {
            console.error('Error fetching polling categories:', err);
        },
    });

    const categories = categoriesQuery.data ?? [];

    const pollsQuery = useQuery({
        queryKey: ['polling', selectedCategory],
        enabled: Boolean(selectedCategory),
        queryFn: async () => {
            const { data } = await api.get(`/api-v1/polling/${selectedCategory}`);
            if (data?.status === 'success') {
                return data.polling ?? [];
            }
            throw new Error(data?.message ?? 'Gagal memuat polling');
        },
        onSuccess: (polling) => {
            onSelectPolling(polling);
        },
        onError: (err) => {
            console.error('Error fetching polling data:', err);
            onSelectPolling([]);
        },
        refetchOnWindowFocus: false,
    });

    // Fetch polling data when category is selected
    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        if (!categoryId) {
            onSelectPolling([]);
        }
    };

    return (
        <div className="relative">
            <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border-2 border-darkBrown rounded-md shadow-md py-1 px-4 text-darkBrown font-semibold appearance-none"
            >
                <option value="">Pilih Jenis Polling</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.judul}
                    </option>
                ))}
            </select>
            {(pollsQuery.isFetching || categoriesQuery.isLoading) && <span className="ml-2">Loading...</span>}
        </div>
    );
}
