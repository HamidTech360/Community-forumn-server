import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/", loggedIn, upload.single("image"));

export default router;
