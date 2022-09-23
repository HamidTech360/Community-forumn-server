"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const upload_1 = require("../utils/upload");
const client_s3_1 = require("@aws-sdk/client-s3");
console.log(process.env.BUCKET);
const s3 = new client_s3_1.S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY,
    },
});
const storage = (0, multer_s3_1.default)({
    //@ts-ignore
    s3: s3,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    bucket: process.env.BUCKET,
    key: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter: function (req, file, cb) {
        (0, upload_1.checkFileType)(file, cb);
    },
});
