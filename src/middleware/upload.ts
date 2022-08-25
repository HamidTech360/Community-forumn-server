import express, { NextFunction, Response, Request } from "express";
import path from "path";
import multer, { FileFilterCallback } from "multer";

import multerS3 from "multer-s3";
import { checkFileType } from "../utils/upload";
import { S3Client } from "@aws-sdk/client-s3";
console.log(process.env.BUCKET);

type FileNameCallback = (error: Error | null, filename: string) => void;
export type RequestWithFile = Request & {
  file?: Express.Multer.File & { location: string };
};

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_KEY!,
  },
});
const storage = multerS3({
  //@ts-ignore
  s3: s3,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  bucket: process.env.BUCKET!,
  key: (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

export const upload = multer({
  storage,
  fileFilter: function (
    req: Express.Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) {
    checkFileType(file, cb);
  },
});
