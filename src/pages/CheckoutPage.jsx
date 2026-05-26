import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { PPN_PERCENTAGE, SHIPPING_FEE } from "../constants";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart } = useShop();

  // Contact/Shipping Form Fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Computations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxAdjustment = Math.round(subtotal * PPN_PERCENTAGE);
  const finalTotal = subtotal + SHIPPING_FEE + taxAdjustment;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProcessOrder = (e) => {
    e.preventDefault();
    setError("");

    // Quick Validation Loop
    const { firstName, email, address, city } = formData;
    if (!firstName || !email || !address || !city) {
      setError(
        "Please finalize your required contact and destination shipping details.",
      );
      return;
    }

    setIsLoading(true);

    // Simulating safe transactions clearing backend delays
    setTimeout(() => {
      setIsLoading(false);
      alert("Transaction Authorized! Thank you for purchasing from Nexus.");
      navigate("/home");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Return Header */}
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-gray-200">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <span className="text-xl font-black tracking-tight text-blue-600">
              NEXUS
            </span>
            <span className="text-xs font-semibold text-gray-500">
              | Secure Checkout
            </span>
          </div>
          <button
            onClick={() => navigate("/home")}
            className="text-xs font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            ← Return to shopping
          </button>
        </div>

        {/* Global Split Framework Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDE: INPUT FORMS (8 Columns) */}
          <form
            onSubmit={handleProcessOrder}
            className="lg:col-span-7 xl:col-span-8 space-y-6"
          >
            {error && (
              <div className="p-4 bg-red-50 text-red-700 text-xs font-bold border border-red-200 rounded-xl">
                {error}
              </div>
            )}

            {/* Step 1: Shipping Addresses */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">
                  1
                </span>
                Shipping Destination
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                  placeholder="Jl. Sudirman No. 45, Apartment 12B"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="Jakarta Selatan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                    placeholder="12190"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Selections */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]">
                  2
                </span>
                Payment Mechanism
              </h2>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer select-none transition-colors ${paymentMethod === "card" ? "border-blue-600 bg-blue-50/40 font-semibold" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "card"}
                    readOnly
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs">Credit/Debit Card</span>
                </div>
                <div
                  onClick={() => setPaymentMethod("transfer")}
                  className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer select-none transition-colors ${paymentMethod === "transfer" ? "border-blue-600 bg-blue-50/40 font-semibold" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    checked={paymentMethod === "transfer"}
                    readOnly
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs">Bank VA Transfer</span>
                </div>
              </div>

              {/* Conditional Card Form */}
              {paymentMethod === "card" ? (
                <div className="pt-2 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                      placeholder="JOHN DOE"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                      placeholder="4111 2222 3333 4444"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Expiration
                      </label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        CVC Code
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="w-full text-sm border border-gray-300 rounded-lg p-2.5 focus:border-blue-500 focus:outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-600 leading-relaxed">
                  Upon clicking submit, a virtual account entry code will be
                  generated via **Bank Central Asia (BCA)** or Mandiri to settle
                  payment parameters directly.
                </div>
              )}
            </div>
          </form>

          {/* RIGHT SIDE: FIXED SUMMARY PANEL (4 Columns) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
                Order Composition
              </h2>

              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex justify-between items-start gap-4 text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-800 line-clamp-2">
                        {item.name}
                      </p>
                      <p className="text-gray-400">
                        Qty: {item.quantity} × Rp{" "}
                        {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-900 whitespace-nowrap">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Math Computations Breakdown */}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Carrier Fee</span>
                  <span className="font-medium text-gray-900">
                    Rp {SHIPPING_FEE.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT Tax Framework (11%)</span>
                  <span className="font-medium text-gray-900">
                    Rp {taxAdjustment.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-extrabold text-gray-900">
                  <span>Grand Final Total</span>
                  <span className="text-blue-600">
                    Rp {finalTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Secure Verification Action Hook */}
              <div className="pt-2">
                <button
                  onClick={handleProcessOrder}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-sm transition-colors shadow-xs flex justify-center items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Clearing Security Gateway...</span>
                    </div>
                  ) : (
                    `Authorize Payment • Rp ${finalTotal.toLocaleString("id-ID")}`
                  )}
                </button>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </svg>
                SSL Enforced 256-Bit Encrypted Link
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
