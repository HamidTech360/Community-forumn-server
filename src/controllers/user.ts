import asyncHandler from "express-async-handler";
import User from "../models/User";

//@route: ./api/users
//@method: GET
//@access: admin

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//@route: ./api/users/:id
//@method: GET
//@access: admin

export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});
