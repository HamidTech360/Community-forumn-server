import mongoose, { Document, model, Schema, Types } from "mongoose";

interface IGroup extends Document {
  name: string;
  description: string;
  moderators: [Types.ObjectId];
  admin: Types.ObjectId;
  deleted: boolean;
}
const groupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    moderators: {
      type: [mongoose.SchemaTypes.ObjectId],
    },
    admin: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Group = model("group", groupSchema);

export default Group;
