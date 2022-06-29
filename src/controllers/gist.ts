import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";
import Gist from "../models/Gist";
//import {validateGist} from '../validators/gist'

export const createGist = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    try {
      const { title, post, country, categories } = req.body;
      // const error = validateGist(req.body)
      // if(error) {
      //     res.status(400).json(error.details[0].message)
      //     return
      // }
      const gist = await Gist.create({
        title,
        post,
        country,
        categories,
        user: req?.user?._id,
      });
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
      const gists = await Gist.find()
        .sort({ createdAt: -1 })
        .populate("author", "-password");
      res.status(200).json(gists);
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
        .populate("author", "-password");
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
        gist.deleted === true;
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
        (gist as Record<string, any>)[gistKeys[i]] = req.body[gistKeys[i]];
      }
      const updatedGist = await gist.save();
      res.status(200).json(updatedGist);
    } else {
      res.status(404).json({ msg: "Gist not found" });
    }
  }
);
