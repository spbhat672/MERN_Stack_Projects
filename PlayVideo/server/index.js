const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// API endpoint for file upload
app.post("/upload", upload.single("video"), (req, res) => {
  res.json({ message: "File uploaded successfully" });
});

// Serve uploaded videos
app.use("/videos", express.static("uploads"));

app.get("/video/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "uploads", filename);
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Get the requested range from the headers
    const range = req.headers.range;
    const fileSize = fs.statSync(filePath).size;

    // Parse the range header
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    // Create a readable stream from the video file
    const stream = fs.createReadStream(filePath, { start, end });
    // Set the appropriate headers for video streaming
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });
    // Pipe the video stream to the response object
    stream.pipe(res);
  } else {
    // Return a 404 error if the file does not exist
    res.status(404).json({ error: "File not found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
