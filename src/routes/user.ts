import express from "express";
import * as controller from "../controllers/user";
const router = express.Router();

router.get("/", controller.getUsers);

router.get("/:id", controller.getUser);

export default router;
