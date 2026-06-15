import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PATHS, PPN_PERCENTAGE } from "../constants";
import { toast } from "react-toastify";
import api from "../lib/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const cartPollingInterval = useRef();
  const appName = import.meta.env.VITE_APP_TITLE;

  const [cart, setCart] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressLoading, setIsAddressLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValues,
  } = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
    },
  });

  async function fetchUserCart(controller, addressId) {
    if(!addressId) return;
    
    try {
      setIsCartLoading(true);
      const response = await api.get("/carts?addressId=" + addressId, {
        signal: controller.signal,
      });

      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to fetch user cart");
      }
    } finally {
      setIsCartLoading(false);
    }
  }

  async function fetchUserAddresses(controller) {
    try {
      setIsAddressLoading(true);
      const response = await api.get("/address", {
        signal: controller.signal,
      });

      if (response.data.success) {
        const addressList = response.data.data || [];
        setSavedAddresses(addressList);

        const defaultAddress =
          addressList.find((a) => a.isPrimary) || addressList[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        }
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to fetch user addresses");
      }
    } finally {
      setIsAddressLoading(false);
    }
  }

  async function fetchUserProfile(controller) {
    try {
      setIsAddressLoading(true);
      const response = await api.get("/profile", {
        signal: controller.signal,
      });

      if (response.data.success) {
        const { name: fullName, email, phoneNumber } = response.data.data;
        setValues(
          {
            fullName,
            phoneNumber,
            email,
          },
          { shouldValidate: true },
        );
      }
    } catch (err) {
      if (err.name !== "CanceledError") {
        toast.error("Failed to fetch user profile");
      }
    } finally {
      setIsAddressLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserProfile(controller);
    fetchUserAddresses(controller);

    cartPollingInterval.current = setInterval(() => {
      fetchUserCart(controller);
    }, 1000);

    return () => {
      controller.abort();
      clearInterval(cartPollingInterval.current);
      cartPollingInterval.current = null;
    };
  }, [cartPollingInterval]);

  useEffect(() => {
    if (cart) {
      clearInterval(cartPollingInterval.current);
      cartPollingInterval.current = null;
    }
  }, [cart]);

  // 4. STRIPE SESSION DISPATCH PIPELINE
  const onSubmitOrder = async (contactData) => {
    if (!selectedAddress) {
      toast.warn("Please select a target shipping destination card first.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your marketplace cart configuration is empty!");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        fullName: contactData.fullName.trim(),
        phoneNumber: contactData.phoneNumber.trim(),
        email: contactData.email.trim(),
        shippingAddressId: selectedAddress.id,
        cartId: cart.id,
      };

      const response = await api.post("/checkout", payload);

      if (response.data.success) {
        const { checkoutUrl } = response.data.data;
        toast.info(
          "Order session registered! Handing off to Stripe Gateway...",
        );
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = checkoutUrl;
      }
    } catch (err) {
      console.error("Gateway Session Handshake Failure:", err);
      toast.error(
        "Failed to initialize transaction pipeline securely with Stripe.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedAddress?.id) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserCart(controller, selectedAddress?.id);
  }, [selectedAddress?.id]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Return Header Layout */}
        <div className="flex justify-between items-center pb-6 mb-8 border-b border-gray-200">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(PATHS.HOME)}
          >
            <span className="text-xl font-black tracking-tight text-blue-600">
              {appName}
            </span>
            <span className="text-xs font-bold text-gray-400">
              | Secure Gateway Encryption
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="text-xs font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            &larr; Return to checkout cart
          </button>
        </div>

        {/* Global Split Framework Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL COLUMN LAYOUT FORMS */}
          <form
            onSubmit={handleSubmit(onSubmitOrder)}
            className="lg:col-span-7 xl:col-span-8 space-y-6"
          >
            {/* STEP 1: CONTACT DATA */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-xs space-y-4">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  1
                </span>
                Contact Identity
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* 👤 Full Name Field */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("fullName", {
                      required: "Full name is mandatory",
                    })}
                    className={`w-full text-sm border rounded-lg p-2.5 bg-white focus:outline-none ${errors.fullName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    placeholder="Eko Wijaya"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* 📞 Phone Number Field */}
                <div>
                  <label className="block font-bold text-gray-600 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                    })}
                    className={`w-full text-sm border rounded-lg p-2.5 bg-white focus:outline-none ${errors.phoneNumber ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                    placeholder="e.g., +628123456789"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-gray-600 mb-1">
                  Electronic Mail Address *
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Contact destination email is required",
                  })}
                  className={`w-full text-sm border rounded-lg p-2.5 bg-white focus:outline-none ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                  placeholder="eko@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 font-semibold">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* STEP 2: SHIPPING DATA ASSIGNMENT */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-xs space-y-4">
              <div className="flex justify-between items-baseline border-b border-gray-100 pb-2">
                <h2 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                  <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                    2
                  </span>
                  Logistics Shipping Track
                </h2>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="text-[11px] font-bold text-blue-600 hover:underline"
                >
                  Configure Addresses &rarr;
                </button>
              </div>

              {isAddressLoading ? (
                <div className="py-8 text-center text-xs text-gray-400 font-medium animate-pulse">
                  Querying database logistics routes...
                </div>
              ) : savedAddresses.length === 0 ? (
                <div className="p-6 border border-dashed border-red-200 bg-red-50/40 rounded-xl text-center space-y-3">
                  <p className="text-xs text-red-700 font-bold">
                    No distribution addresses verified on your profile account
                    registry yet.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="bg-gray-900 text-white px-4 py-2 font-black text-[10px] uppercase tracking-wider rounded-xl hover:bg-blue-600 transition-all shadow-xs"
                  >
                    Setup Delivery Destination Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses?.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`p-3.5 border text-xs rounded-xl cursor-pointer flex flex-col justify-between transition-all select-none relative group
                          ${isSelected ? "border-blue-600 bg-blue-50/20 shadow-xs ring-1 ring-blue-600" : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300"}`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-black tracking-tight uppercase text-[10px] ${isSelected ? "text-blue-700" : "text-gray-500"}`}
                            >
                              📍 {addr.label} {addr.isPrimary && "• (Default)"}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">
                                ✓
                              </span>
                            )}
                          </div>
                          <p className="text-gray-900 font-bold pt-1 leading-relaxed">
                            {addr.street}
                          </p>
                          <p className="text-gray-400 text-[11px] font-medium">
                            {addr.city}, {addr.state} • {addr.zip}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 3: EXTERNAL STRIPE OUTSOURCE NOTIFICATION */}
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-xs space-y-3">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                  3
                </span>
                Secure Transaction Layer
              </h2>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3">
                <span className="text-xl pt-0.5">💳</span>
                <div className="space-y-1 text-xs leading-relaxed text-gray-600">
                  <p className="font-bold text-gray-900">
                    Stripe Secure Handshake Redirection
                  </p>
                  <p className="font-light text-gray-500">
                    To maintain strict security configurations, clicking payment
                    authorization redirects you out seamlessly to tokens issued
                    by **Stripe Inc**. Raw payment digits never interact with
                    our application system.
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* RIGHT SIDE PANEL: ORDER BREAKDOWN SUMMARY */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3 uppercase tracking-wider text-xs text-gray-500">
                Order Items Composition
              </h2>

              <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
                {cart?.items?.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 flex justify-between items-start gap-4 text-xs animate-fade-in"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-gray-800 line-clamp-2 leading-snug">
                        {item.name}
                      </p>
                      <p className="text-gray-400 font-medium font-mono">
                        Qty: {item.quantity} &times; Rp{" "}
                        {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <span className="font-extrabold text-gray-900 font-mono whitespace-nowrap">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Math Computations Breakdowns */}
              <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900 font-mono">
                    Rp {cart?.subTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Carrier Fee</span>
                  <span className="font-bold text-gray-900 font-mono">
                    Rp {cart?.shippingFee.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT Tax Framework ({PPN_PERCENTAGE * 100}%)</span>
                  <span className="font-bold text-gray-900 font-mono">
                    Rp {cart?.vatAmount.toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-blue-600 font-mono text-base">
                    Rp {cart?.totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Authorize Master Submission Action Button Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmitOrder)}
                  disabled={
                    isSubmitting ||
                    isAddressLoading ||
                    isCartLoading ||
                    savedAddresses.length === 0 ||
                    cart?.items.length === 0
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-xs flex justify-center items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
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
                      <span>Generating Stripe Gateway Link...</span>
                    </div>
                  ) : (
                    `Proceed to Stripe • Rp ${cart?.totalPrice.toLocaleString("id-ID")}`
                  )}
                </button>
              </div>

              {/* Encryption Assurance Badges Footer Panel */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 pt-1 select-none">
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
