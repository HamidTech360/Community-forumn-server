//@Route /api/groups
//Method: Post
//@Access: loggedIn

import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Group from "../models/Group";

export const createGroup = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res) => {
    const { name, description, privacy,invite, allowedToPost, groupMembers } = req.body;

     console.log(req.body);
    
    const group = await Group.create({
      admin: req?.user?._id,
      moderators: [req.user?._id],
      description,
      name,
      invite,
      privacy,
      allowedToPost,
      groupMembers:[req.user?._id, ...groupMembers]
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

    const group = await Group.findById(groupId).populate("admin groupMembers", "firstName");
    res.status(200).json(group);
  }
);

// @Route /api/groups/:id
// @Method: Put
// @Access: Private (Group admin/moderator)
export const updateGroup = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const groupId = req.params.id;

    const group = await Group.findById(groupId);

    if (group.admin.toString() === req?.user?._id.toString()) {
      const groupKeys = Object.keys(req.body);
      for (let i = 0; i < groupKeys.length; i++) {
        group[groupKeys[i]] = req.body[groupKeys[i]];
      }
      const updatedGroup = await group.save();
      res.status(200).json(updatedGroup);
    } else {
      res.status(403).json("Unauthorised");
    }
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
    
    const userId = req.user?._id
    //console.log('User is a member of', req.user?._id);
    try{
      const groups = await Group.find({
        groupMembers:{
          "$in":userId
        }
      }).sort({createdAt:-1})
      .populate('admin')

      console.log(groups);
      

      res.json({
        status:'success',
        message:'User groups retrieved',
        groups
      })
    }catch(error){
      res.status(500).send(error)
    }
  }
);

export const joinGroup = expressAsyncHandler(
  async(req:any, res:Response)=>{
    try{
      await Group.findByIdAndUpdate(req.params.id, {
        $addToSet:{groupMembers:req.user?._id}
      })
      res.json({
        message:'User joined group'
      })
    }catch(error){
      res.status(500).send(error)
    }
  }
)
