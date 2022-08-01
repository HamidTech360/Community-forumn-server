import expressAsyncHandler from "express-async-handler";
import Gist from "../models/Gist";
import Post from "../models/Post";
import Feed from "../models/Feed";
import Notification from '../models/notification'
import Comment from "../models/Comment";

export const saveLike = expressAsyncHandler(async (req: any, res: any) => {
  const { id, type } = req.query;
  //console.log(`the post to be liked has the Id ${id}`);
  let itemAuthor;
  try {
    if (type == "post") {
      await Post.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      itemAuthor = await Post.findById(req.query.id)
      
    } else if (type == "gist") {
      await Gist.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      itemAuthor = await Gist.findById(req.query.id)
    } else if (type == "feed") {
      await Feed.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });  
      itemAuthor = await Feed.findById(req.query.id)

     
      res.status(200).json("Liked");
    } else if (type == "comment") {
      await Comment.findByIdAndUpdate(id, {
        $addToSet: { likes: req.user?._id },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Liked");
    }
    const notification = await Notification.create({
      content:`${req.user?.firstName} ${req.user?.lastName} liked your post `,
      forItem:'like',
      itemId:req.user._id,
      author:req.user?._id,
      targetedAudience:[itemAuthor.author]
    })

    res.status(200).json("Liked");

  } catch (error) {
    res.status(500).send(error);
  }
});
