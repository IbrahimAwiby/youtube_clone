import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_KEY } from "../../data";

// Feed Component
const Feed = ({ category, searchQuery, isSearch }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let url;

      if (isSearch && searchQuery) {
        // Search API
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=${encodeURIComponent(
          searchQuery
        )}&type=video&key=${API_KEY}`;
      } else {
        // Category API
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US&maxResults=50&videoCategoryId=${category}&key=${API_KEY}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // For search results, we need to get video details
      if (isSearch && result.items) {
        // Extract video IDs from search results
        const videoIds = result.items.map((item) => item.id.videoId).join(",");

        // Fetch details for these videos
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsResult = await detailsResponse.json();

        setData(detailsResult.items || []);
      } else {
        setData(result.items || []);
      }
    } catch (error) {
      setError("Failed to fetch videos. Please try again later.");
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category, searchQuery, isSearch]);

  // Format view count
  const formatViewCount = (count) => {
    if (!count) return "0";
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "K";
    }
    return count;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
          >
            <div className="bg-gray-300 dark:bg-gray-600 h-40"></div>
            <div className="p-3">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 dark:text-red-400 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400 text-center">
          No videos found.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {data.map((item) => (
        <Link
          to={{
            pathname: `/video/${item.snippet.categoryId}/${item.id}`,
            search: isSearch
              ? `?search=${encodeURIComponent(searchQuery)}`
              : "",
          }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
          key={item.id}
        >
          <img
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-3">
            <h2 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
              {item.snippet.title}
            </h2>
            <h3 className="text-sm text-gray-600 dark:text-gray-300 mb-1">
              {item.snippet.channelTitle}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatViewCount(item.statistics?.viewCount)} views •{" "}
              {formatDate(item.snippet.publishedAt)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
