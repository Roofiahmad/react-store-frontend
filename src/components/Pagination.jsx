const Pagination = ({ currentPage, handlePageChange, totalPages }) => {
  return (
    <div className="flex justify-center items-center gap-2 pt-4 border-t border-gray-200">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-bold"
      >
        &larr; Prev
      </button>

      {Array.from({ length: totalPages }, (_, idx) => {
        const pageNum = idx + 1;
        return (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`w-9 h-9 text-xs font-black rounded-xl border transition-all ${currentPage === pageNum ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-bold"
      >
        Next &rarr;
      </button>
    </div>
  );
};

export default Pagination;
