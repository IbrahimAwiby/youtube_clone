import { useEffect, useState } from "react";
import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar";

// Home Component
const Home = ({ sidebar, searchResults, setSearchResults, clearSearch }) => {
  const [category, setCategory] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Check if we have search results
    if (searchResults && searchResults.query) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchResults]);

  // Clear search results when category changes
  useEffect(() => {
    if (searchResults && category !== 0) {
      clearSearch();
    }
  }, [category, searchResults, clearSearch]);

  // Handle clear search button click
  const handleClearSearch = () => {
    clearSearch();
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
              />
            </div>
          ) : (
            <Feed category={category} />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
