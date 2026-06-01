import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { toast } from "react-toastify";
import api from "../lib/api";
import { ALL_CATEGORY, SORT_BY } from "../constants";
import Pagination from "../components/Pagination";
import EmptyResult from "../components/EmptyResult";
import GridProductCard from "../components/GridProductCard";
import ListProductCard from "../components/ListProductCard";
import FilterCard from "../components/FilterCard";
import ResultInformation from "../components/ResultInformation";

const ALL = { id: 0, name: ALL_CATEGORY };

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("q") || "";
  const badgeQuery = searchParams.get("badge") || "";
  const categoryQueryId = searchParams.get("category") || ALL.id;
  const currentPage = Number(searchParams.get("page")) || 1;

  // 📝 Local state for the inline search bar query text
  const [searchInput, setSearchInput] = useState(searchQuery);

  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState(SORT_BY[0].value);
  const [isLoading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([ALL]);

  const limit = 6;
  const totalPages = Math.ceil(totalItems / limit);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({
      q: searchInput.trim(),
      badge: badgeQuery,
      category: categoryQueryId,
      page: 1,
    });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchParams({
      q: "",
      badge: badgeQuery,
      category: categoryQueryId,
      page: 1,
    });
  };

  const handlePageChange = (pageNumber) => {
    setSearchParams({
      q: searchQuery,
      badge: badgeQuery,
      category: categoryQueryId,
      page: pageNumber,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategorySelect = (category) => {
    setSearchParams({
      q: searchQuery,
      badge: badgeQuery,
      category: category.id,
      page: 1,
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      const skip = (currentPage - 1) * limit;

      try {
        setLoading(true);

        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("q", searchQuery);
        if (badgeQuery) queryParams.append("badge", badgeQuery);

        if (categoryQueryId != ALL.id) {
          queryParams.append("categoryId", categoryQueryId);
        }

        queryParams.append("skip", skip);
        queryParams.append("limit", limit);
        queryParams.append("sortBy", sortBy);

        const response = await api.get(`/products?${queryParams.toString()}`, {
          signal: controller.signal,
        });

        if (response.data.success) {
          const responseData = response.data.data.content;
          const metaData = response.data.data.meta;

          if (Array.isArray(responseData)) {
            setProducts(responseData);
            setTotalItems(metaData.totalItems);
          } else {
            setProducts(responseData.content || []);
            setTotalItems(responseData.totalElements || 0);
          }
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
    return () => controller.abort();
  }, [searchQuery, badgeQuery, categoryQueryId, currentPage, sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchCategories() {
      try {
        const response = await api.get(`/category`, {
          signal: controller.signal,
        });
        if (response.data.success) {
          setCategories([ALL, ...response.data.data]);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Could not retrieve category list");
        }
      }
    }
    fetchCategories();
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans antialiased pb-12">
      {isLoading && <LoadingSpinner />}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        
        <ResultInformation
          badgeQuery={badgeQuery}
          totalItems={totalItems}
          searchQuery={searchParams}
          setViewType={setViewType}
          viewType={viewType}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <FilterCard
            sortBy={sortBy}
            setSortBy={setSortBy}
            categories={categories}
            categoryQueryId={categoryQueryId}
            handleCategorySelect={handleCategorySelect}
          />

          <div className="lg:col-span-9 space-y-6">
            
            {/* 🔎 PROPORTIONAL PRO SEARCH FIELD BADGE (Grid-aligned) */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3.5 shadow-3xs">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.608 10.608Z" />
                    </svg>
                  </div>

                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search product"
                    className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-blue-500 rounded-xl pl-10 pr-10 py-2.5 text-xs font-semibold focus:outline-none transition-all placeholder:text-gray-400 text-gray-800 shadow-inner"
                  />

                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-colors shadow-2xs cursor-pointer select-none"
                >
                  Search
                </button>
              </form>
            </div>

            {totalItems === 0 ? (
              <EmptyResult />
            ) : (
              <>
                {viewType === "grid" ? (
                  <GridProductCard products={products} />
                ) : (
                  <ListProductCard products={products} />
                )}

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    handlePageChange={handlePageChange}
                    totalPages={totalPages}
                  />
                )}
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}