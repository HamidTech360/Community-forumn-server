import { Router } from "express";
import { loggedIn } from "../middleware/auth";

import * as controller from "../controllers/group";
const router = Router();

router
  .route("/")
  .post(loggedIn, controller.createGroup)
  .get(controller.getGroups);

router
  .route("/group/:id")
  .get(controller.getGroup)
  .put(loggedIn, controller.updateGroup)
  .delete(loggedIn, controller.deleteGroup);

  router
    .route("/user")
    .get(loggedIn, controller.getUserGroups)
export default router;
