import exp from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { UserModel } from "../models/UserModel.js";
export const adminApp = exp.Router();

//route for reading all users and authors
adminApp.get("/emails", verifyToken("ADMIN"), async (req, res) => {
  //get email from database of role users and authors
  const usersDetails = await UserModel.find(
    { role: "USER" },
    { email: 1, _id: 1, firstName: 1, isUserActive: 1 }, 
  );
  const authorsDetails = await UserModel.find(
    { role: "AUTHOR" },
    { email: 1, _id: 1, firstName: 1, isUserActive: 1 }, 
  );
  //send back response
  res
    .status(200)
    .json({
      message: "Users and Authors",
      USERS: usersDetails,
      AUTHORS: authorsDetails,
    });
});

//route to activate or block users or authors
adminApp.put("/userStatus", verifyToken("ADMIN"), async (req, res) => {
  //get the details from the req body
  const { email, isUserActive } = req.body;

  //check whether the user with that email exists in db
  const userDetails = await UserModel.findOne(
    { email: email },
    { email: 1, _id: 0, isUserActive: 1 },
  );

  if (!userDetails) {
    return res
      .status(404)
      .json({ message: "user with that email does not exist" });
  }

  //check the user status and req body status
  //if they are same send res that it is already activated or blocked
  if (userDetails.isUserActive === isUserActive) {
    return res
      .status(400)
      .json({ message: "Status of user is same.No need to update" });
  }

  //if they are not same update them
  await UserModel.findOneAndUpdate(
    { email: email },
    { isUserActive: isUserActive },
    { new: true },
  );

  res.status(200).json({ message: "Status is updated" });
});
