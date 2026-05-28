import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { PATHS } from "../constants";
import { toast } from "react-toastify";
import api from "../lib/api";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");

  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    async function getOrderDetails() {
      try {
        setIsLoading(true);
        const response = await api.get(`/orders/${orderId}`, {
          signal: controller.signal,
        });

        if (response.data.success) {
          setOrderDetails(response.data.data);
        } else {
          toast.error("Transaction confirmation missing database logs.");
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Error connecting with transaction clearance nodes.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    getOrderDetails();
    return () => controller.abort();
  }, [orderId]);

  console.log(setOrderDetails, "setOrderDetails");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <LoadingSpinner />
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-4 animate-pulse">
          Validating Stripe Ledger Settlement...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-16">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 lg:px-8">
        {/* 🎉 CORE HERO BRANDING CARD BANNER */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-600 border border-green-200 shadow-xs mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 animate-scale-up"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-green-600">
            Payment Authorized Successfully
          </p>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            Thank you for your order, bro!
          </h1>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Your transaction has cleared Stripe secure processing nodes. A
            dynamic tracking voucher has been dispatched to your electronic
            mail.
          </p>
        </div>

        {/* 📦 METADATA TRANSACTION INVOICE TRACK CARD */}
        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in-up">
          {/* Header Track Identifiers */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-4 text-xs">
            <div className="space-y-0.5">
              <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                Reference Voucher ID
              </p>
              <p className="font-mono font-black text-gray-900 text-sm">
                #{orderDetails?.invoiceCode || "NEX-948271A"}
              </p>
            </div>
            <div className="text-right space-y-0.5">
              <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">
                Logistics Date
              </p>
              <p className="font-bold text-gray-700">
                {orderDetails?.createdAt ||
                  new Date().toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>

          {/* Purchased Line Items Core List Mapping */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
              Manifest Composition
            </h3>
            <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
              {orderDetails?.items?.map((item) => (
                <div
                  key={item?.id}
                  className="py-3 flex justify-between items-start text-xs first:pt-0 last:pb-0"
                >
                  <div className="space-y-0.5 max-w-[75%]">
                    <p className="font-bold text-gray-800 line-clamp-1">
                      {item?.name}
                    </p>
                    <p className="text-gray-400 font-medium font-mono">
                      Qty: {item.quantity} &times; Rp{" "}
                      {item?.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="font-extrabold text-gray-900 font-mono">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatch Destination Cards Meta Details */}
          <div className="border-t border-gray-100 pt-4 space-y-1 text-xs">
            <h4 className="font-black text-gray-400 uppercase tracking-wider text-[10px] mb-1">
              Distribution Shipping Destination
            </h4>
            <p className="font-bold text-gray-900 capitalize">
              {orderDetails?.shippingAddress?.label ||
                "Primary Workspace Office"}
            </p>
            <p className="text-gray-600 font-medium leading-relaxed">
              {orderDetails?.shippingAddress?.streetAddress ||
                "Jl. Jenderal Sudirman No. 21, Central Jakarta"}
            </p>
            <p className="text-gray-400 text-[11px]">
              {orderDetails?.shippingAddress?.city},{" "}
              {orderDetails?.shippingAddress?.province} •{" "}
              {orderDetails?.shippingAddress?.postalCode}
            </p>
          </div>

          {/* Financial Totals Breakdown Box */}
          <div className="border-t border-gray-100 pt-4 bg-gray-50/50 -mx-6 -mb-6 p-6 rounded-b-2xl border-dashed space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Logistics Carrier Fee</span>
              <span className="font-bold text-gray-900 font-mono">
                Rp{" "}
                {(orderDetails?.shippingFee || 25000).toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
              <span>Settled Settlement Total</span>
              <span className="text-blue-600 font-mono text-base">
                Rp{" "}
                {(orderDetails?.finalTotal || 175000).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* 🏁 ROUTING FOOTER ACTIONS CONTROLS */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 text-xs animate-fade-in">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-xs uppercase tracking-wider text-center"
          >
            Review Purchase History
          </button>
          <button
            type="button"
            onClick={() => navigate(PATHS.HOME)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-xl transition-all shadow-md uppercase tracking-wider text-center"
          >
            Continue Shopping &rarr;
          </button>
        </div>
      </main>
    </div>
  );
}
