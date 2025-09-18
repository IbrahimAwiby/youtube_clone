import { useState, useEffect } from "react";
import Feed from "../../components/Feed/Feed";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Home.css";

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
      <div className={`container ${sidebar ? "" : "large-container"}`}>
        {isSearching && searchResults ? (
          <div className="search-results">
            <h2>Search Results for: "{searchResults.query}"</h2>
            <button onClick={handleClearSearch}>Clear Search</button>
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
    </>
  );
};

export default Home;
