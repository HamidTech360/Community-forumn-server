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
const controller = __importStar(require("../controllers/post"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(controller.getPosts)
    .post(auth_1.loggedIn, controller.createPost);
router
    .route("/:id")
    .get(controller.getPost)
    .delete(auth_1.loggedIn, controller.deletePost)
    .put(auth_1.loggedIn, controller.updatePost);
router
    .route("/:id/like")
    .get(auth_1.loggedIn, controller.likePost)
    .delete(auth_1.loggedIn, controller.deleteLike);
router
    .route("/group/random")
    .get(controller.getRandomGroupPosts);
router
    .route("/group/one/:id")
    .get(controller.getGroupPosts);
router
    .route("/user/all")
    .get(auth_1.loggedIn, controller.getUserPosts);
exports.default = router;