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
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    mentions: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    editorContent:{
      type: String
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    media: {
      type: [String],
    },

  },
  { timestamps: true }
);

const Feed = models.Feed || mongoose.model("Feed", feedSchema);
export default Feed;
