import { Router } from "express";
import { loggedIn } from "../middleware/auth";

import * as controller from "../controllers/group";
import { upload } from "../middleware/upload";
const router = Router();

router
  .route("/")
  .post(loggedIn, upload.single("avatar"), controller.createGroup)
  .get(controller.getGroups);

router
  .route("/group/:id")
  .get(controller.getGroup)
  .put(loggedIn, controller.updateGroup)
  .patch(loggedIn, controller.joinGroup)
  .delete(loggedIn, controller.deleteGroup);

router.route("/user").get(loggedIn, controller.getUserGroups);
export default router;
