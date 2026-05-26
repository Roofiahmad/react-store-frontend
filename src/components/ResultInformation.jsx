const ResultInformation = ({
  badgeQuery,
  totalItems,
  searchQuery,
  setViewType,
  viewType,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-xs gap-4">
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider flex items-center gap-2">
          <span>Search Results</span>
          {badgeQuery === "SALE" && (
            <span className="bg-red-50 text-red-600 border border-red-100 font-black text-[9px] tracking-widest px-1.5 py-0.5 rounded-md">
              🔥 HOT DEALS ACTIVE
            </span>
          )}
        </p>
        <h1 className="text-sm text-gray-600 mt-0.5">
          Found{" "}
          <span className="font-bold text-gray-900">{totalItems} items</span>{" "}
          matching "
          {searchQuery ||
            (badgeQuery === "SALE" ? "Clearance Sales" : "All Products")}
          "
        </h1>
      </div>

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
  );
};

export default ResultInformation;
