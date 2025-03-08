export default function TablePolling({ data = [] }) {
    console.log("Data yang diterima di TablePolling:", data);
    return (
      <div className="mt-5">
        {/* Header Tabel */}
        <div className="bg-deepForestGreen rounded-lg py-2 px-2 mb-2">
          <div className="grid grid-cols-4 gap-1">
            <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
              <h1 className="font-bold text-white text-center">Rank</h1>
            </div>
            <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
              <h1 className="font-bold text-white text-center">Nama</h1>
            </div>
            <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
              <h1 className="font-bold text-white text-center">Kode</h1>
            </div>
            <div className="bg-deepForestGreen hover:bg-darkOliveGreen rounded-lg p-1">
              <h1 className="font-bold text-white text-center">Total</h1>
            </div>
          </div>
        </div>

        {/* Konten Tabel */}
        <div className="overflow-x-auto max-h-96">
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-4 gap-1 bg-white border-2 border-forestGreen py-1 px-2 mb-2 rounded-lg"
              >
                <div className="flex items-center justify-center h-full py-1 px-2">{index + 1}</div>
                <div className="flex items-center justify-center h-full py-1 px-2">{item.nama}</div>
                <div className="flex items-center justify-center h-full py-1 px-2">{item.kode}</div>
                <div className="flex items-center justify-center h-full py-1 px-2">{item.total}</div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">Tidak ada data</div>
          )}
        </div>
      </div>
    );
  }
