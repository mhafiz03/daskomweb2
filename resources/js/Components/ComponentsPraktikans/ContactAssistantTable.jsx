import React, { useState, useEffect } from "react";
import axios from "axios";
import profileImage from "../../../assets/daskom.svg";

export default function ContactAssistantTable() {
    const [asisten, setAsisten] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch data dari backend
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get("/api-v1/asisten");
                console.log("Response dari backend:", response.data);

                if (response.data.success) {
                    setAsisten(response.data.asisten);
                    console.log("Data asisten di state:", response.data.asisten);
                } else {
                    setError(response.data.message || "Gagal mengambil data asisten.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Terjadi kesalahan saat mengambil data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Komponen untuk menampilkan setiap baris
    const RowComponent = ({ nama, kode, nomor_telepon, id_line, instagram }) => (
        <div className="border-b border-transparent mb-1">
            <div className="border-2 border-black flex items-center justify-between px-2 py-1 bg-white text-sm font-semibold shadow-sm shadow-black">
                <div className="flex items-center space-x-4">
                    <div className="ml-1 w-12 h-12 rounded-full overflow-hidden flex justify-center items-center">
                        <img
                            src={profileImage} // Gambar default
                            alt="Profile"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: 'top' }}
                        />
                    </div>
                    <span
                        className="min-w-[145px] max-w-[146px] text-left break-words"
                        style={{
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                        }}
                    >
                        {nama}
                    </span>
                </div>
                <span className="flex-1 ml-[65px] pl-[1px] min-w-[48px] max-w-[55px]">{kode}</span>
                <span className="flex-1 ml-[48px] mr-[15px] min-w-[100px] max-w-[120px] text-center">{nomor_telepon}</span>
                <span className="flex-1 ml-[15px] min-w-[40px] max-w-[115px] break-words text-center"
                    style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                    }}
                >
                    {id_line}
                </span>
                <span className="flex-1 ml-[29px] mr-[40px] min-w-[40px] max-w-[115px] break-words text-center"
                    style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                        overflowWrap: "break-word",
                    }}
                >
                    {instagram}
                </span>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-lg py-4 px-4 max-w-4xl">
            <div className="bg-deepForestGreen rounded-lg py-2 px-2">
                <div className="flex ml-[80px] mr-[50px] items-center justify-evenly">
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 flex-1">
                        <h1 className="ml-[-15px] font-bold text-white text-center">Nama</h1>
                    </div>
                    <div className="ml-4 bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 flex-1">
                        <h1 className="font-bold text-white text-center">Kode</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 flex-1">
                        <h1 className="font-bold text-white text-center">WhatsApp</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 flex-1">
                        <h1 className="font-bold text-white text-center">ID Line</h1>
                    </div>
                    <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1 flex-1">
                        <h1 className="font-bold text-white text-center">Instagram</h1>
                    </div>
                </div>
            </div>
            <div className="mt-4 mx-auto max-w-[850px] h-[69vh] overflow-y-auto">
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Memuat data...</div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500">Error: {error}</div>
                ) : asisten.length > 0 ? (
                    asisten.map((row, index) => (
                        <RowComponent
                            key={index}
                            nama={row.nama}
                            kode={row.kode}
                            nomor_telepon={row.nomor_telepon}
                            id_line={row.id_line}
                            instagram={row.instagram}
                        />
                    ))
                ) : ( // Tampilkan pesan jika tidak ada data
                    <div className="text-center py-10 text-gray-500">Tidak ada data asisten yang tersedia</div>
                )}
            </div>
        </div>
    );
}
