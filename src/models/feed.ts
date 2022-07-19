import mongoose, { Schema, SchemaTypes, models } from "mongoose";

const feedSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    group: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Group",
    },
    post: {
      type: String,
      required: true,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    likes:{
        type:[Schema.Types.ObjectId],
        ref:"User"
    }
}, {timestamps:true})

const Feed = models.Feed || mongoose.model("Feed", feedSchema);
export default Feed;
