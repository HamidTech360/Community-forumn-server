//@Route /api/posts/:id/comment,
///@Method: Post

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Comment from "../models/Comment";
import Gist from "../models/Gist";
import Post from "../models/Post";
import Feed from "../models/Feed";
import Notification from "../models/Notification";
//@Route: /api/comments/:type/:id
//@Access: LoggedIn
export const comment = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const type = req.query.type;
    const comment = await Comment.create({
      author: req.user?._id,
      ...req.body,
    });
    let itemAuthor;
    if (type == "post") {
      await Post.findByIdAndUpdate(req.query.id, {
        $addToSet: { comments: [comment._id] },
      });
      itemAuthor = await Post.findById(req.query.id);
    } else if (type == "gist") {
      await Gist.findByIdAndUpdate(req.query.id, {
        $addToSet: { comments: [comment._id] },
      });
      itemAuthor = await Gist.findById(req.query.id);
    } else if (type == "feed") {
      await Feed.findByIdAndUpdate(req.query.id, {
        $addToSet: { comments: [comment._id] },
      });
      itemAuthor = await Feed.findById(req.query.id);
    } else if (type == "reply") {
      console.log("replying");
      const reply = await Comment.findByIdAndUpdate(req.query.id, {
        $addToSet: { replies: [comment._id] },
      });
      //console.log(reply);
      itemAuthor = await Comment.findById(req.query.id);
    }

    const notification = await Notification.create({
      content: `${req.user?.firstName} ${req.user?.lastName} commented on a ${type} you created`,
      forItem: type,
      itemId: itemAuthor._id,
      author: req.user?._id,
      targetedAudience: [itemAuthor.author],
    });
    res
      .status(200)
      .json(await comment.populate("author", "firstName lastName images"));
  }
);

//@route /api/comments/:id
//@method PUT
//Access Private
export const editComment = expressAsyncHandler(
  async (req: Request & { user?: { _id: string } }, res: Response) => {
    try {
      const comment = await Comment.findById(req.params.id);
      if (comment && comment.author.toString() === req?.user?._id.toString()) {
        const commentKeys = Object.keys(req.body);
        for (let i = 0; i < commentKeys.length; i++) {
          comment[commentKeys[i]] = req.body[commentKeys[i]];
        }
        const updatedComment = await comment.save();
        res.status(200).json(updatedComment);
      } else {
        res.status(404).json({ msg: "Comment not found" });
      }
    } catch (error) {}
  }
);

//@route /api/comments/:id
//@method Delete
//Access Private
export const deleteComment = expressAsyncHandler(
  async (req: Request & { user?: { _id: string } }, res: Response) => {
    try {
      const comment = await Comment.findById(req.params.id).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });

      if (comment && comment.author.toString() === req?.user?._id.toString()) {
        comment.deleted = true;
        await comment.save();
        res.status(200).json({ msg: "comment deleted" });
      } else {
        res.status(404).json({ msg: "comment not found" });
      }
    } catch (error) {}
  }
);
