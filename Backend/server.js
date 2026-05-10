import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import commonAPI from "./API/commonAPI.js";
import userAPI from "./API/userAPI.js";
import authorAPI from "./API/authorAPI.js";
import adminAPI from "./API/adminAPI.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/common-api", commonAPI);
app.use("/user-api", userAPI);
app.use("/author-api", authorAPI);
app.use("/admin-api", adminAPI);

app.listen(process.env.PORT || 5000, () => console.log("Server running"));
