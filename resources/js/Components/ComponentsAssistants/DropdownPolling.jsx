import { useState, useEffect } from "react";
import axios from "axios";

export default function DropdownPolling({ onSelectPolling }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch polling categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api-v1/jenis-polling');
                if (response.data.status === 'success') {
                    setCategories(response.data.categories);
                }
            } catch (error) {
                console.error("Error fetching polling categories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch polling data when category is selected
    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        
        if (!categoryId) return;
        
        setLoading(true);
        try {
            const response = await axios.get(`/api-v1/polling/${categoryId}`);
            if (response.data.status === 'success') {
                onSelectPolling(response.data.polling);
            }
        } catch (error) {
            console.error("Error fetching polling data:", error);
            onSelectPolling([]);
        } finally {
            setLoading(false);
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
            {loading && <span className="ml-2">Loading...</span>}
        </div>
    );
}
