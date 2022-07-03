"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gistSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
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
    comments: [],
}, { timestamps: true });
const Gist = mongoose_1.default.model("Gist", gistSchema);
exports.default = Gist;
