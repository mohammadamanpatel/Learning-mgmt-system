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
import path from "path";
import cors from 'cors'
const app = express();
const __dirname = path.resolve();
// console.log("__dirname", __dirname);
// app.use(
//   cors({
//     origin: ['https://learning-mgmt-system.onrender.com', process.env.FRONTEND_URL],
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(morgan("dev"));

app.use(
  file_upload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// API routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", CourseRoutes);
app.use("/api/v1", miscRoutes);
app.use("/api/v1/payments", paymentRoute);

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
