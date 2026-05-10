import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";  // ADD THIS
import commonAPI from "./API/commonAPI.js";
import userAPI from "./API/userAPI.js";
import authorAPI from "./API/authorAPI.js";
import adminAPI from "./API/adminAPI.js";

dotenv.config();
const app = express();

// ADD CORS CONFIGURATION (place this BEFORE your routes)
app.use(cors({
  origin: [
    'https://blogappp-80k9.onrender.com',  // Your frontend URL
    'http://localhost:5173',  // Vite default port
    'http://localhost:3000',  // Alternative local port
    'http://localhost:5000'   // Your backend port
  ],
  credentials: true
}));

app.use(express.json());

// ADD A ROOT ROUTE (to fix 404 when visiting the backend URL)
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

// ADD A HEALTH CHECK ENDPOINT (good for Render monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Your existing routes
app.use("/common-api", commonAPI);
app.use("/user-api", userAPI);
app.use("/author-api", authorAPI);
app.use("/admin-api", adminAPI);

// MongoDB connection with better error handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
