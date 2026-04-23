commonApp.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;
  try {
    let allowedRoles = ["USER", "AUTHOR"];
    const newUser = req.body;

    if (!allowedRoles.includes(newUser.role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    newUser.profileImageUrl = cloudinaryResult?.secure_url;
    newUser.password = await hash(newUser.password, 12);

    const newUserDoc = new UserModel(newUser);
    await newUserDoc.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.log("err is ", err);
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }
    next(err);
  }
});
