//@ts-nocheck
import express from "express";
import * as controller from "../controllers/feed";
import { loggedIn } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = express.Router();
router.get("/", controller.fetchFeeds);
router.route("/groups/").get(controller.getRandomGroupFeed);
router
  .route("/:id")
  .get(controller.fetchFeed)
  .put(loggedIn, upload.array("media"), controller.updateFeed);
router.post("/", loggedIn, upload.array("media"), controller.saveFeed);
router.delete("/", loggedIn, controller.deleteFeed);

router.route("/groups/:id").get(controller.getGroupFeed);
export default router;
