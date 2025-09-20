import { useEffect, useState } from "react";
import { useSearchParams, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ThemeProvider from "./components/ThemeProvider";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home/Home";
import Video from "./pages/video/Video";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import "react-toastify/dist/ReactToastify.css";

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
          <Route
            path="/signin"
            element={
              <ProtectedRoute needAuth={false}>
                <SignIn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute needAuth={false}>
                <SignUp />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
