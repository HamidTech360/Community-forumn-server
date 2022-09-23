//@Route /api/groups
//Method: Post
//@Access: loggedIn

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Group from "../models/Group";
import User from "../models/User";
import Notification from "../models/Notification";
import Feed from "../models/Feed";
import { File } from "../types";

export const createGroup = expressAsyncHandler(
  async (req: any & { user?: Record<string, any> }, res) => {
    const { name, description, privacy, invite, allowedToPost, groupMembers } =
      req.body;

    console.log(req?.file?.location);

    const group = await Group.create({
      admin: req?.user?._id,
      moderators: [req.user?._id],
      description,
      name,
      invite,
      privacy,
      allowedToPost,
      groupMembers: [req.user?._id, ...groupMembers],
      ...(req.ile?.location && {
        images: {
          avatar: req.file?.location,
        },
      }),
    });

    res.status(201).json({ group });
  }
);

// @Route /api/groups/:id
// @Method: Get
// @Access: public

export const getGroup = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId).populate(
      "admin groupMembers",
      "firstName lastName images"
    );
    res.status(200).json(group);
  }
);

// @Route /api/groups/:id
// @Method: Put
// @Access: Private (Group admin/moderator)
export const updateGroup = expressAsyncHandler(
  async (req: any, res: Response) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);

    console.log(req.file?.location);

    const updatedGroup = await Group.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.file?.location && {
          images:
            req.query.imageType == "cover"
              ? {
                  avatar: group.images?.avatar,
                  cover: req.file?.location || group.images?.cover,
                }
              : {
                  avatar: req.file?.location || group.images?.avatar,
                  cover: group.images?.cover,
                },
        }),
      },
      { new: true }
    );
    res.status(200).json(updatedGroup);
  }
);

// @Route /api/groups/:id
// @Method: Delete
// @Access: Private (Group admin/moderator)
export const deleteGroup = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);

    if (group.admin.toString() === req?.user?._id.toString()) {
      group.deleted = true;
      const updated = await group.save();
      res.status(200).json(updated);
    } else {
      res.status(403).json("Unauthorised");
    }
  }
);

// @Route /api/groups/
// @Method: Get
// @Access: Public
export const getGroups = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const groups = await Group.find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    }).populate("admin", "-password");
    res.status(200).json(groups);
  }
);

export const getUserGroups = expressAsyncHandler(
  async (req: any, res: Response) => {
    const userId = req.user?._id;
    //console.log('User is a member of', req.user?._id);
    try {
      const groups = await Group.find({
        groupMembers: {
          $in: userId,
        },
      })
        .sort({ createdAt: -1 })
        .populate("admin", "firstNam lastName images");

      console.log(groups);

      res.json({
        status: "success",
        message: "User groups retrieved",
        groups,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const joinGroup = expressAsyncHandler(
  async (req: any, res: Response) => {
    try {
      await Group.findByIdAndUpdate(req.params.id, {
        $addToSet: { groupMembers: req.user?._id },
      });
      res.json({
        message: "User joined group",
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const groupMedia = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      let videos: any[] = [];
      let images: any[] = [];
      const groupId = req.params.id;
      const posts = await Feed.find({
        // $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        group: groupId,
      }).select("media");

      posts.map((item) => {
        if (item.media.length > 0) {
          item.media.map((el: string) => {
            const splitName = el.split(".");
            const extension = splitName[splitName.length - 1];
            console.log(extension);
            if (extension == "mp4" || extension == "webm") {
              videos.push(el);
            } else {
              images.push(el);
            }
          });
        }
      });
      res.json({
        message: "Group media fetched",
        media: req.query.type == "image" ? images : videos,
      });
    } catch (error) {
      res.status(500).send({ message: "Server Error", error });
    }
  }
);

export const Invitations = expressAsyncHandler(
  async (req: any, res: Response) => {
    const id = req.params.id;
    const invites: any = [];
    //console.log('In here')
    try {
      const group = await Group.findById(id);
      const users = await User.find({
        $or: [
          {
            followers: {
              $in: req.user?._id,
            },
          },
          {
            following: {
              $in: req.user?._id,
            },
          },
        ],
      });

      users.map((item) => {
        if (!group.groupMembers?.includes(item._id)) {
          invites.push(item);
        }
      });

      //console.log(invites)

      res.json({
        message: "Invitations fetched",
        user: invites,
        sentInvites: group.sentInvites,
      });
    } catch (error) {
      res.status(500).send({ messge: "Server Error", error });
    }
  }
);

export const inviteToGroup = expressAsyncHandler(
  async (req: any, res: Response) => {
    const { userId, groupName, groupId } = req.body;
    try {
      const notification = await Notification.create({
        content: `${req.user?.firstName} ${req.user?.lastName} Invited you to join the group ${groupName}`,
        forItem: "invite",
        itemId: groupId,
        author: req.user?._id,
        targetedAudience: [userId],
      });

      await Group.findByIdAndUpdate(groupId, {
        $addToSet: { sentInvites: userId },
      });

      res.json({
        message: "Invitation sent",
      });
    } catch (error) {
      res.status(500).send({ messge: "Server Error", error });
    }
  }
);
