import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Feed from "../models/feed";

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
