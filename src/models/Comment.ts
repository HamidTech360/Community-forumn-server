import { Types, Schema, models, model, SchemaTypes } from "mongoose";

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: [SchemaTypes.ObjectId],
      ref: "User",
    },
    replies: {
      type: [SchemaTypes.ObjectId],
      ref: "Comment",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
