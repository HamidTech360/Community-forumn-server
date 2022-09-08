import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from "../controllers/auth";
const router = Router();

router.post("/", controller.login);
router.post("/register", controller.register);
router.get("/", loggedIn, controller.getCurrentUser);
router.put('/password', loggedIn, controller.updatePasssword)
router.post("/oauth", controller.oauth);
router.post("/verify", controller.verifyEmail)
export default router;
