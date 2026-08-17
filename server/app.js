import { config } from "dotenv";
config();
import express from "express";
import cookie_parser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/UserRoutes.js";
import CourseRoutes from "./routes/CourseRoute.js";
import miscRoutes from "./routes/miselleneousRoute.js";
import file_upload from "express-fileupload";
import paymentRoute from "./routes/paymentRoutes.js";
import askAiRoutes from "./routes/askAiRoutes.js";
import path from "path";
import cors from 'cors'
const app = express();
const __dirname = path.resolve();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5015'].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(morgan("dev"));

app.use(
  file_upload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    // Cloudinary's Free plan tops out at 100 MB per video; stop anything wildly
    // over that at the door instead of buffering it to disk first.
    limits: { fileSize: 150 * 1024 * 1024 },
    abortOnLimit: true,
    limitHandler: (req, res) => {
      res.status(413).json({
        success: false,
        message: "File is too large. The limit is 100 MB.",
      });
    },
  })
);

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", CourseRoutes);
app.use("/api/v1", miscRoutes);
app.use("/api/v1/payments", paymentRoute);
app.use("/api/v1", askAiRoutes);

// Serve static files from the React app

// Ping route for testing
app.use("/ping", (req, res) => {
  res.send("hello world");
});

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// 404 route (should be after other routes)
app.all("*", (req, res) => {
  res.status(404).send("OOPS 404 Page not Found");
});

export default app;
