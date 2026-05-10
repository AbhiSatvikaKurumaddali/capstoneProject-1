import exp from "express";
import { hash, compare } from "bcryptjs";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const { sign } = jwt;

export const commonApp = exp.Router();

commonApp.post("/login", async (req, res) => {
  console.log("Login route hit");
  console.log("Request body:", req.body); 
  
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatched = await compare(password, user.password);

    if (!isMatched) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

   
    const signedToken = sign(
      { id: user._id, email: email, role: user.role },
      process.env.JWT_SECRET,  // Changed from SECRET_KEY
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
      message: "Login successful",
      payload: userObj
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error during login",
      error: err.message 
    });
  }
});

// LOGOUT 
commonApp.get("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/"
  });

  res.status(200).json({ message: "Logout success" });
});

// CHECK AUTH 
commonApp.get("/check-auth", (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token found"
      });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      message: "Authenticated",
      payload: decoded
    });
  } catch (err) {
    console.error("Check auth error:", err);
    res.status(401).json({
      message: "Invalid or expired token"
    });
  }
});

// Password update 
commonApp.put(
  "/password",
  verifyToken("USER", "AUTHOR", "ADMIN"),
  async (req, res) => {
    try {
      const clientPasswords = req.body;

      if (clientPasswords.currentPassword === clientPasswords.newPassword) {
        return res
          .status(400)
          .json({ message: "Current password and new password are the same" });
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

      res.status(200).json({ message: "Password updated" });
    } catch (err) {
      console.error("Password update error:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  }
);
