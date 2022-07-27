import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chats";

export const fetchMessages = expressAsyncHandler(
    async (req:any, res:any)=>{
        try{
            const messages = await Chat.find({
                $or:[{conversationId:`${req.user?._id}-${req.query.mate}`},{conversationId:`${req.query.mate}-${req.user?._id}`} ]
            }).populate("sender receiver")

            res.json({
                message:'Messages fetched',
                messages
            })
        }catch(error){
            res.status(500).send(error)
        }
    }
)

export const saveMessage = expressAsyncHandler(
    async (req:any, res:any)=>{
        const { message} = req.body
        console.log('in the chat');
        console.log(req.body, req.query);
        
        try{
            const newMessage = await Chat.create({
                sender:req.user?._id,
                receiver:req.query.mate,
                conversationId:`${req.user?._id}-${req.query.mate}`,
                message
            })
            res.json({
                message:'Message saved',
                newMessage
            })
        }catch(error){
            res.status(500).send(error)
        }
    }
)

export const fetchConversation = expressAsyncHandler(
    async (req:any, res:any)=>{
        let discussions:any= []
        try{
            const chats = await Chat.find().sort({createdAt:-1}).populate("sender receiver")
           
            
            chats.forEach((item)=>{
               const members = item.conversationId.split("-")
               const members_c = [members[1], members[0]]
              // console.log(members, req.user?._id.valueOf(), members.indexOf(req.user?._id));
               
           
                if(members.includes( req.user?._id.valueOf())){
                    const findSimilar = discussions.find((item:any)=>item.members.toString()==members.toString())
                    const findSimilar_c = discussions.find((item:any)=>item.members.toString()==members_c.toString())
                    console.log(findSimilar);
                    
                    if(!findSimilar && !findSimilar_c){
                        discussions.push({...item._doc, members})
                    }
                    
                    // if(discussions.members!==members){
                    //     discussions.push({...item._doc, members})
                    // }
                    
                }
              
            })

            res.json({
                message:"Conversations fetched",
                conversations:discussions
            })
        }catch(error){
            res.status(500).send(error)
        }
    }
)