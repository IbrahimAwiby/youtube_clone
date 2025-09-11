import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { useEffect, useState } from "react";
import { API_KEY } from "../../data";

const PlayVideo = ({ videoId, categoryId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format view count
  const formatViewCount = (count) => {
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

  if (loading) {
    return <div className="play-video">Loading video...</div>;
  }

  if (!apiData) {
    return <div className="play-video">Video not found</div>;
  }

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title={apiData.snippet.title}
      ></iframe>
      <h3>{apiData.snippet.title}</h3>
      <div className="play-video-info">
        <p>
          {formatViewCount(apiData.statistics.viewCount)} Views •{" "}
          {formatDate(apiData.snippet.publishedAt)}
        </p>
        <div>
          <span>
            <img src={like} alt="" />{" "}
            {formatViewCount(apiData.statistics.likeCount)}
          </span>
          <span>
            <img src={dislike} alt="" />
          </span>
          <span>
            <img src={share} alt="" /> Share
          </span>
          <span>
            <img src={save} alt="" /> Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || jack}
          alt=""
        />
        <div>
          <p>{apiData.snippet.channelTitle}</p>
          <span>
            {formatViewCount(channelData?.statistics?.subscriberCount || 0)}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData.snippet.description}</p>
        <hr />
        <h4>{apiData.statistics.commentCount} Comments</h4>

        {commentData.map((comment) => (
          <div className="comment" key={comment.id}>
            <img
              src={
                comment.snippet.topLevelComment.snippet.authorProfileImageUrl ||
                user_profile
              }
              alt=""
            />
            <div>
              <h3>
                {comment.snippet.topLevelComment.snippet.authorDisplayName}
                <span>
                  {" "}
                  {formatDate(
                    comment.snippet.topLevelComment.snippet.publishedAt
                  )}
                </span>
              </h3>
              <p>{comment.snippet.topLevelComment.snippet.textDisplay}</p>
              <div className="comment-action">
                <img src={like} alt="" />
                <span>
                  {formatViewCount(
                    comment.snippet.topLevelComment.snippet.likeCount
                  )}
                </span>
                <img src={dislike} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
