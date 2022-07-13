import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from '../controllers/like'

const router = Router()
router.get(`/`, loggedIn, controller.saveLike)

export default router
