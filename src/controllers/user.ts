import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { ObjectId } from "mongoose";
import User from "../models/User";
import Notification from "../models/notification";
import expressAsyncHandler from "express-async-handler";

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
    const user = await User.findById(req.params.id).populate("followers");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const updateUser = asyncHandler(async (req: any, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    res.json({
      status: "success",
      message: "User updated",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const followUser = asyncHandler(
  async (req: Request & { user?: { _id?: string, firstName?:string, lastName?:string } }, res: Response) => {
   
    try {
      const me = await User.findByIdAndUpdate(req.user?._id, {
        $addToSet: { following: [req.params.id] },
      });
      const them = await User.findByIdAndUpdate(req.params.id, {
        $addToSet: { followers: [req.user?._id] },
        
      });
      const itemAuthor = await User.findById(req.params.id)
      const notification = await Notification.create({
        content:`${req.user?.firstName} ${req.user?.lastName} followed you `,
        forItem:'follow',
        itemId:req.user?._id,
        author:req.user?._id,
        targetedAudience:[itemAuthor._id]
      })

  
      res.status(200).json("followed");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export const unFollowUser = asyncHandler(
  async (req: Request & { user?: { _id?: string, firstName?:string, lastName?:string  } }, res: Response) => {
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

      const itemAuthor = await User.findById(req.params.id)
      const notification = await Notification.create({
        content:`${req.user?.firstName} ${req.user?.lastName} Unfollowed you `,
        forItem:'follow',
        itemId:req.user?._id,
        author:req.user?._id,
        targetedAudience:[itemAuthor._id]
      })

      res.status(200).json("unfollowed");
    } catch (error) {
      res.status(500).send(error);
    }
  }
);


export const addNotificationPreference = asyncHandler(
  async (req:any, res:Response)=>{
    const {option} = req.body
    console.log(option, req.params.id);
    
    try{
        const response = await User.findByIdAndUpdate(req.user?._id, {
          $addToSet:{notificationOptions:option}
        })
        res.json({
          message:'preference updated'
        })
    }catch(error){
      res.status(500).send(error);
    }
  }
)

export const removeNotificationPreference = asyncHandler(
  async (req:any, res:Response)=>{
    const {option} = req.body
    try{
      const response = await User.findByIdAndUpdate(req.user?._id, {
        $pull:{notificationOptions:option}
      })
      res.json({
        message:'preference removed'
      })
    }catch(error){
      res.status(500).send(error);
    }
  }
)