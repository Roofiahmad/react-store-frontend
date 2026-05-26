import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants";

const EmptyResult = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center w-full space-y-4 shadow-xs">
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
        Try using broader keywords, checking for typos, or clearing search
        criteria bounds.
      </p>
      <button
        onClick={() => navigate(PATHS.SEARCH_RESULTS)}
        className="text-xs bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
      >
        Clear Search Parameters
      </button>
    </div>
  );
};

export default EmptyResult;
