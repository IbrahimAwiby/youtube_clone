import { useEffect, useState } from "react";
import { useSearchParams, Routes, Route } from "react-router-dom";
import ThemeProvider from "./components/ThemeProvider";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Video from "./pages/video/Video";

// Main App Component
const App = () => {
  const [sidebar, setSidebar] = useState(true);
  const [searchResults, setSearchResults] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get search query from URL
  const searchQuery = searchParams.get("search");

  // Check for search query in URL on component mount
  useEffect(() => {
    if (searchQuery) {
      setSearchResults({ query: searchQuery, videos: null });
    }
  }, [searchQuery]);

  const handleSearch = async (query) => {
    try {
      setSearchResults({ query, videos: null });
      // Update URL with search query
      setSearchParams({ search: query });
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // Function to clear search
  const clearSearch = () => {
    setSearchResults(null);
    setSearchParams({}); // Clear search params from URL
  };

  return (
    <ThemeProvider>
      <div className="App">
        <Navbar setSidebar={setSidebar} onSearch={handleSearch} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                sidebar={sidebar}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                clearSearch={clearSearch}
              />
            }
          />
          <Route
            path="/video/:categoryId/:videoId"
            element={<Video searchQuery={searchQuery} />}
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
