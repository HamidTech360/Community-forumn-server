import path from "path";
export function checkFileType(file: Express.Multer.File, cb: any) {
  console.log(file);
  const fileTypes = /jpeg|jpg|png|pdf|docx|doc|webp/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Images Only!");
  }
}
