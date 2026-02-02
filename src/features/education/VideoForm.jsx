import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';

const VideoForm = ({ onSave, onDelete }) => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const videoData = { title, youtubeLink };

    try {
      if (selectedVideo) {
        await axios.put(`${config.API_BASE_URL}/videos/${selectedVideo._id}`, videoData);
      } else {
        await axios.post(`${config.API_BASE_URL}/videos`, videoData);
      }
      onSave();
      fetchVideos();
      resetForm();
    } catch (error) {
      console.error('Failed to save video', error);
    }
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setTitle(video.title);
    setYoutubeLink(video.youtubeLink);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${config.API_BASE_URL}/videos/${id}`);
      onDelete(id);
      fetchVideos();
      resetForm();
    } catch (error) {
      console.error('Failed to delete video', error);
    }
  };

  const resetForm = () => {
    setSelectedVideo(null);
    setTitle('');
    setYoutubeLink('');
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">YouTube Link</label>
          <input
            type="url"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
          {selectedVideo ? 'Update' : 'Add'} Video
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">Saved Videos</h2>
      <ul className="space-y-4">
        {videos.map((video) => (
          <li key={video._id} className="border p-4 rounded">
            <h3 className="font-bold">{video.title}</h3>
            <p className="text-sm text-gray-600">{video.youtubeLink}</p>
            <div className="mt-2">
              <button
                onClick={() => handleEdit(video)}
                className="text-blue-500 hover:underline mr-2"
              >
                Edit
                </button>
              <button
                onClick={() => handleDelete(video._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoForm;