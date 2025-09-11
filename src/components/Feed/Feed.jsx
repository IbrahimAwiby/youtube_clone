import "./Feed.css";
import { Link, useSearchParams } from "react-router-dom";
import { API_KEY } from "../../data";
import { useEffect, useState } from "react";

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
    return <div className="feed">Loading videos...</div>;
  }

  if (error) {
    return <div className="feed error">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="feed">No videos found.</div>;
  }

  return (
    <div className="feed">
      {data.map((item) => (
        <Link
          to={{
            pathname: `/video/${item.snippet.categoryId}/${item.id}`,
            search: isSearch
              ? `?search=${encodeURIComponent(searchQuery)}`
              : "",
          }}
          className="card"
          key={item.id}
        >
          <img
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
          />
          <h2>{item.snippet.title}</h2>
          <h3>{item.snippet.channelTitle}</h3>
          <p>
            {formatViewCount(item.statistics?.viewCount)} views •{" "}
            {formatDate(item.snippet.publishedAt)}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Feed;
