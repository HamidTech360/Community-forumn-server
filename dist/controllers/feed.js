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
exports.deleteFeed = exports.updateFeed = exports.getRandomGroupFeed = exports.getGroupFeed = exports.fetchFeed = exports.fetchFeeds = exports.saveFeed = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Feed_1 = __importDefault(require("../models/Feed"));
const notification_1 = __importDefault(require("../models/notification"));
exports.saveFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { post, group } = req.body;
    try {
        const feed = yield Feed_1.default.create({
            post,
            author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            group,
            media: (_b = req.files) === null || _b === void 0 ? void 0 : _b.map((file) => file.location),
        });
        const notification = yield notification_1.default.create({
            content: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.firstName} ${(_d = req.user) === null || _d === void 0 ? void 0 : _d.lastName} posted an item in the feed`,
            forItem: "feed",
            itemId: feed._id,
            author: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
            targetedAudience: [...(_f = req.user) === null || _f === void 0 ? void 0 : _f.followers],
        });
        res.json({
            status: "success",
            message: "Feed created",
            feed,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.fetchFeeds = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = Number(req.query.perPage) || 25;
        const page = Number(req.query.page) || 0;
        const count = yield Feed_1.default.find().estimatedDocumentCount();
        const numPages = Math.ceil(count / perPage);
        const feed = yield Feed_1.default.find({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        })
            .sort({ createdAt: -1 })
            .limit(perPage)
            .skip(page * perPage)
            .populate("author", "firstName lastName avatar")
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName avatar" },
        })
            .populate("likes", "firstName lastName")
            .populate({
            path: "comments",
            populate: {
                path: "replies",
                populate: { path: "author", select: "firstName lastName avatar" },
            },
        });
        res.json({
            status: "success",
            message: "Feed retrieved",
            feed,
            count,
            numPages,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.fetchFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const feed = yield Feed_1.default.findById(id)
        .populate("author", "firstName lastName avatar")
        .populate("group")
        .populate("likes", "firstName lastName")
        .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName avatar" },
    })
        .populate({
        path: "comments",
        populate: {
            path: "replies",
            populate: { path: "author", select: "firstName lastName avatar" },
        },
    });
    res.status(200).json(feed);
}));
//@Routes /api/posts/group/:id
//Method get
//@ccess: loggedIn
exports.getGroupFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.id;
    console.log(groupId);
    try {
        const perPage = Number(req.query.perPage) || 25;
        const page = Number(req.query.page) || 0;
        const count = yield Feed_1.default.find().estimatedDocumentCount();
        const numPages = Math.ceil(count / perPage);
        const posts = yield Feed_1.default.find({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            group: groupId,
        })
            .sort({ createdAt: -1 })
            .limit(perPage)
            .skip(page * perPage)
            .populate("author", "firstName lastName avatar")
            .populate("likes", "firstName lastName")
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName avatar" },
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
            message: "Group feed retrieved",
            posts,
            count,
            numPages,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//@Routes /api/posts/group/:id
//Method get
//@ccess: loggedIn
exports.getRandomGroupFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = Number(req.query.perPage) || 25;
        const page = Number(req.query.page) || 0;
        const count = yield Feed_1.default.find().estimatedDocumentCount();
        const numPages = Math.ceil(count / perPage);
        const posts = yield Feed_1.default.find({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            group: { $ne: null },
        })
            .sort({ createdAt: -1 })
            .limit(perPage)
            .skip(page * perPage)
            .populate("author", "firstName lastName avatar")
            .populate("likes", "firstName lastName")
            .populate("group")
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName avatar" },
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
            message: "Group feed retrieved",
            posts,
            count,
            numPages,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//@Route /api/feed/:id
//@Method Put
//@Access: LoggedIn
exports.updateFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h;
    const feedId = req.params.id;
    const feed = yield Feed_1.default.findById(feedId).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (feed && feed.author.toString() === ((_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id.toString())) {
        const feedKeys = Object.keys(req.body);
        for (let i = 0; i < feedKeys.length; i++) {
            if (feedKeys[i] !== "media") {
                feed[feedKeys[i]] = req.body[feedKeys[i]];
            }
            else {
                feed.media = (_h = req.files) === null || _h === void 0 ? void 0 : _h.map((file) => file.location);
            }
        }
        const updatedFeed = yield feed.save();
        res.status(200).json(updatedFeed);
    }
    else {
        res.status(404).json({ msg: "Feed not found" });
    }
}));
exports.deleteFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        yield Feed_1.default.findByIdAndUpdate(id, { deleted: true });
        res.json({
            message: "Feed deleted",
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
