import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";

//@route: ./api/users
//@method: GET
//@access: public

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
//@access public

export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//@route: ./api/users/:id/follow
//@Method: GET
//@Access: LoggedIn
export const follow = asyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    try {
      const me = await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { following: [req.params.id] },
      })
        .then((user) => console.log(user))
        .catch((err) => console.log(err));
      console.log(req.params.id);
      const them = await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: [req.user!.id] },
      })
        .then((user) => console.log(user))
        .catch((err) => console.log(err));

      res.status(200).json({ msg: "Followed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json("Something went wrong");
    }
  }
);
