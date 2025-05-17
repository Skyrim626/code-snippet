import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Middleware for error handling
import errorHandler from "./middleware/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import snippetRoutes from "./routes/snippetRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";

dotenv.config();

const app = express();

// Middleware to enable CORS
// app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount routers
// Version 1 API
app.use("/v1/api/auth", authRoutes);
app.use("/v1/api/snippets", snippetRoutes);
app.use("/v1/api/tags", tagRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"));
  });
}

// Middleware to serve static files from the "uploads" directory
const server = app.listen(process.env.PORT, (e) => {
  connectDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server and exit process
  server.close(() => process.exit(1));
});
