import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Comprehensive Mock Active Invoice Record
const MOCK_INVOICE = {
  orderId: "NEX-ORD-2094",
  purchaseDate: "2026-05-18 14:32 WIB",
  carrier: "J&T Express",
  trackingNumber: "JT91048209321",
  paymentMethod: "Credit Card (Visa ending in 4444)",
  shippingAddress: {
    name: "Roo Ahmad",
    phone: "+62 812-3456-7890",
    street: "Jl. Sudirman No. 45, Apartment 12B",
    city: "Jakarta Selatan",
    postalCode: "12190",
  },
  items: [
    {
      id: "prod-001",
      name: "Pro Wireless Noise-Cancelling Headphones",
      qty: 1,
      price: 2499000,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "prod-004",
      name: "Insulated Stainless Steel Water Bottle",
      qty: 1,
      price: 320000,
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=150&auto=format&fit=crop&q=80",
    },
  ],
  financials: {
    subtotal: 2819000,
    shippingFee: 45000,
    taxAdjustment: 310090, // 11% PPN
    grandTotal: 3174090,
  },
};

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const [invoice] = useState(MOCK_INVOICE);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      <Navbar cartCount={0} />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        {/* TOP STATUS ROW: Order Meta Information */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-6 shadow-xs gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-gray-900">
                {invoice.orderId}
              </h1>
              <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                On the Way
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Placed on {invoice.purchaseDate}
            </p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="text-xs font-bold text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-lg transition-colors"
          >
            ← Back to Order History
          </button>
        </div>

        {/* INTERACTIVE TRACKING BAR: Graphical Delivery Blueprint */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Logistics Milestone Status
          </h2>

          <div className="relative pt-2">
            {/* Horizontal Line behind states */}
            <div className="absolute top-[23px] left-4 right-4 h-1 bg-gray-200 rounded-full -z-0"></div>
            <div className="absolute top-[23px] left-4 w-2/3 h-1 bg-blue-600 rounded-full -z-0"></div>

            <div className="grid grid-cols-4 relative z-10 text-center">
              <div className="space-y-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 inline-block"></span>
                <p className="text-xs font-bold text-gray-900">Paid</p>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  May 18, 14:35
                </p>
              </div>
              <div className="space-y-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 inline-block"></span>
                <p className="text-xs font-bold text-gray-900">Processed</p>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  May 19, 09:12
                </p>
              </div>
              <div className="space-y-2">
                <span className="w-4 h-4 rounded-full bg-blue-600 border-4 border-blue-100 inline-block"></span>
                <p className="text-xs font-bold text-gray-900">Shipped</p>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  May 20, 18:40
                </p>
              </div>
              <div className="space-y-2">
                <span className="w-4 h-4 rounded-full bg-gray-300 border-4 border-white inline-block"></span>
                <p className="text-xs font-semibold text-gray-400">Arrived</p>
                <p className="text-[10px] text-gray-400 hidden sm:block">
                  Pending
                </p>
              </div>
            </div>
          </div>

          {/* Carrier Spec Metadata Box */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-wrap justify-between items-center text-xs gap-4">
            <div>
              <span className="text-gray-400 font-medium">
                Logistics Provider:
              </span>{" "}
              <span className="font-bold text-gray-800">{invoice.carrier}</span>
            </div>
            <div>
              <span className="text-gray-400 font-medium">
                Air Waybill / AWB:
              </span>{" "}
              <span className="font-mono font-bold text-blue-600">
                {invoice.trackingNumber}
              </span>
            </div>
          </div>
        </div>

        {/* MULTI-COLUMN METADATA LAYER: Shipping address vs Payment layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-3">
              Delivery Address
            </h3>
            <p className="text-sm font-bold text-gray-900">
              {invoice.shippingAddress.name}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {invoice.shippingAddress.street}
            </p>
            <p className="text-xs text-gray-600">
              {invoice.shippingAddress.city},{" "}
              {invoice.shippingAddress.postalCode}
            </p>
            <p className="text-xs text-gray-400 font-medium pt-1">
              Phone: {invoice.shippingAddress.phone}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-3">
              Payment Parameters
            </h3>
            <p className="text-xs font-semibold text-gray-700">
              {invoice.paymentMethod}
            </p>
            <div className="pt-2">
              <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md border border-blue-100">
                ✓ Invoice Fully Cleared
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM LEDGER PANEL: Final Items breakdown matrix list */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Itemized Purchase Details
          </h3>

          <div className="divide-y divide-gray-100">
            {invoice.items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex items-center justify-between gap-4 text-xs first:pt-0"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-gray-900 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-gray-400">
                      Quantity Ordered: {item.qty} units
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-900 whitespace-nowrap">
                  Rp {(item.price * item.qty).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom Financial Totals Matrix */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Items Total Subtotal</span>
              <span className="font-semibold text-gray-900">
                Rp {invoice.financials.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery (Flat Rate)</span>
              <span className="font-semibold text-gray-900">
                Rp {invoice.financials.shippingFee.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Value Added Tax (PPN 11%)</span>
              <span className="font-semibold text-gray-900">
                Rp {invoice.financials.taxAdjustment.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
              <span>Total Payment Authorized</span>
              <span className="text-blue-600">
                Rp {invoice.financials.grandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
