//@Route /api/posts/:id/comment,
///@Method: Post

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Comment from "../models/Comment";
import Gist from "../models/Gist";
import Post from "../models/Post";
import Feed from "../models/Feed";
import Notification from "../models/notification";
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
       itemAuthor = await Post.findById(req.query.id)
    } else if (type == "gist") {
      await Gist.findByIdAndUpdate(req.query.id, {
        $addToSet: { comments: [comment._id] },
      });
       itemAuthor = await Gist.findById(req.query.id)
    } else if (type == "feed") {
      await Feed.findByIdAndUpdate(req.query.id, {
        $addToSet: { comments: [comment._id] },
      });
       itemAuthor = await Post.findById(req.query.id)
    } else if (type == "reply") {
      console.log("replying");
      const reply = await Comment.findByIdAndUpdate(req.query.id, {
        $addToSet: { replies: [comment._id] },
      });
      console.log(reply);

    }
    
    const notification = await Notification.create({
      content:`${req.user?.firstName} ${req.user?.lastName} commented on a ${type} you created`,
      forItem:'comment',
      itemId:comment._id,
      author:req.user?._id,
      targetedAudience:[itemAuthor.author]
    })
    res
      .status(200)
      .json(await comment.populate("author", "firstName lastName avatar"));
  }
);
