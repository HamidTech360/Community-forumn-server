import express from "express";
import * as controller from "../controllers/user";
import { loggedIn } from "../middleware/auth";
// import multer from 'multer'
//const upload = multer({dest:"./uploads/"})
const router = express.Router();

router.get("/", controller.getUsers);

router.get("/:id", controller.getUser);
router.put("/:id", controller.updateUser);
router.put("/notifications/add", loggedIn, controller.addNotificationPreference)
router.put("/notifications/remove", loggedIn, controller.removeNotificationPreference)

router
  .route("/:id/follow")
  .get(loggedIn, controller.followUser)
  .delete(loggedIn, controller.unFollowUser);
export default router;
