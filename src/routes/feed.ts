import express from "express";
import * as controller from "../controllers/feed";
import { loggedIn } from "../middleware/auth";

const router = express.Router();

router.get("/", controller.fetchFeeds);
router.route("/groups/").get(controller.getRandomGroupFeed);
router
  .route("/:id")
  .get(controller.fetchFeed)
  .put(loggedIn, controller.updateFeed);
router.post("/", loggedIn, controller.saveFeed);
router.delete("/", loggedIn, controller.deleteFeed);

router.route("/groups/:id").get(controller.getGroupFeed);
export default router;
