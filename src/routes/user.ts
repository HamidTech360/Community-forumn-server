import express from "express";
import * as controller from "../controllers/user";
import multer from 'multer'
const upload = multer({dest:"./uploads/"})
const router = express.Router();

router.get("/", controller.getUsers);

router.get("/:id", controller.getUser);
router.put("/:id", upload.single('file'), controller.updateUser)

export default router;
