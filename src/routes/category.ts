import { Router } from "express";
import { loggedIn } from "../middleware/auth";
import * as controller from '../controllers/category'
const router = Router()

router.get('/', controller.getCategories)
router.post('/', controller.createCategory)
router.put('/', controller.updateCategory)
router.delete('/', controller.deleteCategories)

export default router