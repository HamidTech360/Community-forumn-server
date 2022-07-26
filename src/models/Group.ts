import mongoose, { Document, model, models, Schema, Types } from "mongoose";

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
    privacy: {
      type: String,
      required: true,
    },
    invite: {
      type: String,
      required: true,
      enum: ["admin", "everyone", "moderators"],
    },
    allowedToPost: {
      type: String,
      required: true,
    },
    groupMembers: {
      type: [mongoose.SchemaTypes.ObjectId],
      default: [],
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Group = models.Group || model("Group", groupSchema);

export default Group;
