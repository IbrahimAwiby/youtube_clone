import { useParams } from "react-router-dom";
import PlayVideo from "../../components/PlayVideo/PlayVideo";
import Recommended from "../../components/Recommended/Recommended";


// Video Component
const Video = ({ searchQuery }) => {
  const { videoId, categoryId } = useParams();
  return (
    <div className="pt-14 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-8/12">
            <PlayVideo videoId={videoId} categoryId={categoryId} />
          </div>
          <div className="w-full lg:w-4/12">
            <Recommended
              categoryId={categoryId}
              videoId={videoId}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
