import { useEffect, useState } from "react";
import { useShop } from "../context/ShopContext";
import Navbar from "../components/Navbar";
import { ADMIN, ALL_CATEGORY, PATHS } from "../constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../lib/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const navigate = useNavigate();
  const { addToCart, user } = useShop();

  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [categories, setCategories] = useState([ALL_CATEGORY]);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const filteredProducts =
    selectedCategory === ALL_CATEGORY
      ? products
      : products?.filter((p) => p.categoryName === selectedCategory);

  const handleAddToCart = (item) => {
    if (user?.role == ADMIN) return alert("admin can't add to cart !!!");
    addToCart(item);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await api.get("/products", {
          signal: controller.signal,
        });

        if (response.data.success) {
          setProducts(response.data.data.content);
          const uniqueCategories = [
            ...new Set(response.data.data.content.map((p) => p.categoryName)),
          ];

          setCategories((prevState) => [...prevState, ...uniqueCategories]);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve product listings.");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      {isLoading && <LoadingSpinner />}
      <Navbar />

      <header className="bg-white border-b border-gray-200 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="space-y-4 lg:col-span-3 text-left">
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Mid-Year Clearance Sale
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Upgrade Your Everyday Routine
            </h1>
            <p className="text-base text-gray-500 max-w-lg leading-relaxed">
              Explore multi-category deals designed around your workspace,
              apparel wardrobe, and lifestyle essentials. High quality, vetted
              sellers, and lightning-fast logistics processing.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => navigate(PATHS.SEARCH_RESULTS + "?badge=SALE")}
                className="bg-blue-600 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-700 transition-colors rounded-lg shadow-sm"
              >
                Shop Hot Deals
              </button>
              <button
                onClick={() => navigate(PATHS.SEARCH_RESULTS)}
                className="bg-gray-100 text-gray-700 px-6 py-3 text-sm font-semibold hover:bg-gray-200 transition-colors rounded-lg"
              >
                View All Categories
              </button>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-2 h-[280px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80"
              alt="Modern lifestyle gadgets and logistics presentation"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-200 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Featured Products
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Showing verified listings across active store segments
            </p>
          </div>

          {/* Flat Segmented Filter Pills */}
          <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200 ">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  selectedCategory === cat
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              handleAddToCart={handleAddToCart}
              handleOnCLickProduct={() =>
                navigate(PATHS.PRODUCT_DETAILS + `?id=${product.id}`)
              }
            />
          ))}
        </div>
      </main>
    </div>
  );
}
