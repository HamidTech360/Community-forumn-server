import mongoose, { Types,Schema, SchemaTypes } from "mongoose";

export interface IGistSchema extends mongoose.Document {
  author: Types.ObjectId;
  title: string;
  country: string;
  comments: [];
  categories: string;
  post: string;
  deleted: boolean;
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
    }
  },
  { timestamps: true }
);

const Gist = mongoose.model("Gist", gistSchema);

export default Gist;
