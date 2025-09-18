import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_KEY } from "../../data";

// Recommended Component
const Recommended = ({ categoryId, videoId, searchQuery }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendedVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      let url;

      // If we have a search query, fetch videos related to the search
      if (searchQuery) {
        url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${encodeURIComponent(
          searchQuery
        )}&type=video&key=${API_KEY}`;
      } else {
        // Otherwise, fetch videos from the same category
        url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=15&videoCategoryId=${categoryId}&key=${API_KEY}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message || "YouTube API error");
      }

      // For search results, we need to get video details
      if (searchQuery && data.items) {
        // Extract video IDs from search results, excluding the current video
        const videoIds = data.items
          .filter((item) => item.id.videoId !== videoId)
          .map((item) => item.id.videoId)
          .join(",");

        if (videoIds) {
          // Fetch details for these videos
          const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsResult = await detailsResponse.json();

          setVideos(detailsResult.items || []);
        } else {
          setVideos([]);
        }
      } else {
        // For category-based recommendations, filter out the current video
        setVideos(data.items.filter((video) => video.id !== videoId) || []);
      }
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
      setError("Failed to load recommendations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedVideos();
  }, [categoryId, videoId, searchQuery]);

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
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 w-40 h-24 rounded-lg"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
        {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        No recommendations available.
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {searchQuery
          ? `Videos related to "${searchQuery}"`
          : "Recommended Videos"}
      </h3>
      <div className="space-y-3">
        {videos.map((video) => (
          <Link
            to={`/video/${video.snippet.categoryId}/${video.id}`}
            className="flex group"
            key={video.id}
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-40 h-24 object-cover rounded-lg"
            />
            <div className="ml-3 flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                {video.snippet.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {video.snippet.channelTitle}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatViewCount(video.statistics?.viewCount)} views •{" "}
                {formatDate(video.snippet.publishedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Recommended;
