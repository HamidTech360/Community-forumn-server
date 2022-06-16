import mongoose, { model, Schema } from "mongoose";

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  moderators: {
    type: [],
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
});

const Group = model("group", groupSchema);

export default Group;
