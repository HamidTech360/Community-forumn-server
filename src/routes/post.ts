import { Router } from "express";
import * as controller from "../controllers/post";
import { loggedIn } from "../middleware/auth";
import { upload } from "../middleware/upload";
const router = Router();

router
  .route("/")
  .get(controller.getPosts)
  .post(loggedIn, upload.array("media", 3), controller.createPost);

router
  .route("/:id")
  .get(controller.getPost)
  .delete(loggedIn, controller.deletePost)
  .put(loggedIn, upload.array("media", 3), controller.updatePost);

router
  .route("/:id/like")
  .get(loggedIn, controller.likePost)
  .delete(loggedIn, controller.deleteLike);

router.route("/user/all").get(loggedIn, controller.getUserPosts);

export default router;
