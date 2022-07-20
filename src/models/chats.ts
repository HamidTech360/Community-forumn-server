import { Types, Schema, models, model } from "mongoose";

const chatSchema = new Schema({
    conversationId:{
        type:String,
        required:true,
    },
    sender:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    receiver:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    message:{
        type:String,
        required:true
    }
}, {timestamps:true})
const Chat = models.Chat || model("Chat", chatSchema);

export default Chat;