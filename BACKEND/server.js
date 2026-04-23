import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { commonApp } from "./APIs/CommonAPI.js"; // import your CommonAPI routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// mount APIs
app.use("/api", commonApp);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
