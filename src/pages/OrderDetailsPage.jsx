import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";

import Navbar from "../components/Navbar";
import api from "../lib/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import OrderProgressBar from "../components/OrderProgressBar";
import { CUSTOMER_ORDER_STATUS_INFO } from "../constants";

const PAYMENT_METHOD = "Credit Card (Visa ending in 2424)";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrderDetails = async (signal) => {
    try {
      setIsLoading(true);
      const response = await api.get(`/orders/${orderId}`, { signal });
      if (response.data.success) {
        setOrderDetails(response.data.data || []);
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to load order details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrderDetails(controller.signal);
    return () => controller.abort();
  }, []);

  const createdAt = parseISO(
    orderDetails?.createdAt || new Date().toISOString(),
  );
  const formattedCreatedAt = format(createdAt, "MM/dd/yyyy, HH:mm:ss");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {isLoading && <LoadingSpinner />}

      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        {/* TOP STATUS ROW: Order Meta Information */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-xs gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-gray-900">
                #ORD-{orderDetails?.id}
              </h1>
              <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                {CUSTOMER_ORDER_STATUS_INFO[orderDetails?.status]}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Placed on {formattedCreatedAt}
            </p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="text-xs font-bold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors"
          >
            ← Back to Order History
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Order Timeline
          </h2>

          <OrderProgressBar orderDetails={orderDetails} />

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-wrap justify-between items-center text-xs gap-4">
            <div>
              <span className="text-gray-400 font-medium">
                Logistics Provider:
              </span>{" "}
              <span className="font-bold text-gray-800">J&T Express</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">
                Air Waybill / AWB:
              </span>{" "}
              <span className="font-mono font-bold text-blue-600">
                JT91048209321
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-3">
              Delivery Address
            </h3>
            <p className="text-sm font-bold text-gray-900">
              {orderDetails?.shippingAddress.label}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {orderDetails?.shippingAddress.street}
            </p>
            <p className="text-xs text-gray-600">
              {orderDetails?.shippingAddress.city},{" "}
              {orderDetails?.shippingAddress.zip}
            </p>
            <p className="text-xs text-gray-400 font-medium pt-1">
              Phone: {orderDetails?.customerPhoneNumber}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-3">
              Payment Methods
            </h3>
            <p className="text-xs font-semibold text-gray-700">
              {PAYMENT_METHOD}
            </p>
            <div className="pt-2">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-100">
                ✓ Invoice Fully Cleared
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Purchase Details
          </h3>

          <div className="divide-y divide-gray-100">
            {orderDetails?.items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex items-center justify-between gap-4 text-xs first:pt-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.mainImage}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-gray-400">
                      Quantity Ordered: {item.quantity} units
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900 whitespace-nowrap">
                  Rp {item.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Financial Totals Matrix */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Items Total Subtotal</span>
              <span className="font-semibold text-gray-900">
                Rp {orderDetails?.subTotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery (Flat Rate)</span>
              <span className="font-semibold text-gray-900">
                Rp {orderDetails?.shippingFee.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Value Added Tax (PPN 11%)</span>
              <span className="font-semibold text-gray-900">
                Rp {orderDetails?.vatAmount.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
              <span>Total Payment Authorized</span>
              <span className="text-blue-600">
                Rp {orderDetails?.totalPrice.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
