// Fetch data dari backend
const fetchData = async () => {
    setLoading(true);
    try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        const response = await axios.get("/api-v1/kelas", {
            headers: {
                Authorization: `Bearer ${token}`, // Sertakan token di header
            },
        });
        console.log("Response dari backend:", response.data);

        if (response.data.status === 'success') {
            setKelas(response.data.kelas);
            console.log("Data kelas di state:", response.data.kelas);
        } else {
            setError(response.data.message || "Gagal mengambil data kelas.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        setError("Terjadi kesalahan saat mengambil data.");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchData();
}, []);

const handleOpenModalDelate = (kelasItem) => {
    setSelectedKelas(kelasItem); // Pastikan kelasItem memiliki properti id
    setIsModalOpenDelate(true);
};

const handleCloseModalDelate = () => {
    setIsModalOpenDelate(false);
};

const handleConfirmDelete = async () => {
    try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api-v1/kelas/${selectedKelas.id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        fetchData(); // Refresh data setelah penghapusan
    } catch (error) {
        console.error("Failed to delete kelas:", error);
        setMessage("Gagal menghapus kelas. Silakan coba lagi.");
    } finally {
        setIsModalOpenDelate(false);
    }
};

const handleOpenModalEdit = (kelas) => {
    setSelectedKelas(kelas);
    setIsModalOpenEdit(true);
};

const handleCloseModalEdit = () => {
    setIsModalOpenEdit(false);
    fetchData(); // Refresh data setelah modal ditutup
};

const handleOpenModalPlot = (kelas) => {
    setSelectedKelas(kelas);
    setIsModalOpenPlot(true);
};

const handleCloseModalPlot = () => {
    setIsModalOpenPlot(false);
};
