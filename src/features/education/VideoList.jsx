import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/videos`);
      setVideos(response.data);
    } catch (error) {
      console.error('Failed to fetch videos', error);
    }
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="p-4 flex h-screen">
      {/* Video List */}
      <div className="w-1/3 border-r pr-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Learn</h2>
        <ul>
          {videos.map((video) => (
            <li
              key={video._id}
              className="cursor-pointer mb-2 p-2 border rounded hover:bg-gray-200"
              onClick={() => handleVideoClick(video)}
            >
              {video.title}
            </li>
          ))}
        </ul>
      </div>
      {/* Video Player */}
      <div className="w-2/3 pl-4 flex flex-col">
        {selectedVideo ? (
          <div className="flex-grow flex flex-col">
            <h3 className="text-xl font-bold mb-2">{selectedVideo.title}</h3>
            <div className="flex-grow relative">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeLink.split('v=')[1]}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={selectedVideo.title}
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div>
        ) : (
          <p className="text-center mt-10">Select a video to view</p>
        )}
      </div>
    </div>
  );
};

export default VideoList;