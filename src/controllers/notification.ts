import { json } from "express";
import expressAsyncHandler from "express-async-handler";
import Notification from "../models/Notification";

export const fetchUserNotifications = expressAsyncHandler(
  async (req: any, res: any) => {
    try {
      const perPage = Number(req.query.perPage) || 25;
      const page = Number(req.query.page) || 0;
      const count = await Notification.countDocuments({
        targetedAudience: {
          $in: req.user?._id,
        },
      });
      const numPages = Math.ceil(count / perPage);

      const response = await Notification.find({
        targetedAudience: {
          $in: req.user?._id,
        },
      }).sort({ createdAt: -1 });

      const notifications = response.filter(
        (item) => item.author.toString() !== req.user?._id.toString()
      );

      res.json({
        message: "notifications fetched",
        notifications,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const MarkAsRead = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const markAsRead = await Notification.findByIdAndUpdate(req.query.id, {
      read: true,
    });
    res.json({
      meessage: "Notification mark as read",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
