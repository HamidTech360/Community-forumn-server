import { Router } from "express";
import * as controller from "../controllers/gist";
import { loggedIn } from "../middleware/auth";
const router = Router();

router
    .route(`/`)
    .post(loggedIn, controller.createGist)
    .get(controller.fetchAllGist)

router
    .route(`/:id`)
    .get(controller.fetchSingleGist)
    .put(loggedIn, controller.updateGist)
    .delete(loggedIn, controller.deleteGist)

export default router;