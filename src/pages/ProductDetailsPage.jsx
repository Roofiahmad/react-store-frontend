import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import api from "../lib/api";
import { BADGE_COLORS, PATHS, SCROLL_TOP_BEHAVIOR } from "../constants";
import { useShop } from "../context/ShopContext";

const INITIAL_PRODUCT = {
  reviews: [
    {
      id: 1,
      author: "Budi Santoso",
      rating: 5,
      date: "2026-05-18",
      text: "Suaranya jernih banget, ANC-nya beneran kedap pas dipake di MRT Jakarta. Worth every Rupiah!",
    },
    {
      id: 2,
      author: "Siti Rahma",
      rating: 4,
      date: "2026-05-10",
      text: "Bass is tight and clean. Battery life is amazing. Material slightly warm on the ears after 4 hours straight.",
    },
    {
      id: 3,
      author: "Kevin Wijaya",
      rating: 5,
      date: "2026-04-28",
      text: "Excellent instrument separation. Fast delivery to Surabaya!",
    },
  ],
};

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const { user, addToCart, clearCart } = useShop();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [reviewList] = useState(INITIAL_PRODUCT.reviews);

  // Math Metrics Computation Engine
  const totalReviews = reviewList.length;
  const averageRating = (
    reviewList.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  ).toFixed(1);

  useEffect(() => {
    if (!productId) return;

    const controller = new AbortController();

    async function fetchProductById() {
      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}`, {
          signal: controller.signal,
        });

        if (response.data.success) {
          setProduct(response.data.data);
          setSelectedImage(response.data.data.gallery[0]);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve product details.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProductById();

    return () => {
      controller.abort();
    };
  }, [productId]);

  useEffect(() => {
    if (!product?.categoryId) return;

    const controller = new AbortController();

    async function fetchProductByCategoryId() {
      try {
        setLoading(true);
        const response = await api.get(
          `/products?categoryId=${product?.categoryId}&limit=3`,
          {
            signal: controller.signal,
          },
        );

        if (response.data.success) {
          setRelatedProducts(
            response.data.data.content.filter((p) => p.id != productId),
          );
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve product details.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProductByCategoryId();

    return () => {
      controller.abort();
    };
  }, [product, productId]);

  useEffect(() => {
    window.scrollTo(SCROLL_TOP_BEHAVIOR);
  }, [productId]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-16">
      {isLoading && <LoadingSpinner />}
      <Navbar />
      <main className="mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-xs">
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square w-full rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
              <img
                src={selectedImage?.url}
                alt={product?.name}
                className="w-full h-full object-cover transition-all"
              />
            </div>
            <div className="flex gap-3">
              {product?.gallery?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-50 transition-all ${selectedImage.url === img.url ? "border-blue-600 opacity-100" : "border-transparent opacity-60 hover:opacity-90"}`}
                >
                  <img
                    src={img.url}
                    alt="Thumbnail view"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ATTRIBUTES INTERFACE: (Right 7 Columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {product?.category}
              </span>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 mt-1 sm:text-3xl">
                {product?.name}
              </h1>

              {/* Star Indicator Panel */}
              <div className="flex items-center gap-2 mt-2.5">
                <div className="flex text-amber-400 items-center">
                  {"★".repeat(Math.round(averageRating))}
                  {"☆".repeat(5 - Math.round(averageRating))}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {averageRating} out of 5
                </span>
                <span className="text-xs text-gray-400">
                  ({totalReviews} consumer reviews)
                </span>
              </div>
            </div>

            {/* Price tag display */}
            <div className="mb-6">
              <p className="text-3xl font-black text-gray-900">
                Rp {product?.price.toLocaleString("id-ID")}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                ✓ In Stock • Ready for immediate courier pickup
              </p>
            </div>

            {/* Long Description Block */}
            <div className="text-sm text-gray-600 leading-relaxed space-y-4 flex-grow">
              <p>{product?.description}</p>
            </div>

            {/* Purchase Controller Interaction Tray */}
            <div className="pt-6 border-t border-gray-100 mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (!user) {
                    toast.error("You need to login first to add to cart");
                    return navigate(PATHS.LOGIN);
                  }
                  addToCart(product);
                  toast.success("Item added into cart successfully");
                }}
                className="flex-grow sm:flex-none bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-xs"
              >
                Add To Shopping Bag
              </button>
              <button
                disabled={!user}
                onClick={() => {
                  clearCart();
                  setTimeout(() => {
                    addToCart(product);
                  }, 500);
                  navigate(PATHS.CHECKOUT);
                }}
                className="flex-grow sm:flex-none border border-gray-300 text-gray-700 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Instant Checkout
              </button>
            </div>
          </div>
        </div>
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Static Header with Modern Badge */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <span>User Reviews</span>
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-[10px] font-black border border-blue-100">
                {totalReviews}
              </span>
            </h2>
            <span className="text-[10px] text-gray-400 font-medium">
              Verified Purchases Only
            </span>
          </div>

          {/* Active Reviews Feed Section */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-12">
                {/* 🌟 CONDITION A: BLANK SLATE FALLBACK (If no reviews exist) */}
                {reviewList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1}
                      stroke="currentColor"
                      className="w-10 h-10 text-gray-300 mb-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                      />
                    </svg>
                    <p className="text-xs font-bold text-gray-500">
                      No feedback submitted yet
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      Be the first to share your experience once your order
                      arrives.
                    </p>
                  </div>
                ) : (
                  /* 🌟 CONDITION B: STREAMING ACTIVE FEED LIST */
                  <div className="divide-y divide-gray-100 space-y-6">
                    {reviewList.map((rev) => {
                      const initials = rev.author
                        ? rev.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : "??";

                      return (
                        <div
                          key={rev.id}
                          className="pt-6 first:pt-0 flex items-start gap-4"
                        >
                          {/* Dynamic Circular Visual Avatar Badge Element */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center font-bold tracking-wider text-[10px] shadow-2xs">
                            {initials}
                          </div>

                          {/* Main Data Content Block */}
                          <div className="flex-grow text-sm space-y-1">
                            <div className="flex justify-between items-baseline">
                              <p className="font-black text-gray-900 capitalize text-xs tracking-tight">
                                {rev.author}
                              </p>
                              <span className="text-[10px] text-gray-400 font-medium">
                                {rev.date}
                              </span>
                            </div>

                            {/* Star Rating Render Track */}
                            <div className="text-amber-400 text-[10px] tracking-tight">
                              {"★".repeat(rev.rating)}
                              <span className="text-gray-200">
                                {"★".repeat(5 - rev.rating)}
                              </span>
                            </div>

                            <p className="text-gray-600 font-medium text-xs leading-relaxed pt-0.5">
                              {rev.text}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 🚀 NEW UP-SELL FEATURE: DYNAMIC PRODUCT SUGGESTIONS */}
        <div className="mt-12 space-y-5">
          {/* Header Section Title */}
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                You May Also Like
              </h3>
              <p className="text-[11px] text-gray-400">
                Handpicked additions selected to match your current marketplace
                search preferences.
              </p>
            </div>

            <button
              onClick={() => navigate(PATHS.SEARCH_RESULTS)}
              className="text-[11px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
            >
              View Catalog &rarr;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Mock Array loop placeholder tracking recommendations — replace 'suggestionsList' with active backend context properties later! */}
            {relatedProducts?.map((product) => (
              <div
                key={product.id}
                onClick={() =>
                  navigate(PATHS.PRODUCT_DETAILS + `?id=${product.id}`)
                }
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all cursor-pointer flex flex-col h-full"
              >
                {/* Card Image Thumbnail Section Wrapper */}
                <div className="relative aspect-square w-full bg-gray-50 overflow-hidden border-b border-gray-100">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                  />

                  {product.badge !== "NONE" && (
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-md shadow-2xs backdrop-blur-xs ${BADGE_COLORS[product.badge]}
              `}
                      >
                        {product.badge.replace("_", " ")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 flex flex-col flex-grow justify-between space-y-2">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 group-hover:text-blue-600 line-clamp-2 transition-colors min-h-[32px] leading-tight tracking-tight">
                      {product.name}
                    </h4>
                  </div>

                  <div className="pt-1 flex items-baseline justify-between">
                    <span className="text-xs font-black text-gray-900 font-mono">
                      Rp {product.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium scale-95 group-hover:scale-100 group-hover:text-blue-500 origin-right transition-all">
                      Details &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
