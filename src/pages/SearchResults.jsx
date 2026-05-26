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

  const [viewType, setViewType] = useState("grid");
  const [sortBy, setSortBy] = useState(SORT_BY[0].value);
  const [isLoading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [categories, setCategories] = useState([ALL]);

  const limit = 6;
  const totalPages = Math.ceil(totalItems / limit);

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

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="lg:col-span-9 space-y-8">
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
