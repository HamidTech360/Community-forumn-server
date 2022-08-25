import mongoose, { Types, Schema, SchemaTypes, models } from "mongoose";

export interface IGistSchema extends mongoose.Document {
  author: Types.ObjectId;
  title: string;
  country: string;
  comments: [];
  categories: string;
  post: string;
  deleted: boolean;
  media: [string];
}

const gistSchema = new mongoose.Schema<IGistSchema>(
  {
    author: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "Comment",
    },
    media: { type: [String] },
  },
  { timestamps: true }
);

const Gist = models.Gist || mongoose.model("Gist", gistSchema);

export default Gist;
