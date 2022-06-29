import mongoose, { Schema, SchemaTypes, Types } from "mongoose";

export interface IPost extends mongoose.Document {
  author: Types.ObjectId;
  postTitle: string;
  postBody: string;
  comments?: [Types.ObjectId];
  deleted?: boolean;
  likes?: [Types.ObjectId];
}

const postSchema = new mongoose.Schema<IPost>(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    postTitle: {
      type: String,
      required: true,
    },
    postBody: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
