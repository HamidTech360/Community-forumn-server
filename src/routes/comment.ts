import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from "../controllers/comment";
const router = Router();

router.post("/:type/:id", loggedIn, controller.comment);

export default router;
