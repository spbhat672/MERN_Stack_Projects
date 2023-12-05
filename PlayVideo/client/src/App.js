import "./App.css";
import React, { useState, useRef } from "react";
import axios from "axios";
import ReactPlayer from "react-player";

function App() {
  const [video, setVideo] = useState({
    name: "human_feeding_the_little_squirrel (Original).mp4",
  });
  const [uploadMessage, setUploadMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("video", video);

      var x = await axios.post("http://localhost:3001/upload", formData);
      debugger;
      setUploadMessage("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error.message);
      setUploadMessage("Error uploading file");
    }
  };

  const handleForward = () => {
    const newTime = currentTime + 10; // Forward by 10 seconds
    setCurrentTime(newTime);
    playerRef.current.seekTo(newTime, "seconds");
  };

  const handleRewind = () => {
    const newTime = currentTime - 10; // Rewind by 10 seconds
    setCurrentTime(newTime < 0 ? 0 : newTime);
    playerRef.current.seekTo(newTime < 0 ? 0 : newTime, "seconds");
  };

  return (
    <div>
      <h1>Video Upload App</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Video</button>
      {uploadMessage && <p>{uploadMessage}</p>}
      {video && (
        <div>
          <h2>Uploaded Video</h2>
          <ReactPlayer
            ref={playerRef}
            url={`http://localhost:3001/video/${video.name}`}
            controls
            onProgress={(state) => setCurrentTime(state.playedSeconds)}
          />
          <div>
            <p>Current Time: {Math.round(currentTime)} seconds</p>
            <button onClick={handleForward}>Forward 10s</button>
            <button onClick={handleRewind}>Rewind 10s</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
