const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config()

const app = express();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Create multer instance
const upload = multer({ storage });

// Define upload route
app.post('/upload', upload.single('file'), (req, res) => {
  // Upload file to Cloudinary
  cloudinary.uploader.upload(req.file.path, (error, result) => {
    if (error) {
      console.error('Upload failed:', error);
      res.status(500).send('Upload failed');
    } else {
      console.log('Upload successful:', result);
      res.status(200).json({ url: result.secure_url });
    }
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
