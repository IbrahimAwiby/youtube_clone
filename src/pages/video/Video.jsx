import { useParams } from "react-router-dom";
import PlayVideo from "../../components/PlayVideo/PlayVideo";
import Recommended from "../../components/Recommended/Recommended";
import "./Video.css";

const Video = ({ searchQuery }) => {
  const { videoId, categoryId } = useParams();
  return (
    <div className="play-container">
      <div className="video-player-container">
        <PlayVideo videoId={videoId} categoryId={categoryId} />
      </div>
      <div className="recommended-container">
        <Recommended
          categoryId={categoryId}
          videoId={videoId}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  );
};

export default Video;