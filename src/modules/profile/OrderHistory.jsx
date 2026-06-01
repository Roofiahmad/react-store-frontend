import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_ORDER_ITEM_PER_PAGE, PATHS } from "../../constants";
import api from "../../lib/api";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  // 🔢 📄 PAGINATION TRACK STATES

  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async (signal) => {
    try {
      setIsLoading(true);
      const response = await api.get("/orders", { signal });
      if (response.data.success) {
        setOrderHistory(response.data.data || []);
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to load your transaction history.");
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

  // ✂️ CHOP CURRENT HISTORY INTO SUBSET PAGES
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * CUSTOMER_ORDER_ITEM_PER_PAGE;
    return orderHistory.slice(
      startIndex,
      startIndex + CUSTOMER_ORDER_ITEM_PER_PAGE,
    );
  }, [orderHistory, currentPage]);

  const totalPages =
    Math.ceil(orderHistory.length / CUSTOMER_ORDER_ITEM_PER_PAGE) || 1;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4 relative">
      {/* Dynamic Absolute Loading Glassmorphism Slat */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center rounded-2xl z-10">
          <span className="text-xs font-bold text-gray-500 animate-pulse">
            Syncing logistics data...
          </span>
        </div>
      )}

      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 border-b border-gray-100 pb-3">
        Transaction History ({orderHistory.length})
      </h3>

      {/* TRANSACTION ITEMS REGISTRY LIST */}
      {orderHistory.length === 0 ? (
        <div className="text-center py-8 text-xs text-gray-400 italic">
          You haven't placed any store orders yet.
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {paginatedOrders.map((ord) => (
            <div
              key={ord.id}
              onClick={() =>
                navigate(PATHS.ORDER_DETAILS + "?orderId=" + ord.id)
              }
              className="py-3.5 flex flex-col sm:flex-row justify-between sm:items-center text-xs gap-2 first:pt-0 last:pb-0 cursor-pointer hover:bg-gray-50/40 rounded-xl px-2 -mx-2 transition-colors"
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
                  className={`px-2.5 py-0.5 font-bold rounded-md text-[10px] uppercase tracking-wide border
                    ${
                      ord.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : ord.status === "DELIVERED" ||
                            ord.status === "COMPLETED"
                          ? "bg-green-50 text-green-700 border-green-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                    }`} // Handles active PROCESSING/SHIPPED colors cleanly
                >
                  {ord.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📑 USER HISTORY FOOTER PAGINATION CONTROLS PANEL */}
      {orderHistory.length > CUSTOMER_ORDER_ITEM_PER_PAGE && (
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500">
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none transition-colors hover:bg-gray-50"
            >
              ◀ Prev
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1.5 rounded-lg border bg-white border-gray-200 text-gray-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed select-none transition-colors hover:bg-gray-50"
            >
              Next ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
