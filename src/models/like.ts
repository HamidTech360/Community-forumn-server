import mongoose, { Types, Schema, models, model } from "mongoose";

const LikeSchema = new mongoose.Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {timestamps:true})

const Like = mongoose.model('Like', LikeSchema)
export default Like