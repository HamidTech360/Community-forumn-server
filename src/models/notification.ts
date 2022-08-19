import { Types, Schema, models, model } from "mongoose";

const notificationSchema = new Schema({
    content:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    forItem:{
        type:String,
        required:true
    },
    itemId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    targetedAudience:{
        type: [Schema.Types.ObjectId],
        ref:"User"
    },
    read:{
        type:Boolean
    }
}, {timestamps:true})

 const Notification =  models.notification || model('notification', notificationSchema)
 
 export default Notification