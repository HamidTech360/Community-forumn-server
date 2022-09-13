import { Request, Response } from "express";
import Notification from "../models/notification";
import expressAsyncHandler from "express-async-handler";
import Gist from "../models/Gist";
import { File } from "../types";
//import {validateGist} from '../validators/gist'

export const createGist = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    try {
      const { title, post, country, categories, mentions } = req.body;
      // const error = validateGist(req.body)
      // if(error) {
      //     res.status(400).json(error.details[0].message)
      //     return
      // 
      const mentionArray = mentions.split(',')
      const gist = await Gist.create({
        title,
        post,
        country,
        categories,
        author: req?.user?._id,
        mentions:[...mentionArray],
        media: (req?.files as [File])?.map((file: File) => file.location),
      });

      console.log(req.body, req.files)

      const notification = await Notification.create({
        content: `${req.user?.firstName} ${req.user?.lastName} started a gist`,
        forItem: "gist",
        itemId: gist._id,
        author: req.user?._id,
        targetedAudience: [...req.user?.followers],
      });

      if(mentionArray.length > 0){
        const notification = await Notification.create({
          content: `You were tagged on a gist`,
          forItem: "gist",
          itemId: gist._id,
          author: req.user?._id,
          targetedAudience: [...mentionArray],
        });
      }
      res.status(201).json({ message: "Gist created", gist });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: "Something went wrong" });
    }
  }
);

export const fetchAllGist = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const perPage = Number(req.query.perPage) || 25;
      const page = Number(req.query.page) || 0;
      const count = await Gist.find().estimatedDocumentCount();
      const numPages = Math.ceil(count / perPage);
      const category = req.query.category;

      const gists = await Gist.find(
        category
          ? { categories: category }
          : {
              $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            }
      )
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(page * perPage)
        .populate("author", "firstName lastName images")
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

      res.json({
        status: "success",
        message: "Gists retrieved",
        gists,
        count,
        numPages,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: "Something went wrong" });
    }
  }
);

export const fetchSingleGist = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const gistID = req.params.id;

    try {
      const gist = await Gist.findById(gistID)
        .where({
          $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        })
        .populate("author", "firstName lastName images")
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

      res.json({
        status: "success",
        message: "Gist fetched",
        gist,
      });
    } catch (error) {
      res.status(500).json({ error: error, message: "Something went wrong" });
    }
  }
);

export const deleteGist = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const gistID = req.params.id;
    try {
      //find gist with gistID and delete
      const gist = await Gist.findById(gistID)
        .where({
          $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        })
        .catch((error) => console.log(error));
      if (gist && gist.author.toString() === req?.user?._id.toString()) {
        gist.deleted = true;
        await gist.save();
        res.status(200).json({ msg: "Gist deleted" });
      } else {
        res.status(404).json({ msg: "Gist not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error, message: "Something went wrong" });
    }
  }
);

export const updateGist = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const gistID = req.params.id;
    const gist = await Gist.findById(gistID).where({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (gist && gist.author.toString() === req?.user?._id.toString()) {
      const gistKeys = Object.keys(req.body);
      for (let i = 0; i < gistKeys.length; i++) {
        if (gistKeys[i] !== "media") {
          (gist as Record<string, any>)[gistKeys[i]] = req.body[gistKeys[i]];
        } else {
          gist.media = (req.files as [File])?.map(
            (file: File) => file.location
          );
        }
      }
      const updatedGist = await gist.save();
      res.status(200).json(updatedGist);
    } else {
      res.status(404).json({ msg: "Gist not found" });
    }
  }
);
