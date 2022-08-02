import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Feed from "../models/Feed";
import Notification from "../models/notification";

export const saveFeed = expressAsyncHandler(async (req: any, res: any) => {
  const { post, group } = req.body;
  try {
    const feed = await Feed.create({
      post,
      author: req.user?._id,
      group,
    });

    const notification = await Notification.create({
      content:`${req.user?.firstName} ${req.user?.lastName} posted an item in the feed`,
      forItem:'feed',
      itemId:feed._id,
      author:req.user?._id,
      targetedAudience:[...req.user?.followers]
    })


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
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await Feed.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);

    const feed = await Feed.find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage)
      .populate("author", "firstName lastName avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName avatar" },
        },
      });
    res.json({
      status: "success",
      message: "Feed retrieved",
      feed,
      count,
      numPages,
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
      .populate("group")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName avatar" },
        },
      });
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
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await Feed.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    const posts = await Feed.find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      group: groupId,
    })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage)
      .populate("author", "firstName lastName avatar")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName avatar" },
        },
      });
    res.json({
      status: "success",
      message: "Group feed retrieved",
      posts,
      count,
      numPages,
    });
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
      const perPage = Number(req.query.perPage) || 25;
      const page = Number(req.query.page) || 0;
      const count = await Feed.find().estimatedDocumentCount();
      const numPages = Math.ceil(count / perPage);

      const posts = await Feed.find({
        group: { $ne: null },
      })
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(page * perPage)
        .populate("author", "firstName lastName avatar")
        .populate({
          path: "comments",
          populate: { path: "author", select: "firstName lastName avatar" },
        })
        .populate({
          path: "comments",
          populate: {
            path: "replies",
            populate: { path: "author", select: "firstName lastName avatar" },
          },
        });
      res.json({
        status: "success",
        message: "Group feed retrieved",
        posts,
        count,
        numPages,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
