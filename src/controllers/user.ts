import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import fs from 'fs'

//@route: ./api/users
//@method: GET
//@access: public

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

//@route: ./api/users/:id
//@method: GET
//@access public

export const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User
          .findById(req.params.id)
          .populate('followers')
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export const updateUser = asyncHandler(
  async (req:any, res)=>{
    console.log(req.file);
    if(req.file){
      const fileType = req.file.mimetype.split("/")[1]
      const rename = `${req.file.filename}.${fileType}`
      fs.rename(`./uploads/${req.file.filename}`, `./uploads/${rename}`, function(){
        //res.send('uploaded successfully')
        //response.imgUploaded = true
      })

    }
    
     //return
    try{
      const user = await User.findByIdAndUpdate(req.params.id,{
        ...req.body
      })

      res.json({
          status:'success',
          message:'User updated'
      })
    }catch(error){
      res.status(500).send(error)
    }
  }
)
