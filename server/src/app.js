import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

import coursesRouter from "./routes/courses.routes.js";
import authRouter from "./routes/auth.routes.js";
import uploadRouter from "./routes/upload.routes.js"; // <— baru

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

// Serve file upload secara statis
app.use("/uploads", express.static("uploads"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/upload", uploadRouter);

// 404
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 400;
  res.status(status).json({ message: err.message || "Bad Request" });
});

export default app;