"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPosts = exports.deleteLike = exports.likePost = exports.updatePost = exports.deletePost = exports.getPost = exports.getPosts = exports.createPost = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Post_1 = __importDefault(require("../models/Post"));
const notification_1 = __importDefault(require("../models/notification"));
//@Route /api/posts
//@Method POST
//@Access: LoggedIn
exports.createPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { postTitle, postBody, groupId, category } = req.body;
    const post = yield Post_1.default.create({
        postTitle,
        postBody,
        author: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
        groupId,
        category,
        media: (_b = req.files) === null || _b === void 0 ? void 0 : _b.map((file) => file.location),
    });
    const notification = yield notification_1.default.create({
        content: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.firstName} ${(_d = req.user) === null || _d === void 0 ? void 0 : _d.lastName} created a post`,
        forItem: "post",
        itemId: post._id,
        author: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
        targetedAudience: [...(_f = req.user) === null || _f === void 0 ? void 0 : _f.followers],
    });
    res.status(201).json({ msg: "Post created", post });
}));
//@Route /api/posts
//@Method Get
//@Access: Public
exports.getPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const perPage = Number(req.query.perPage) || 25;
    const category = req.query.category;
    const page = Number(req.query.page) || 0;
    const count = yield Post_1.default.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    //console.log(req.query.category);
    const posts = yield Post_1.default.find(category
        ? { category }
        : {
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        })
        .sort({ createdAt: -1 })
        .limit(perPage)
        .skip(page * perPage)
        .populate("author", "firstName lastName avatar")
        .populate({
        path: "comments",
        populate: {
            path: "author",
            select: "firstName lastName avatar",
        },
    })
        .populate({
        path: "comments",
        populate: {
            path: "replies",
            populate: { path: "author", select: "firstName lastName avatar" },
        },
    });
    res.json({
        status: "success",
        message: "User posts retrieved",
        posts,
        count,
        numPages,
    });
}));
//@Route /api/posts/:id
//@Method Get
//@Access: Public
exports.getPost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const post = yield Post_1.default.findById(postId)
        .populate("author", "firstName lastName")
        .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar _id" },
    })
        .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
    })
        .where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (post) {
        res.status(200).json({ msg: "Posts retrieved", post });
    }
    else {
        res.status(404).json({ msg: "Post not found" });
    }
}));
//@Route /api/posts/:id
//@Method Delete
//@Access: LoggedIn
exports.deletePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const postId = req.params.id;
    const post = yield Post_1.default.findById(postId).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (post && post.author.toString() === ((_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id.toString())) {
        post.deleted = true;
        yield post.save();
        res.status(200).json({ msg: "Post deleted" });
    }
    else {
        res.status(404).json({ msg: "Post not found" });
    }
}));
//@Route /api/posts/:id
//@Method Put
//@Access: LoggedIn
exports.updatePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    const postId = req.params.id;
    const post = yield Post_1.default.findById(postId).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (post && post.author.toString() === ((_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id.toString())) {
        const postKeys = Object.keys(req.body);
        for (let i = 0; i < postKeys.length; i++) {
            if (postKeys[i] !== "media") {
                post[postKeys[i]] = req.body[postKeys[i]];
            }
            else {
                post.media = (_j = req.files) === null || _j === void 0 ? void 0 : _j.map((file) => file.location);
            }
        }
        const updatedPost = yield post.save();
        res.status(200).json(updatedPost);
    }
    else {
        res.status(404).json({ msg: "Post not found" });
    }
}));
//@Route /api/posts/:id
//@Method Put
//@Access: LoggedIn
exports.likePost = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    try {
        const postId = req.params.id;
        const post = yield Post_1.default.findByIdAndUpdate(postId, {
            $addToSet: { likes: [(_k = req.user) === null || _k === void 0 ? void 0 : _k._id] },
        }).where({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        });
        res.status(200).json("Liked");
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//@Route /api/posts/:id/like
//@Method Put
//@Access: LoggedIn
exports.deleteLike = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    try {
        const postId = req.params.id;
        const post = yield Post_1.default.findByIdAndUpdate(postId, {
            $pull: { likes: [(_l = req.user) === null || _l === void 0 ? void 0 : _l._id] },
        }).where({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        });
        res.status(200).json("Unliked");
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//@Routes /api/posts/user/:id
//Method get
//@ccess: loggedIn
exports.getUserPosts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _m, _o;
    try {
        const perPage = Number(req.query.perPage) || 25;
        const page = Number(req.query.page) || 0;
        const count = yield Post_1.default.find().estimatedDocumentCount();
        const numPages = Math.ceil(count / perPage);
        const posts = yield Post_1.default.find({
            $and: [
                {
                    $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
                },
                {
                    $or: [
                        { author: (_m = req === null || req === void 0 ? void 0 : req.user) === null || _m === void 0 ? void 0 : _m._id },
                        { likes: { $in: (_o = req === null || req === void 0 ? void 0 : req.user) === null || _o === void 0 ? void 0 : _o._id } },
                        // {following:{"$in":req?.user?._id}}
                    ],
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(perPage)
            .skip(page * perPage)
            .populate("author", "-password")
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName avatar" },
        })
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName avatar" },
        });
        res.json({
            status: "success",
            message: "User posts retrieved",
            posts,
            count,
            numPages,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
