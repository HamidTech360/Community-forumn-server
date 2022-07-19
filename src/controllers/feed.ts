import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Feed from "../models/Feed";

export const saveFeed = expressAsyncHandler(async (req: any, res: any) => {
  const { post, group } = req.body;
  try {
    const feed = await Feed.create({
      post,
      author: req.user?._id,
      group,
    });
    res.json({
      status: "success",
      message: "Feed created",
      feed,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const fetchFeeds = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const feeds = await Feed.find()
      .sort({ createdAt: -1 })
      .limit(25)
      .populate("author");
    res.json({
      status: "success",
      message: "Feeds fetched",
      feeds,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const fetchFeed = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const feed = await Feed.findById(id)
      .populate("author", "firstName lastName avatar")
      .populate("group");
    res.status(200).json(feed);
  }
);

//@Routes /api/posts/group/:id
//Method get
//@ccess: loggedIn
export const getGroupFeed = expressAsyncHandler(async (req: any, res: any) => {
  const groupId = req.params.id;
  console.log(groupId);

  try {
    const posts = await Feed.find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      group: groupId,
    })
      .sort({ createdAt: -1 })
      .populate("group", "name")
      .populate("author", "-password")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
      });
    res.status(200).json({ msg: " Group Posts retrieved", posts });
  } catch (error) {
    res.status(500).json(error);
  }
});

//@Routes /api/posts/group/:id
//Method get
//@ccess: loggedIn
export const getRandomGroupFeed = expressAsyncHandler(
  async (req: any, res: any) => {
    try {
      const posts = await Feed.find({
        group: { $ne: null },
      })
        .sort({ createdAt: -1 })
        .limit(20)
        .populate("group", "name")
        .populate("author", "-password")
        .populate({
          path: "comments",
          populate: { path: "author", select: "firstName lastName avatar" },
        });
      res.status(200).json({ msg: "Random group posts retrieved", posts });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
