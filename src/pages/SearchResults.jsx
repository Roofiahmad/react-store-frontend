import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

// Master Inventory Array to Mock Search Filtering
const MOCK_MASTER_INVENTORY = [
  {
    id: "prod-001",
    name: "Pro Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 2499000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=80",
    rating: 4.8,
  },
  {
    id: "prod-002",
    name: "Ergonomic Mechanical Gaming Keyboard",
    category: "Electronics",
    price: 1250000,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&auto=format&fit=crop&q=80",
    rating: 4.6,
  },
  {
    id: "prod-003",
    name: "Minimalist Canvas Travel Backpack",
    category: "Apparel",
    price: 680000,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80",
    rating: 4.2,
  },
  {
    id: "prod-004",
    name: "Insulated Stainless Steel Water Bottle",
    category: "Fitness",
    price: 320000,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80",
    rating: 4.5,
  },
  {
    id: "prod-005",
    name: "Smart Fitness Tracker & Heart Rate Monitor",
    category: "Fitness",
    price: 1899000,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80",
    rating: 4.7,
  },
  {
    id: "prod-006",
    name: "Premium Heavyweight Cotton Hoodie",
    category: "Apparel",
    price: 450000,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=80",
    rating: 4.4,
  },
];

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Extract search term from url queries (?q=headphones), defaulting to empty string
  const searchQuery = searchParams.get("q") || "";

  // Layout & Filter States
  const [viewType, setViewType] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("relevant"); // 'relevant', 'price-low', 'price-high'
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter and Sort Computing Logic
  const processedResults = useMemo(() => {
    let items = MOCK_MASTER_INVENTORY.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    if (selectedCategory !== "All") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (sortBy === "price-low") items.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") items.sort((a, b) => b.price - a.price);

    return items;
  }, [searchQuery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased">
      <Navbar cartCount={2} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TOP STATUS BAR: Query metrics & layout toggles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-xs gap-4">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
              Search Results
            </p>
            <h1 className="text-sm text-gray-600 mt-0.5">
              Found{" "}
              <span className="font-bold text-gray-900">
                {processedResults.length} items
              </span>{" "}
              matching "{searchQuery || "All Products"}"
            </h1>
          </div>

          {/* Layout controls */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-bold">
              <button
                onClick={() => setViewType("grid")}
                className={`px-3 py-1.5 rounded-md transition-all ${viewType === "grid" ? "bg-white shadow-xs text-gray-900" : "text-gray-500"}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`px-3 py-1.5 rounded-md transition-all ${viewType === "list" ? "bg-white shadow-xs text-gray-900" : "text-gray-500"}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* CONDITION: EMPTY RESULTS PLACEHOLDER CONTAINER */}
        {processedResults.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 shadow-xs mt-10">
            <div className="text-gray-300 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-900">
              No matches found for your query
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
              Check spelling structural errors, try broader keywords, or clear
              filter bounds.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("relevant");
                navigate("/search");
              }}
              className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
            >
              Clear Search Parameters
            </button>
          </div>
        ) : (
          /* SPLIT PANEL CONTENT WINDOW: FILTERS (3 Cols) VS RESULTS MATRIX (9 Cols) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SIDEBAR ACCORDION FILTERS: (Left 3 Columns) */}
            <aside className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-xs">
              {/* Sort Logic Block */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Sort Listings By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Segment Filtering Block */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Category Filters
                </label>
                <div className="space-y-1 text-xs">
                  {["All", "Electronics", "Apparel", "Fitness"].map((cat) => (
                    <div
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full p-2 rounded-lg cursor-pointer flex justify-between font-semibold select-none transition-colors ${selectedCategory === cat ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && (
                        <span className="text-[10px]">●</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* CATALOG LISTINGS FRAMEWORK: (Right 9 Columns) */}
            <div className="lg:col-span-9">
              {viewType === "grid" ? (
                /* RENDERING: STANDARD MULTI-COLUMN COMPACT GRID */
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {processedResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="aspect-square bg-gray-50 w-full overflow-hidden border-b border-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow text-xs">
                        <span className="text-[10px] font-bold text-blue-600 uppercase mb-0.5">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-gray-800 line-clamp-2 leading-snug flex-grow group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-2 text-amber-500 text-[10px]">
                          <span>★ {product.rating}</span>
                        </div>
                        <p className="text-sm font-extrabold text-gray-900 pt-3 border-t border-gray-50 mt-3">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* RENDERING: EXTENDED PRODUCT LIST ROW ROWS */
                <div className="space-y-4">
                  {processedResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 flex gap-4 items-center shadow-xs hover:shadow-md transition-shadow"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow text-xs min-w-0 space-y-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          {product.category}
                        </span>
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-amber-500 font-medium text-[10px]">
                          ★ {product.rating}
                        </p>
                        <p className="text-base font-black text-gray-900 pt-1">
                          Rp {product.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
