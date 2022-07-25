import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Gist from "../models/Gist";
import Group from "../models/Group";
import Post from "../models/Post";
import User from "../models/User";

//@Route /api/search
//@ Desc search
//@Access Public
export const search = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { keyword, type } = req.query;
      const queries = {
        user: await User.find({
          $or: [
            { firstName: { $regex: keyword, $options: "i" } },
            { lastName: { $regex: keyword, $options: "i" } },
          ],
        }),
        post: await Post.find({
          $or: [
            { postTitle: { $regex: keyword, $options: "i" } },
            { postBody: { $regex: keyword, $options: "i" } },
          ],
        }),
        gist: await Gist.find({
          $or: [
            { title: { $regex: keyword, $options: "i" } },
            { post: { $regex: keyword, $options: "i" } },
            { categories: { $regex: keyword, $options: "i" } },
          ],
        }),
        group: await Group.find({
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { description: { $regex: keyword, $options: "i" } },
          ],
        }),
      };

      //@ts-ignore
      const response = queries[type];
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      res.status(500).json("Something went wrong");
    }
  }
);
