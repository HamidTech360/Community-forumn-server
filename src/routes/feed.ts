import express from "express";
import * as controller from "../controllers/feed";
import { loggedIn } from "../middleware/auth";

const router = express.Router();

router.get("/", controller.fetchFeeds);
router.get("/:id", controller.fetchFeed);
router.post("/", loggedIn, controller.saveFeed);

export default router;
