import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from "../controllers/like";

const router = Router();
router.get(`/`, loggedIn, controller.saveLike);
router.delete(`/`, loggedIn, controller.unlike);
export default router;
