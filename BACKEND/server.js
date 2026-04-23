import express from "express";
import { uploadToCloudinary } from "../utils/cloudinary.js"; // adjust path if needed
import { hash } from "bcryptjs";
import cloudinary from "cloudinary";
import { UserModel } from "../models/User.js"; // adjust path if needed
import multer from "multer";

const commonApp = express();

// configure multer (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Route for register
commonApp.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    const allowedRoles = ["USER", "AUTHOR"];
    const newUser = req.body;

    // validate role
    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // upload image if provided
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
      newUser.profileImageUrl = cloudinaryResult?.secure_url;
    }

    // hash password
    newUser.password = await hash(newUser.password, 12);

    // create and save user
    const newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error("Error creating user:", err);

    // cleanup uploaded image if error occurs
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err);
  }
});

// export the app so server.js can import it
export { commonApp };
