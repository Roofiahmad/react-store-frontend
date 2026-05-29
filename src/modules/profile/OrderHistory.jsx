import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

import api from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../constants";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const fetchOrders = async (signal) => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders", { signal });
      if (response.data.success) {
        setOrderHistory(response.data.data || []);
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to load registered addresses.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders(controller.signal);
    return () => controller.abort();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
          <span className="text-xs font-bold text-gray-500 animate-pulse">
            Syncing logistics data...
          </span>
        </div>
      )}
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-3">
        Transaction History
      </h3>

      <div className="divide-y divide-gray-100">
        {orderHistory.map((ord) => (
          <div
            key={ord.id}
            onClick={() => navigate(PATHS.ORDER_DETAILS + "?orderId=" + ord.id)}
            className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2 first:pt-0 last:pb-0 cursor-pointer"
          >
            <div className="space-y-0.5">
              <p className="font-bold text-gray-900">#ORD-{ord.id}</p>
              <p className="text-gray-400">
                Purchased clearing on:{" "}
                {format(parseISO(ord.createdAt), "MM/dd/yyyy, HH:mm:ss")}
              </p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6">
              <span className="font-bold text-gray-900">
                Rp {ord.totalPrice.toLocaleString("id-ID")}
              </span>
              <span
                className={`px-2.5 py-0.5 font-bold rounded-md text-[10px] uppercase tracking-wide ${ord.status === "PENDING" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}
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
