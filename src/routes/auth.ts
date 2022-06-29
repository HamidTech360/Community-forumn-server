import { Router } from "express";
import * as controller from "../controllers/auth";
const router = Router();

router.post("/", controller.login);
router.post("/register", controller.register);
export default router;
