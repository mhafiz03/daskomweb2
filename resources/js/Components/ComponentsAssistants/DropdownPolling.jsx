import { useState, useEffect } from "react";
import axios from "axios";

export default function DropdownPolling({ onSelectPolling }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("-- Pilih Kategori --");
  const [pollingOptions, setPollingOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ambil data jenis polling
  useEffect(() => {
    const fetchPollingOptions = async () => {
      try {
        console.log("Mengambil data jenis polling dari backend...");
        const response = await axios.get('/api-v1/jenis-polling', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        console.log("Response jenis polling:", response.data);
        if (response.data.status === 'success') {
          setPollingOptions(response.data.polling);
        } else {
          setError(response.data.message || 'Terjadi kesalahan saat mengambil data');
        }
      } catch (error) {
        setError(error.message || 'Gagal mengambil data jenis polling');
      }
    };

    fetchPollingOptions();
  }, []);

  const fetchPollingData = async (pollingId) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Mengambil data polling untuk jenis polling ID:", pollingId);
      const response = await axios.get(`/api-v1/polling/${pollingId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log("Response data polling:", response.data);
      if (response.data.status === 'success') {
        onSelectPolling(response.data.polling);
      } else {
        setError(response.data.message || 'Terjadi kesalahan saat mengambil data');
      }
    } catch (error) {
      setError(error.message || 'Gagal mengambil data polling');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option.judul);
    setIsOpen(false);
    fetchPollingData(option.id);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 border-2 border-darkBrown text-darkBrown font-semibold rounded-md px-7 py-1 shadow-md"
      >
        {selectedOption}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border-2 border-darkBrown rounded-md shadow-md w-[168px]">
          <ul>
            {pollingOptions.length > 0 ? (
              pollingOptions.map((option) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="px-4 py-2 text-darkBrown hover:bg-gray-100 cursor-pointer"
                >
                  {option.judul}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-darkBrown">Tidak ada data</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
