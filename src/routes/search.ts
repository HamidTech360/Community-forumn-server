import { Router } from "express";
import * as controller from "../controllers/search";
const router = Router();

router.get("/", controller.search);

export default router;
