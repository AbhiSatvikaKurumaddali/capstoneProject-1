import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";
export const adminApp = exp.Router();

//route for reading all users and authors
adminApp.get("/emails", verifyToken("ADMIN"), async (req, res) => {
  try {
    // FIXED: Use 'username' instead of 'firstName'
    const usersDetails = await UserModel.find(
      { role: "USER" },
      { email: 1, _id: 1, username: 1, isUserActive: 1 }  // Changed firstName to username
    );
    const authorsDetails = await UserModel.find(
      { role: "AUTHOR" },
      { email: 1, _id: 1, username: 1, isUserActive: 1 }  // Changed firstName to username
    );
    
    //send back response
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
    //get the details from the req body
    const { email, isUserActive } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (typeof isUserActive !== 'boolean') {
      return res.status(400).json({ message: "isUserActive must be a boolean" });
    }

    //check whether the user with that email exists in db
    const userDetails = await UserModel.findOne(
      { email: email },
      { email: 1, _id: 0, isUserActive: 1 }
    );

    if (!userDetails) {
      return res.status(404).json({ message: "User with that email does not exist" });
    }

    //check the user status and req body status
    //if they are same send res that it is already activated or blocked
    if (userDetails.isUserActive === isUserActive) {
      return res.status(400).json({ 
        message: `User is already ${isUserActive ? 'active' : 'blocked'}. No update needed` 
      });
    }

    //if they are not same update them
    await UserModel.findOneAndUpdate(
      { email: email },
      { isUserActive: isUserActive },
      { new: true }
    );

    res.status(200).json({ 
      message: `User ${isUserActive ? 'unblocked' : 'blocked'} successfully` 
    });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message 
    });
  }
});
