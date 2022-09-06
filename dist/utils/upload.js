"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileType = void 0;
const path_1 = __importDefault(require("path"));
function checkFileType(file, cb) {
    console.log(file);
    const fileTypes = /jpeg|jpg|png|gif|pdf|docx|doc|webp|mp4|mp3|3gp|mpeg|mov/;
    const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb("File type not supported");
    }
}
exports.checkFileType = checkFileType;
