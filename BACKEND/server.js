import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { commonApp } from "./APIs/CommonAPI.js"; // import your CommonAPI routes

dotenv.config();


import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Add this line for frontend-backend connection
app.use(cors({
  origin: "https://blogappp-80k9.onrender.com" // replace with your actual Render frontend URL
}));

// middleware

// connect to MongoDB

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB server connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};


// mount APIs
app.use("/api", commonApp);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
