import mongoose, { Types, SchemaTypes } from "mongoose";

const feedSchema = new mongoose.Schema({
    author:{
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    post:{
        type:String,
        required:true
    },
    comments:{
        type:Array,
        default:[]
    },
    likes:{
        type:[mongoose.SchemaTypes.ObjectId],
        ref:"User"
    }
}, {timestamps:true})

const Feed = mongoose.model('feed', feedSchema)
export default Feed;

