import express from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userApp } from "./API/userAPI.js";
import { adminApp } from "./API/adminAPI.js";
import { authorApp } from "./API/authorAPI.js";
import { commonApp } from "./API/commonAPI.js";

config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://blogappp-80k9.onrender.com",
      "https://blogapp-00eh.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// Routes
app.use("/user-api", userApp);
app.use("/admin-api", adminApp);
app.use("/author-api", authorApp);
app.use("/common-api", commonApp);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Database connection and server startup
connect(process.env.MONGODB_URI)
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Database connected successfully");
    });
  })
  .catch((err) => {
    console.log("DB error:", err);
    process.exit(1);
  });
