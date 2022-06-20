import { Router } from "express";
import * as controller from "../controllers/post";
import { loggedIn } from "../middleware/auth";
const router = Router();

router
  .route("/")
  .get(controller.getPosts)
  .post(loggedIn, controller.createPost);

router
  .route("/:id")
  .get(controller.getPost)
  .delete(loggedIn, controller.deletePost)
  .put(loggedIn, controller.updatePost);

export default router;
