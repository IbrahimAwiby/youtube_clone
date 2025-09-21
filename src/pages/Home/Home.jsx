import { useEffect, useState } from "react";
import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar";

// Home Component
const Home = ({ sidebar, searchResults, setSearchResults, clearSearch }) => {
  const [category, setCategory] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Check if we have search results
    if (searchResults && searchResults.query) {
      setIsSearching(true);
      setCurrentPage(1); // Reset to first page when new search
    } else {
      setIsSearching(false);
    }
  }, [searchResults]);

  // Clear search results when category changes
  useEffect(() => {
    if (searchResults && category !== 0) {
      clearSearch();
    }
    setCurrentPage(1); // Reset to first page when category changes
  }, [category, searchResults, clearSearch]);

  // Handle clear search button click
  const handleClearSearch = () => {
    clearSearch();
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update total pages when feed data changes
  const handleTotalPagesChange = (pages) => {
    setTotalPages(pages);
  };

  // Generate pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-full 
        ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
      >
        ‹
      </button>
    );

    // First page + ellipsis
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`w-9 h-9 flex items-center justify-center rounded-full 
          ${
            currentPage === 1
              ? "bg-red-500 text-white"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 flex items-center justify-center rounded-full 
          ${
            currentPage === i
              ? "bg-red-700 text-white"
              : "hover:bg-gray-200 dark:hover:bg-red-500 text-gray-700 dark:text-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page + ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-9 h-9 flex items-center justify-center rounded-full 
          ${
            currentPage === totalPages
              ? "bg-red-500 text-white"
              : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-full 
        ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
      >
        ›
      </button>
    );

    return (
      <div className="flex justify-center items-center gap-2 mt-6 pb-6 flex-wrap">
        {pages}
      </div>
    );
  };

  return (
    <>
      <Sidebar
        sidebar={sidebar}
        category={category}
        setCategory={setCategory}
      />
      <div
        className={`pt-16 ${
          sidebar ? "ml-48" : "ml-14"
        } transition-all duration-300 min-h-screen bg-gray-100 dark:bg-gray-900`}
      >
        <div className="">
          {isSearching && searchResults ? (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 p-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Search Results for: "{searchResults.query}"
                </h2>
                <button
                  onClick={handleClearSearch}
                  className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <span className="block md:hidden">✕</span>
                  <span className="hidden md:block">Clear Search</span>
                </button>
              </div>
              <Feed
                category={category}
                searchQuery={searchResults.query}
                isSearch={true}
                currentPage={currentPage}
                onTotalPagesChange={handleTotalPagesChange}
              />
              {renderPagination()}
            </div>
          ) : (
            <>
              <Feed
                category={category}
                currentPage={currentPage}
                onTotalPagesChange={handleTotalPagesChange}
              />
              {renderPagination()}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
