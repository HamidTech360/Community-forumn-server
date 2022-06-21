import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";
import Gist from '../models/Gist'
//import {validateGist} from '../validators/gist'

export const createGist = expressAsyncHandler(
    async (req:Request & { user?: Record<string, any> }, res:Response)=>{
        
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
)

export const fetchAllGist = expressAsyncHandler(
    async(req:Request, res:Response)=>{
        try{
            const gists = await Gist.find().sort({createdAt:-1});
            res.status(200).json(gists);
        }catch(error){
            console.log(error);
            res.status(500).json({ error: error, message: "Something went wrong" });
        }
    }
)

export const fetchSingleGist = expressAsyncHandler(
    async (req:Request, res:Response)=>{
        const gistID = req.params.id

        try{
            const gist= await Gist.findById(gistID)
            res.json({
             status:'success',
             message:'Gist fetched',
             gist
            })
           }catch(error){
             res.status(500).json({ error: error, message: "Something went wrong" });
           }
    }
)

export const deleteGist = expressAsyncHandler(
    async (req:Request, res:Response)=>{
        const gistID = req.params.id
        try {
            //find gist with gistID and delete
            await Gist.findByIdAndDelete(gistID).catch((error) => console.log(error));
      
            res.status(201).json({ message: "Gist deleted" });
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: error, message: "Something went wrong" });
          }
        
    }
)

export const updateGist = expressAsyncHandler(
    async (req:Request, res:Response)=>{
        const gistID = req.params.id
        try{
            // const {error} = validateGist(req.body)
            // if(error){
            //     res.status(400).send(error.details[0].message)
            // }
            const { title, post, country, categories } = req.body;
            //find gist with GistID and update
            await Gist.findByIdAndUpdate(gistID,{...req.body});
            res.status(200).json({ message: "Gist updated" });
        }catch(error){
            console.log(error);
            res.status(500).json({ error: error, message: "Something went wrong" });
        }
    }
)