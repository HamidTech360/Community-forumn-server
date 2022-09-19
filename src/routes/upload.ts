import { Request, Response, Router } from "express";
import { loggedIn } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();
export type RequestWithFile = Request & {
  file?: Express.Multer.File & { location?: string };
};
router.post(
  "/",
  loggedIn,
  upload.single("image"),
  (req: RequestWithFile, res: Response) => {
    res.json(req.file?.location);
  }
);

export default router;
