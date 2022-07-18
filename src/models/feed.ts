import mongoose, { Types, Schema, SchemaTypes } from "mongoose";

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
    likes: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

const Feed = mongoose.model("feed", feedSchema);
export default Feed;
