import { Router } from "express";
import * as controller from "../controllers/notification";
import { loggedIn } from "../middleware/auth";
const router = Router();


router.get('/', loggedIn, controller.fetchUserNotifications)
router.delete('/', loggedIn, controller.MarkAsRead)

export default router;
