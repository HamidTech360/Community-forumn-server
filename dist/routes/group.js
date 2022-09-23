"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const controller = __importStar(require("../controllers/group"));
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(auth_1.loggedIn, upload_1.upload.single("avatar"), controller.createGroup)
    .get(controller.getGroups);
router
    .route("/group/:id")
    .get(controller.getGroup)
    .put(auth_1.loggedIn, upload_1.upload.single("avatar"), controller.updateGroup)
    .patch(auth_1.loggedIn, controller.joinGroup)
    .delete(auth_1.loggedIn, controller.deleteGroup);
router
    .route("/invite/:id")
    .get(auth_1.loggedIn, controller.Invitations);
router.post("/invite", auth_1.loggedIn, controller.inviteToGroup);
router.route("/user").get(auth_1.loggedIn, controller.getUserGroups);
router.get('/media/:id', controller.groupMedia);
exports.default = router;
