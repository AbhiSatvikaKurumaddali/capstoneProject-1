import exp from "express";
import { config } from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userApp } from "./API/UserAPI.js";
import { adminApp } from "./API/AdminAPI.js";
import { authorApp } from "./API/AuthorAPI.js";
import { commonApp } from "./API/CommonAPI.js";

config();

const app = exp();

app.use(exp.json());
app.use(cookieParser());

app.use(
  cors({
    origin: ["https://blogappp-80k9.onrender.com"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use("/user-api", userApp);
app.use("/admin-api", adminApp);
app.use("/author-api", authorApp);
app.use("/common-api", commonApp);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

connect(process.env.DB_URL)
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.log("DB error:", err);
  });
