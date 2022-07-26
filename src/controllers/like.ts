import expressAsyncHandler from "express-async-handler";
import Gist from "../models/Gist";
import Post from "../models/Post";
import Feed from "../models/feed";
import Comment from "../models/Comment";

export const saveLike = expressAsyncHandler(async (req: any, res: any) => {
  const { id, type } = req.query;
  console.log(`the post to be liked has the Id ${id}`);

  try {
    if (type == "post") {
      await Post.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Liked");
    } else if (type == "gist") {
      await Gist.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Liked");
    } else if (type == "feed") {
      await Feed.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Liked");
    } else if (type == "comment") {
      await Comment.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Liked");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
