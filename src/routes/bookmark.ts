import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from '../controllers/bookmark'

const router = Router()
router.post(`/`, loggedIn, controller.AddToBookMark)
router.delete('/', loggedIn, controller.RemoveFromBookmark)
router.get('/', loggedIn, controller.getBookMarks)

export default router
