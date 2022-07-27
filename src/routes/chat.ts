import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from '../controllers/chat'

const router = Router()
router.post(`/`, loggedIn, controller.saveMessage)
router.get('/', loggedIn, controller.fetchMessages)
router.get('/conversations', loggedIn, controller.fetchConversation)

export default router
