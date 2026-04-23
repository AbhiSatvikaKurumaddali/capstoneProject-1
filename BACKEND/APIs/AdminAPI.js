import exp from "express";
import { UserModel } from "../models/UserModel.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

export const adminApp = exp.Router();

// GET all users & authors
adminApp.get("/users", verifyToken("ADMIN"), async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $in: ["USER", "AUTHOR"] } });
    res.status(200).json({ message: "users", payload: users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// BLOCK / UNBLOCK user
adminApp.patch("/user-status", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { userId, isUserActive } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isUserActive },
      { new: true }
    );

    res.status(200).json({
      message: isUserActive ? "User unblocked" : "User blocked",
      payload: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user status" });
  }
});
