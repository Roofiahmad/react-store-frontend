import { SORT_BY } from "../constants";

const FilterCard = ({
  sortBy,
  setSortBy,
  categories,
  categoryQueryId,
  handleCategorySelect,
}) => {
  return (
    <aside className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-5 space-y-5 shadow-xs">
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Sort Listings By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 font-semibold text-gray-700 focus:outline-none focus:border-blue-500"
        >
          {SORT_BY.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Category Filters
        </label>
        <div className="space-y-1 text-xs">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className={`w-full p-2 rounded-lg cursor-pointer flex justify-between font-semibold select-none transition-colors ${String(categoryQueryId) === String(cat.id) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              <span>{cat.name}</span>
              {String(categoryQueryId) === String(cat.id) && (
                <span className="text-[10px]">●</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterCard;
