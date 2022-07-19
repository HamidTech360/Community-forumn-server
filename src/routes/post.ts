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

router
  .route("/:id/like")
  .get(loggedIn, controller.likePost)
  .delete(loggedIn, controller.deleteLike);

router.route("/user/all").get(loggedIn, controller.getUserPosts);

export default router;
