import expressAsyncHandler from "express-async-handler";
import User from "../models/User";

export const AddToBookMark = expressAsyncHandler(
    async (req:any, res:any)=>{
        const {id} = req.query
        console.log(id, req.user?._id);
        
        try{
            await User.findByIdAndUpdate(req.user?._id, {
                $addToSet:{
                    bookmarks:id
                }
            })
            res.json({
                message:'Post bookmarked'
            })
        }catch(error){
            res.status(500).send(error)
        }
    }
)

export const RemoveFromBookmark = expressAsyncHandler(
    async (req:any, res:any)=>{
        const {id}= req.query
        try{
            await User.findByIdAndUpdate(req.user?._id, {
                $pull:{bookmarks:id}
            })
            res.json({
                message:'Post removed from bookmarks'
            })
        }catch(error){
            res.status(500).send(error)
        }
    }
)

export const getBookMarks = expressAsyncHandler(
    async (req:any, res:any)=>{
        try{
            const posts =  await User.findById(req.user._id)
                                .select({bookmarks:1})
                                .populate('bookmarks')
                                
            res.json({
                message:'Bookmarks fetched',
                posts
            })
        }catch(error){
            res.status(500).send(error)
        }
    }
)