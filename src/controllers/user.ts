import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";

//@route: /api/users
//@method: GET
//@access: public

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await User.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage);

    res.status(200).json({ users, count, numPages });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//@route: ./api/users/:id
//@method: GET
//@access public

export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("followers");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const updateUser = asyncHandler(async (req: any, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    res.json({
      status: "success",
      message: "User updated",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const followUser = asyncHandler(
  async (req: Request & { user?: { _id?: string } }, res: Response) => {
    try {
      const me = await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { following: [req.params.id] },
      });
      const them = await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: [req.params.id] },
      });

      res.status(200).json({ me, them });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);
