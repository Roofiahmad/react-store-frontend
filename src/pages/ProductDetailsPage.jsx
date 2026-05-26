import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import api from "../lib/api";

// Detailed Singular Product Specimen (with integrated mock customer reviews)
const INITIAL_PRODUCT = {
  id: "prod-001",
  name: "Pro Wireless Noise-Cancelling Headphones",
  category: "Electronics",
  price: 2499000,
  sku: "NEX-HDP-0042",
  description:
    "Immersive sound architecture meeting hybrid active noise cancellation. Engineered with 40mm custom dynamic drivers to capture clinical acoustic balances alongside robust 40-hour long playback stamina modules.",
  specs: [
    "Driver Size: 40mm Dynamic",
    "Battery Life: Up to 40 Hours (ANC On)",
    "Connectivity: Bluetooth 5.3 & 3.5mm Aux Line",
    "Charging Type: USB-C Fast Charge (5 min = 4 hours)",
  ],
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&auto=format&fit=crop&q=80",
  ],
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

  const [product, setProduct] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("specs"); // 'specs' or 'reviews'
  const [, setCartCount] = useState(0);

  // New Review Submission Form States
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [reviewList, setReviewList] = useState(INITIAL_PRODUCT.reviews);

  // Math Metrics Computation Engine
  const totalReviews = reviewList.length;
  const averageRating = (
    reviewList.reduce((sum, r) => sum + r.rating, 0) / totalReviews
  ).toFixed(1);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newAuthor || !newText) {
      alert("Please fill out your name and review text.");
      return;
    }

    const addedReview = {
      id: Date.now(),
      author: newAuthor,
      rating: Number(newRating),
      date: new Date().toISOString().split("T")[0],
      text: newText,
    };

    setReviewList([addedReview, ...reviewList]);
    setNewAuthor("");
    setNewText("");
    setNewRating(5);
  };

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
          console.log(response.data.data);
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

  console.log(productId, "productId");
  console.log(selectedImage, "selected Image");

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
                  setCartCount((c) => c + 1);
                  alert("Item logged into cart instance.");
                }}
                className="flex-grow sm:flex-none bg-blue-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-xs"
              >
                Add To Shopping Bag
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="flex-grow sm:flex-none border border-gray-300 text-gray-700 font-bold px-8 py-3.5 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Instant Checkout
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM LAYER: SPECIFICATIONS VS USER REVIEW COMPARTMENT TAB TRAY */}
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Tab Selector Headers */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "specs" ? "bg-white text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-900"}`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "reviews" ? "bg-white text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-900"}`}
            >
              User Reviews ({totalReviews})
            </button>
          </div>

          {/* Tab Payload Displays */}
          <div className="p-6 lg:p-8">
            {/* TAB: SPECS MODULE */}
            {activeTab === "specs" && (
              <ul className="space-y-3">
                {INITIAL_PRODUCT.specs.map((spec, i) => (
                  <li
                    key={i}
                    className="flex gap-4 text-sm items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600/20 text-blue-600 flex items-center justify-center font-bold text-[8px]">
                      ✓
                    </span>
                    <span className="text-gray-700 font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* TAB: REVIEWS ENGINE */}
            {activeTab === "reviews" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Submit New Review (5 Columns) */}
                <div className="lg:col-span-5 bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-4">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Write a Customer Review
                  </h3>

                  <form onSubmit={handleAddReview} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full text-sm bg-white border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., Eko Wijaya"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Rating
                      </label>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                        className="w-full text-sm bg-white border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                      >
                        <option value="5">★★★★★ (5 Stars)</option>
                        <option value="4">★★★★☆ (4 Stars)</option>
                        <option value="3">★★★☆☆ (3 Stars)</option>
                        <option value="2">★★☆☆☆ (2 Stars)</option>
                        <option value="1">★☆☆☆☆ (1 Star)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">
                        Review Description
                      </label>
                      <textarea
                        rows="3"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                        className="w-full text-sm bg-white border border-gray-300 rounded-lg p-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Share your experience working with this gear..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gray-900 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Post Review
                    </button>
                  </form>
                </div>

                {/* Right Side: Active Feed Stream (7 Columns) */}
                <div className="lg:col-span-7 divide-y divide-gray-100 space-y-6">
                  {reviewList.map((rev) => (
                    <div
                      key={rev.id}
                      className="pt-6 first:pt-0 text-sm space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900 capitalize">
                          {rev.author}
                        </p>
                        <span className="text-xs text-gray-400 font-medium">
                          {rev.date}
                        </span>
                      </div>
                      <div className="text-amber-400 text-xs">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </div>
                      <p className="text-gray-600 font-light leading-relaxed">
                        {rev.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
