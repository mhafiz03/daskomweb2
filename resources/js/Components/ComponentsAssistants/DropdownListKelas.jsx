import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DropdownListKelas() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("-- Pilih Kelas --");
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  const fetchKelas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api-v1/kelas");
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

  useEffect(() => {
    fetchKelas();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 border-2 border-darkBrown text-darkBrown font-semibold rounded-md px-7 py-1 shadow-md"
        disabled={loading}
      >
        {loading ? "Loading..." : selectedOption}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 bg-white border-2 border-darkBrown rounded-md shadow-md w-[168px] z-10">
          <ul>
            {kelas.length > 0 ? (
              kelas.map((kel) => (
                <li
                  key={kel.id}
                  onClick={() => handleSelect(kel.kelas)}
                  className="px-4 py-2 text-darkBrown hover:bg-gray-100 cursor-pointer"
                >
                  {kel.kelas}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">
                No kelas available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
