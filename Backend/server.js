import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import commonAPI from "./API/commonAPI.js";
import userAPI from "./API/userAPI.js";
import authorAPI from "./API/authorAPI.js";
import adminAPI from "./API/adminAPI.js";

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'https://blogappp-80k9.onrender.com',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5000'
  ],
  credentials: true
}));

app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'BlogApp API is running',
    status: 'active',
    endpoints: {
      common: '/common-api',
      user: '/user-api',
      author: '/author-api',
      admin: '/admin-api'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test endpoint to verify userAPI is loaded
app.get('/test-user-api', (req, res) => {
  res.json({ message: "userAPI is available at /user-api" });
});

// Your routes
app.use("/common-api", commonAPI);
app.use("/user-api", userAPI);
app.use("/author-api", authorAPI);
app.use("/admin-api", adminAPI);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
