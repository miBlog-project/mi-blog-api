import express from 'express';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Function to serve all static files
// inside public directory.
app.use(express.static("public")); 
app.use("/uploads", express.static("uploads"));

// For uploading image files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;

  if (file) {
    res.status(200).json(file.filename);
  } else {
    res.status(200).json("");
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);


app.listen(8000, () => {
  console.log("Listening on port 8000");
});