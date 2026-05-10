import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";
export const adminApp = exp.Router();

//route for reading all users and authors
adminApp.get("/emails", verifyToken("ADMIN"), async (req, res) => {
  try {
    // Use firstName and lastName (not username)
    const usersDetails = await UserModel.find(
      { role: "USER" },
      { email: 1, _id: 1, firstName: 1, lastName: 1, isUserActive: 1 }  // Keep firstName, lastName
    );
    const authorsDetails = await UserModel.find(
      { role: "AUTHOR" },
      { email: 1, _id: 1, firstName: 1, lastName: 1, isUserActive: 1 }  // Keep firstName, lastName
    );
    
    res.status(200).json({
      message: "Users and Authors",
      USERS: usersDetails,
      AUTHORS: authorsDetails,
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});

//route to activate or block users or authors
adminApp.put("/userStatus", verifyToken("ADMIN"), async (req, res) => {
  try {
    const { email, isUserActive } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const userDetails = await UserModel.findOne(
      { email: email },
      { email: 1, _id: 0, isUserActive: 1 }
    );

    if (!userDetails) {
      return res.status(404).json({ message: "User with that email does not exist" });
    }

    if (userDetails.isUserActive === isUserActive) {
      return res.status(400).json({ 
        message: `User is already ${isUserActive ? 'active' : 'blocked'}` 
      });
    }

    await UserModel.findOneAndUpdate(
      { email: email },
      { isUserActive: isUserActive },
      { new: true }
    );

    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});
