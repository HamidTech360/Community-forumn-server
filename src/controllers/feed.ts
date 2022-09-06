import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Feed from "../models/Feed";
import Notification from "../models/notification";
import { File } from "../types";

export const saveFeed = expressAsyncHandler(async (req: any, res: any) => {
  const { post, group } = req.body;

  try {
    const feed = await Feed.create({
      post,
      author: req.user?._id,
      group,
      media: req.files?.map((file: File) => file.location),
    });

    const notification = await Notification.create({
      content: `${req.user?.firstName} ${req.user?.lastName} posted an item in the feed`,
      forItem: "feed",
      itemId: feed._id,
      author: req.user?._id,
      targetedAudience: [...req.user?.followers],
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

export const fetchUserFeed = expressAsyncHandler(
  async (req: Request & { user?: { _id: string } }, res: Response) => {
    try {
      const perPage = Number(req.query.perPage) || 25;
      const page = Number(req.query.page) || 0;
      const count = await Feed.countDocuments({
        $and: [
          { author: req.query.userId || req.user?._id },
          { $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }] },
        ],
      });
      const numPages = Math.ceil(count / perPage);

      const feed = await Feed.find({
        $and: [
          { author: req.query.userId || req.user?._id },
          { $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }] },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(page * perPage)
        .populate("author", "firstName lastName images")
        .populate({
          path: "comments",
          populate: { path: "author", select: "firstName lastName images" },
        })
        .populate("likes", "firstName lastName")
        .populate({
          path: "comments",
          populate: {
            path: "replies",
            populate: { path: "author", select: "firstName lastName images" },
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
  }
);
export const fetchFeeds = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await Feed.countDocuments({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    const numPages = Math.ceil(count / perPage);

    const feed = await Feed.find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage)
      .populate("author", "firstName lastName images")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName images" },
      })
      .populate("likes", "firstName lastName")
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName images" },
          options: { sort: { createdAt: -1 } },
        },
        options: { sort: { createdAt: -1 } },
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
      .populate("author", "firstName lastName images")
      .populate("group")
      .populate("likes", "firstName lastName")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName images" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName images" },
          options: { sort: { createdAt: -1 } },
        },
        options: { sort: { createdAt: -1 } },
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
    const count = await Feed.countDocuments({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    const numPages = Math.ceil(count / perPage);
    const posts = await Feed.find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      group: groupId,
    })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage)
      .populate("author", "firstName lastName avatar")
      .populate("likes", "firstName lastName")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName avatar" },
          options: { sort: { createdAt: -1 } },
        },
        options: { sort: { createdAt: -1 } },
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
      const count = await Feed.countDocuments({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      const numPages = Math.ceil(count / perPage);

      const posts = await Feed.find({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        group: { $ne: null },
      })
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(page * perPage)
        .populate("author", "firstName lastName avatar")
        .populate("likes", "firstName lastName")
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
            options: { sort: { createdAt: -1 } },
          },
          options: { sort: { createdAt: -1 } },
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

//@Route /api/feed/:id
//@Method Put
//@Access: LoggedIn
export const updateFeed = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const feedId = req.params.id;
    const feed = await Feed.findById(feedId).where({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (feed && feed.author.toString() === req?.user?._id.toString()) {
      const feedKeys = Object.keys(req.body);
      for (let i = 0; i < feedKeys.length; i++) {
        if (feedKeys[i] !== "media") {
          feed[feedKeys[i]] = req.body[feedKeys[i]];
        } else {
          feed.media = (req.files as [File])?.map(
            (file: File) => file.location
          );
        }
      }
      const updatedFeed = await feed.save();
      res.status(200).json(updatedFeed);
    } else {
      res.status(404).json({ msg: "Feed not found" });
    }
  }
);
export const deleteFeed = expressAsyncHandler(
  async (req: any, res: Response) => {
    const id = req.query.id;
    try {
      await Feed.findByIdAndUpdate(id, { deleted: true });
      res.json({
        message: "Feed deleted",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
