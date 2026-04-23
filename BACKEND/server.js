import exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import { userApp } from "./APIs/UserAPI.js";
import { authorApp } from "./APIs/AuthorAPI.js";
import { adminApp } from "./APIs/AdminAPI.js";
import { commonApp } from "./APIs/CommonAPI.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config();

//create express app
const app = exp();

// Enable CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

//add cookie parser middleware
app.use(cookieParser())

//body parser middleware
app.use(exp.json());

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(exp.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
  });
}

//path level middlewares
app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

//connect to db
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB server connected");
    //assign port
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`server listening on ${port}..`));
  } catch (err) {
    console.log("err in db connect", err);
  }
};

connectDB();

//to handle invalid path
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("error is ", err);
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});
