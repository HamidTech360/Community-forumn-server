"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const feedSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        required: true,
        ref: "User",
    },
    content: {
        type: String,
        required: true,
    },
    comments: {
        type: [mongoose_1.default.SchemaTypes.ObjectId],
    },
    likes: {
        type: [mongoose_1.default.SchemaTypes.ObjectId],
        ref: "User",
    },
}, { timestamps: true });
const Feed = mongoose_1.default.model("feed", feedSchema);
exports.default = Feed;
