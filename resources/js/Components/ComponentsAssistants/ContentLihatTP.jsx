import { router } from "@inertiajs/react";

export default function ContentLihatTP({ jawabanData, praktikan, modul }) {
    // Check if we have data to display
    const hasData = jawabanData && jawabanData.length > 0;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-deepForestGreen">Jawaban TP</h1>
                    <button 
                        onClick={() => router.get('/lihat-tp')}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
                    >
                        Kembali
                    </button>
                </div>

                {/* Practical Info Section */}
                {praktikan && modul && (
                    <div className="bg-gray-50 p-4 rounded mb-6 space-y-2">
                        <p className="font-medium">
                            Nama Praktikan: <span className="font-normal">{praktikan.nama}</span>
                        </p>
                        <p className="font-medium">
                            NIM: <span className="font-normal">{praktikan.nim}</span>
                        </p>
                        <p className="font-medium">
                            Modul: <span className="font-normal">{modul.judul}</span>
                        </p>
                    </div>
                )}

                {/* Questions & Answers Section */}
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                    {hasData ? (
                        jawabanData.map((item, index) => (
                            <div 
                                key={item.soal_id}
                                className="p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm"
                            >
                                <h3 className="font-semibold text-lg mb-3">
                                    {index + 1}. {item.soal_text}
                                </h3>
                                <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200 shadow-inner">
                                    <p className="text-gray-800 whitespace-pre-line">
                                        {item.jawaban || "Tidak ada jawaban"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Belum ada jawaban yang tersubmit untuk modul ini
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}