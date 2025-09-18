import { useEffect, useState } from "react";
import { API_KEY } from "../../data";

// PlayVideo Component
const PlayVideo = ({ videoId, categoryId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // fetch video data
  const fetchVideoData = async () => {
    try {
      const video_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`;
      const response = await fetch(video_url);
      const data = await response.json();
      setApiData(data.items[0]);

      if (data.items[0]) {
        fetchChannelData(data.items[0].snippet.channelId);
        fetchComments();
      }
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };

  // fetch channel data
  const fetchChannelData = async (channelId) => {
    try {
      const channel_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`;
      const response = await fetch(channel_url);
      const data = await response.json();
      setChannelData(data.items[0]);
    } catch (error) {
      console.error("Error fetching channel:", error);
    }
  };

  // fetch comment data
  const fetchComments = async () => {
    try {
      const comment_url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${API_KEY}`;
      const response = await fetch(comment_url);
      const data = await response.json();
      setCommentData(data.items || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchVideoData();
  }, [videoId]);

  const [showFullDescription, setShowFullDescription] = useState(false);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-96 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="flex space-x-4 mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md text-center">
        <p className="text-red-500 dark:text-red-400">Video not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-md">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-96"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          title={apiData.snippet.title}
        ></iframe>
      </div>

      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {apiData.snippet.title}
        </h3>

        <div className="flex flex-wrap items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatViewCount(apiData.statistics.viewCount)} Views •{" "}
            {formatDate(apiData.snippet.publishedAt)}
          </p>

          <div className="flex items-center space-x-4 mt-2">
            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                ></path>
              </svg>
              <span>{formatViewCount(apiData.statistics.likeCount)}</span>
            </button>

            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                ></path>
              </svg>
            </button>

            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
              <span>Share</span>
            </button>

            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                ></path>
              </svg>
              <span>Save</span>
            </button>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700 mb-4" />

        <div className="flex items-start space-x-3 mb-6">
          <img
            src={
              channelData?.snippet?.thumbnails?.default?.url ||
              "/default-avatar.png"
            }
            alt="Channel"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {apiData.snippet.channelTitle}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatViewCount(channelData?.statistics?.subscriberCount || 0)}{" "}
              Subscribers
            </p>
          </div>
          <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700">
            Subscribe
          </button>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
          <p
            className={`text-gray-900 dark:text-white whitespace-pre-line ${
              showFullDescription ? "" : "line-clamp-3"
            }`}
          >
            {apiData.snippet.description}
          </p>
          {apiData.snippet.description &&
            apiData.snippet.description.split("\n").length > 3 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mt-2 focus:outline-none"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            )}
        </div>

        <hr className="border-gray-200 dark:border-gray-700 mb-4" />

        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {apiData.statistics.commentCount} Comments
        </h4>

        {commentData.map((comment) => (
          <div className="flex items-start space-x-3 mb-4" key={comment.id}>
            <img
              src={
                comment.snippet.topLevelComment.snippet.authorProfileImageUrl ||
                "/default-avatar.png"
              }
              alt="Commenter"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {comment.snippet.topLevelComment.snippet.authorDisplayName}
                <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                  {formatDate(
                    comment.snippet.topLevelComment.snippet.publishedAt
                  )}
                </span>
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {comment.snippet.topLevelComment.snippet.textDisplay}
              </p>
              <div className="flex items-center space-x-3 mt-1">
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    ></path>
                  </svg>
                  <span className="text-xs">
                    {formatViewCount(
                      comment.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                </button>
                <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                    ></path>
                  </svg>
                </button>
                <button className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
