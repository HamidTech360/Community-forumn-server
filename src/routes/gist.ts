import { Router } from "express";
import * as controller from "../controllers/gist";
import { loggedIn } from "../middleware/auth";
import { upload } from "../middleware/upload";
const router = Router();

router
  .route(`/`)
  .post(loggedIn, upload.array("media", 3), controller.createGist)
  .get(controller.fetchAllGist);

router
  .route(`/:id`)
  .get(controller.fetchSingleGist)
  .put(loggedIn, upload.array("media", 3), controller.updateGist)
  .delete(loggedIn, controller.deleteGist);

export default router;
