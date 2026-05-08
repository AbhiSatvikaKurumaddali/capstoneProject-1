import exp from "express";
import { hash, compare } from "bcryptjs";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const { sign } = jwt;

export const commonApp = exp.Router();

commonApp.post("/users", async (req, res) => {
  try {
    const newUser = req.body;

    let allowedRoles = ["USER", "AUTHOR"];
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!newUser.email || !newUser.password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    newUser.password = await hash(newUser.password, 12);

    const newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User Created" });
  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({
      message: "Server error during registration",
      error: err.message
    });
  }
});
commonApp.post("/login", async (req, res) => {
  console.log("login route hit");
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid email" });
  }

  const isMatched = await compare(password, user.password);

  if (!isMatched) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const signedToken = sign(
    { id: user._id, email: email, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.cookie("token", signedToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none"
  });

  const userObj = user.toObject();
  delete userObj.password;

  res.status(200).json({
    message: "login successfull",
    payload: userObj
  });
});

commonApp.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path:"/"
  });

  res.status(200).json({ message: "Logout success" });
});

commonApp.put(
  "/password",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {
    const clientPasswords = req.body;

    if (clientPasswords.currentPassword === clientPasswords.newPassword) {
      return res
        .status(400)
        .json({ message: "current password and new password are same" });
    }

    const id = req.user?.id;

    const currentUser = await UserModel.findById(id);

    const status = await compare(
      clientPasswords.currentPassword,
      currentUser.password
    );

    if (!status) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const hashedPassword = await hash(clientPasswords.newPassword, 12);

    await UserModel.findByIdAndUpdate(
      { _id: id },
      { password: hashedPassword },
      { new: true }
    );

    res.status(200).json({ message: "password updated" });
  }
);

commonApp.get("/check-auth", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token"
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    res.status(200).json({
      message: "Authenticated",
      payload: decoded
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
});
