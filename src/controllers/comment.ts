//@Route /api/posts/:id/comment,
///@Method: Post

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Comment from "../models/Comment";
import Gist from "../models/Gist";
import Post from "../models/Post";

//@Route: /api/comments/:type/:id
//@Access: LoggedIn
export const comment = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const type = req.params.typel;
    const comment = await Comment.create({
      author: req.user?._id,
      ...req.body,
    });

    if (type == "post") {
      await Post.findByIdAndUpdate(req.params.id, {
        $addToSet: { comments: [comment._id] },
      });
    } else if (type == "gist") {
      await Gist.findByIdAndUpdate(req.params.id, {
        $addToSet: { comments: [comment._id] },
      });
    }
    res.status(200).json(comment);
  }
);
