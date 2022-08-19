import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from "../controllers/comment";
const router = Router();

router.post("/", loggedIn, controller.comment);
router
  .route("/:id")
  .put(loggedIn, controller.editComment)
  .delete(loggedIn, controller.deleteComment);
export default router;
