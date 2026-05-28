const MOCK_ORDERS = [
  {
    id: "NEX-ORD-2094",
    date: "2026-05-18",
    status: "Delivered",
    total: 2864000,
  },
  {
    id: "NEX-ORD-1045",
    date: "2026-04-12",
    status: "Cancelled",
    total: 450000,
  },
];

const OrderHistory = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-3">
        Transaction History
      </h3>

      <div className="divide-y divide-gray-100">
        {MOCK_ORDERS.map((ord) => (
          <div
            key={ord.id}
            className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2 first:pt-0 last:pb-0"
          >
            <div className="space-y-0.5">
              <p className="font-bold text-gray-900">{ord.id}</p>
              <p className="text-gray-400">Purchased clearing on: {ord.date}</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <span className="font-bold text-gray-900">
                Rp {ord.total.toLocaleString("id-ID")}
              </span>
              <span
                className={`px-2.5 py-0.5 font-bold rounded-md text-[10px] uppercase tracking-wide ${ord.status === "Delivered" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
              >
                {ord.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
