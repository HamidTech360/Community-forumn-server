import express from "express";
import * as controller from "../controllers/user";
import { loggedIn } from "../middleware/auth";
const router = express.Router();

router.get("/", controller.getUsers);

router.get("/:id", controller.getUser);
router.get("/:id/follow", loggedIn, controller.follow);
export default router;
