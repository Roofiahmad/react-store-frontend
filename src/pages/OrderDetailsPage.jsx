import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../lib/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import OrderProgressBar from "../components/OrderProgressBar";
import { CUSTOMER_ORDER_STATUS_INFO } from "../constants";
import { formatIsoDate } from "../utils/date";

const PAYMENT_METHOD = "Credit Card (Visa ending in 2424)";

export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviews, setReviews] = useState({});
  const [everSubmittedReview, setEverSubmittedReview] = useState([]);

  const fetchOrderDetails = async (signal) => {
    try {
      setIsLoading(true);
      const orderPromise = api.get(`/orders/${orderId}`, { signal });
      const reviewPromise = api.get(`/orders/${orderId}/reviews`, { signal });
      const [orderDetailResponse, reviewResponse] = await Promise.all([
        orderPromise,
        reviewPromise,
      ]);

      if (orderDetailResponse.data.success && reviewResponse.data.success) {
        setOrderDetails(orderDetailResponse.data.data || null);

        const initialReviewState = {};
        const trackExistingReview = [];
        orderDetailResponse.data.data.items.forEach((item) => {
          const existingReview = reviewResponse.data.data.find(
            (r) => r.productId == item.id,
          );

          if (existingReview) trackExistingReview.push(existingReview);

          initialReviewState[item.id] = {
            rating: existingReview?.rating || 5,
            comment: existingReview?.comment || "",
          };
        });

        if (trackExistingReview.length) {
          setEverSubmittedReview(trackExistingReview);
        }

        setReviews(initialReviewState);
      }
    } catch (err) {
      console.log(err);
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
  }, [orderId]);

  const handleConfirmDelivery = async () => {
    if (
      !window.confirm("Are you sure your parcel has arrived safely and intact?")
    )
      return;

    try {
      setIsLoading(true);
      const response = await api.post(`/orders/${orderId}/delivered`);
      if (response.data.success) {
        toast.success("Delivery confirmed! Thank you for shopping with us 🎉");
        fetchOrderDetails();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update delivery confirmation tracking.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewInputChange = (itemId, field, value) => {
    setReviews((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [field]: value },
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const reviewItems = [];
    Object.keys(reviews).forEach((key) => {
      reviewItems.push({
        productId: key,
        ...reviews[key],
      });
    });

    const alreadyReviewedProductIds = everSubmittedReview.map(
      (r) => r.productId,
    );
    const filteredReview = reviewItems.filter(
      (r) =>
        !alreadyReviewedProductIds.includes(r.productId) && r.comment.trim(),
    );

    try {
      setSubmittingReview(true);
      const response = await api.post(`orders/${orderId}/reviews`, {
        reviews: filteredReview,
      });
      if (response.status == 201) {
        toast.success("Your product feedback was captured perfectly! 🙌");
        fetchOrderDetails();
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to submit product reviews.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-16">
      {(isLoading || submittingReview) && <LoadingSpinner />}
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
        {/* TOP STATUS ROW: Order Meta Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left Column: Core Identification Meta */}
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl font-black tracking-tight text-gray-900 font-mono">
                #ORD-{orderDetails?.id}
              </h1>

              {/* Sleek, non-wrapping dynamic status token badge */}
              <span className="inline-flex items-center bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">
                {CUSTOMER_ORDER_STATUS_INFO[orderDetails?.status] ||
                  orderDetails?.status}
              </span>
            </div>

            <p className="text-xs text-gray-400 font-semibold tracking-wide">
              Transaction Manifest Settled on:{" "}
              <span className="font-mono text-gray-500 font-medium">
                {formatIsoDate(orderDetails?.createdAt, "MM/dd/yyyy, HH:mm:ss")}
              </span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:self-center">
            {orderDetails?.status === "SHIPPED" && (
              <button
                type="button"
                onClick={handleConfirmDelivery}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer select-none"
              >
                <span>✓</span>
                <span>Confirm Received</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="text-xs font-bold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-3 rounded-xl transition-all text-center cursor-pointer select-none"
            >
              ← Back to History
            </button>
          </div>
        </div>

        {/* TIMELINE INTERACTIVE TRACKS */}
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
              <span className="font-bold text-gray-800">
                J&T Express Regular
              </span>
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

        {/* LOGISTICS ADDRESS AND INVOICE DATA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2 mb-3">
              Delivery Address
            </h3>
            <p className="text-sm font-bold text-gray-900">
              {orderDetails?.shippingAddress?.label || "Primary Residence"}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {orderDetails?.shippingAddress?.street}
            </p>
            <p className="text-xs text-gray-600">
              {orderDetails?.shippingAddress?.city},{" "}
              {orderDetails?.shippingAddress?.zip}
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

        {/* CARGO LINE ITEMS SUMMARY SLAT */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-3">
            Purchase Details
          </h3>
          <div className="divide-y divide-gray-100">
            {orderDetails?.items?.map((item) => (
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

          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-600 max-w-sm ml-auto">
            <div className="flex justify-between">
              <span>Items Total Subtotal</span>
              <span className="font-semibold text-gray-900">
                Rp {orderDetails?.subTotal?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Courier Delivery (Flat Rate)</span>
              <span className="font-semibold text-gray-900">
                Rp {orderDetails?.shippingFee?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Value Added Tax (PPN 11%)</span>
              <span className="font-semibold text-gray-900">
                Rp {orderDetails?.vatAmount?.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-sm font-black text-gray-900">
              <span>Total Payment Authorized</span>
              <span className="text-blue-600">
                Rp {orderDetails?.totalPrice?.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* ⭐️ NEW MODULE BLOCK: COLLATERAL REVIEW MANAGER FROM COMPLETED TRANSACTION SHUTTLES */}
        {orderDetails?.status === "DELIVERED" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4 animate-fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                <span>🙌 Share Your Experience</span>
              </h3>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                This transaction sequence is fully verified. Tell others how
                your new gear shapes up!
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="divide-y divide-gray-100">
                {orderDetails?.items?.map((item) => {
                  const itemReview = reviews[item.id] || {
                    rating: 5,
                    comment: "",
                  };

                  return (
                    <div
                      key={item.id}
                      className="py-4 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-start text-xs"
                    >
                      {/* Product Thumbnail Anchor Context */}
                      <div className="md:col-span-4 flex gap-3 items-center">
                        <img
                          src={item.mainImage}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0"
                        />
                        <p className="font-bold text-gray-800 line-clamp-2">
                          {item.name}
                        </p>
                      </div>

                      {/* Interactive Star Selection Row Segment */}
                      <div className="md:col-span-3 space-y-1">
                        <label className="block font-bold text-gray-400 uppercase text-[9px] tracking-wider">
                          Product Rating
                        </label>
                        <div className="flex gap-1 text-base">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              disabled={
                                !!everSubmittedReview.find(
                                  (r) => r.productId == item.id,
                                )
                              }
                              key={star}
                              type="button"
                              onClick={() =>
                                handleReviewInputChange(item.id, "rating", star)
                              }
                              className={`transition-transform active:scale-125 cursor-pointer select-none
                                ${star <= itemReview.rating ? "text-amber-400" : "text-gray-200"}`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="md:col-span-5 space-y-1">
                        <label className="block font-bold text-gray-400 uppercase text-[9px] tracking-wider">
                          Write a Public Review
                        </label>
                        <textarea
                          disabled={
                            !!everSubmittedReview.find(
                              (r) => r.productId == item.id,
                            )
                          }
                          rows={2}
                          value={itemReview.comment}
                          onChange={(e) =>
                            handleReviewInputChange(
                              item.id,
                              "comment",
                              e.target.value,
                            )
                          }
                          placeholder="How is the sizing, quality, or texture? Drop your thoughts..."
                          className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl p-2.5 text-xs font-semibold focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 shadow-inner resize-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Submit Review Actions Footer Container */}
              <div
                className="pt-4 border-t border-gray-100 text-right"
                hidden={
                  everSubmittedReview.length == orderDetails?.items.length
                }
              >
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-gray-900 hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-xs active:scale-[0.98] cursor-pointer select-none"
                >
                  Submit Product Reviews
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
