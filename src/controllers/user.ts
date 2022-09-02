import { raw, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ObjectId } from "mongoose";
import User from "../models/User";
import Post from "../models/Post";
import Notification from "../models/notification";
import expressAsyncHandler from "express-async-handler";
import users from "../data/users";

//@route: /api/users
//@method: GET
//@access: public

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await User.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage);

    res.status(200).json({ users, count, numPages });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//@route: ./api/users/:id
//@method: GET
//@access public

export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "followers following",
      "firstName lastName images"
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const updateUser = asyncHandler(async (req: any, res) => {
  console.log(req.file?.location);
  
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,

      {
        ...req.body,
        ...(req.file?.location && {images:req.query.imageType=="cover"?
         {
          cover: req.file.location || req.user?.images?.cover,
          avatar:req.user?.images?.avatar
        }:{
          avatar: req.file.location || req.user?.images?.avatar,
          cover:req.user?.images?.cover
        }
      })
      },

      { new: true }
    );

    res.json({
      status: "success",
      message: "User updated",
      user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const followUser = asyncHandler(
  async (
    req: Request & {
      user?: { _id?: string; firstName?: string; lastName?: string };
    },
    res: Response
  ) => {
    try {
      const me = await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { following: [req.params.id] },
      });
      const them = await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: [req.user?._id] },
      });
      const itemAuthor = await User.findById(req.params.id);
      const notification = await Notification.create({
        content: `${req.user?.firstName} ${req.user?.lastName} followed you `,
        forItem: "follow",
        itemId: req.user?._id,
        author: req.user?._id,
        targetedAudience: [itemAuthor._id],
      });

      res.status(200).json("followed");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const usersToFollow = asyncHandler(
  async (
    req: Request & {
      user?: { _id?: string; firstName?: string; lastName?: string };
    },
    res: Response
  ) => {
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await User.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    try {
      const users = await User.find({
        followers: {
          $nin: req.user?._id,
        },
      }).limit(25);
      res.json({
        message: "suggested connections fetched",
        connections: users,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const unFollowUser = asyncHandler(
  async (
    req: Request & {
      user?: { _id?: string; firstName?: string; lastName?: string };
    },
    res: Response
  ) => {
    try {
      const me = await User.findByIdAndUpdate(
        req.user?._id as unknown as ObjectId,
        {
          $pull: { following: { $in: [req.params.id as unknown as ObjectId] } },
        }
      );
      const them = await User.findByIdAndUpdate(
        req.params.id as unknown as ObjectId,
        {
          $pull: { followers: { $in: [req.params.id as unknown as ObjectId] } },
        }
      );

      const itemAuthor = await User.findById(req.params.id);
      const notification = await Notification.create({
        content: `${req.user?.firstName} ${req.user?.lastName} Unfollowed you `,
        forItem: "follow",
        itemId: req.user?._id,
        author: req.user?._id,
        targetedAudience: [itemAuthor._id],
      });

      res.status(200).json("unfollowed");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const addNotificationPreference = asyncHandler(
  async (req: any, res: Response) => {
    const { option } = req.body;
    console.log(option, req.params.id);

    try {
      const response = await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { notificationOptions: option },
      });
      res.json({
        message: "preference updated",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const removeNotificationPreference = asyncHandler(
  async (req: any, res: Response) => {
    const { option } = req.body;
    try {
      const response = await User.findByIdAndUpdate(req.user?._id, {
        $pull: { notificationOptions: option },
      });
      res.json({
        message: "preference removed",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const getUnfollowedUsers = asyncHandler(
  async (req: any, res: Response) => {
    try {
      const users = await User.find({
        followers: {
          $nin: req.user?._id,
        },
      })
      for (var i = users.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = users[i];
        users[i] = users[j];
        users[j] = temp;
      }
      const limitedUsers = users.splice(0, 20)
      res.json({
        message: ` ${limitedUsers.length} suggested connections fetched`,
        connections: limitedUsers,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const getTopWriters = asyncHandler(async (req: any, res: Response) => {
  let frequency = {};
  let topWriters = [];
  try {
    let posts = await Post.find()
    .populate(
      "author",
      "firstName lastName images followers following"
    );

    posts = posts.filter(item=>!item.author?.followers?.includes(req.user?._id))

    for (var i in posts) {
      //@ts-ignore
      frequency[posts[i].author._id] =
        //@ts-ignore
        (frequency[posts[i].author._id] || 0) + 1;
    }
    const sortedFrequency = Object.entries(frequency)
      //@ts-ignore
      .sort(([, a], [, b]) => b - a)
      .reduce(
        (obj, [k, v]) => ({
          ...obj,
          [k]: v,
        }),
        {}
      );

    for (let key in sortedFrequency) {
      const user = posts.find((item) => item.author._id.toString() === key);
      //@ts-ignore
      topWriters.push(user?.author);
    }
    //console.log( sortedFrequency, topWriters);
    res.json({
      message: "top writers fetched",
      users: topWriters,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
