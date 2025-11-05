import { useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const noop = () => {};

export default function DropdownPolling({
    value = "",
    onChange = noop,
    onSelectPolling = noop,
    onCategoriesLoaded = noop,
    onLoadingChange = noop,
}) {
    const [selectedCategory, setSelectedCategory] = useState(value ?? "");
    const onSelectPollingRef = useRef(onSelectPolling);
    const onCategoriesLoadedRef = useRef(onCategoriesLoaded);
    const onLoadingChangeRef = useRef(onLoadingChange);

    // Update refs when callbacks change
    useEffect(() => {
        onSelectPollingRef.current = onSelectPolling;
        onCategoriesLoadedRef.current = onCategoriesLoaded;
        onLoadingChangeRef.current = onLoadingChange;
    }, [onSelectPolling, onCategoriesLoaded, onLoadingChange]);

    useEffect(() => {
        setSelectedCategory(value ?? "");
    }, [value]);

    const categoriesQuery = useQuery({
        queryKey: ['jenis-polling'],
        queryFn: async () => {
            const { data } = await api.get('/api-v1/jenis-polling');
            if (data?.status === 'success') {
                return data.categories ?? [];
            }
            throw new Error(data?.message ?? 'Gagal memuat kategori polling');
        },
    });

    const categories = categoriesQuery.data ?? [];

    useEffect(() => {
        if (categories.length > 0) {
            onCategoriesLoadedRef.current(categories);
        }
    }, [categories]);

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
        refetchOnWindowFocus: false,
    });

    // Update polling data when query succeeds or fails
    useEffect(() => {
        if (pollsQuery.isSuccess && pollsQuery.data) {
            onSelectPollingRef.current(pollsQuery.data);
        } else if (pollsQuery.isError) {
            console.error('Error fetching polling data:', pollsQuery.error);
            onSelectPollingRef.current([]);
        }
    }, [pollsQuery.isSuccess, pollsQuery.isError, pollsQuery.data, pollsQuery.error]);

    const isBusy = useMemo(
        () => pollsQuery.isFetching || categoriesQuery.isLoading,
        [categoriesQuery.isLoading, pollsQuery.isFetching],
    );

    useEffect(() => {
        onLoadingChangeRef.current(isBusy);
    }, [isBusy]);

    useEffect(() => {
        if (!selectedCategory) {
            onSelectPollingRef.current([]);
        }
    }, [selectedCategory]);

    // Fetch polling data when category is selected
    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        onChange(categoryId);
        if (!categoryId) {
            onSelectPollingRef.current([]);
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
            {isBusy && <span className="ml-2">Loading...</span>}
        </div>
    );
}
