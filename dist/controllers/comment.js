"use strict";
//@Route /api/posts/:id/comment,
///@Method: Post
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
exports.deleteComment = exports.editComment = exports.comment = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Comment_1 = __importDefault(require("../models/Comment"));
const Gist_1 = __importDefault(require("../models/Gist"));
const Post_1 = __importDefault(require("../models/Post"));
const Feed_1 = __importDefault(require("../models/Feed"));
const notification_1 = __importDefault(require("../models/notification"));
//@Route: /api/comments/:type/:id
//@Access: LoggedIn
exports.comment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const type = req.query.type;
    const comment = yield Comment_1.default.create(Object.assign({ author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, req.body));
    let itemAuthor;
    if (type == "post") {
        yield Post_1.default.findByIdAndUpdate(req.query.id, {
            $addToSet: { comments: [comment._id] },
        });
        itemAuthor = yield Post_1.default.findById(req.query.id);
    }
    else if (type == "gist") {
        yield Gist_1.default.findByIdAndUpdate(req.query.id, {
            $addToSet: { comments: [comment._id] },
        });
        itemAuthor = yield Gist_1.default.findById(req.query.id);
    }
    else if (type == "feed") {
        yield Feed_1.default.findByIdAndUpdate(req.query.id, {
            $addToSet: { comments: [comment._id] },
        });
        itemAuthor = yield Feed_1.default.findById(req.query.id);
    }
    else if (type == "reply") {
        console.log("replying");
        const reply = yield Comment_1.default.findByIdAndUpdate(req.query.id, {
            $addToSet: { replies: [comment._id] },
        });
        //console.log(reply);
        itemAuthor = yield Comment_1.default.findById(req.query.id);
    }
    const notification = yield notification_1.default.create({
        content: `${(_b = req.user) === null || _b === void 0 ? void 0 : _b.firstName} ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.lastName} commented on a ${type} you created`,
        forItem: type,
        itemId: itemAuthor._id,
        author: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id,
        targetedAudience: [itemAuthor.author],
    });
    res
        .status(200)
        .json(yield comment.populate("author", "firstName lastName images"));
}));
//@route /api/comments/:id
//@method PUT
//Access Private
exports.editComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const comment = yield Comment_1.default.findById(req.params.id);
        if (comment && comment.author.toString() === ((_e = req === null || req === void 0 ? void 0 : req.user) === null || _e === void 0 ? void 0 : _e._id.toString())) {
            const commentKeys = Object.keys(req.body);
            for (let i = 0; i < commentKeys.length; i++) {
                comment[commentKeys[i]] = req.body[commentKeys[i]];
            }
            const updatedComment = yield comment.save();
            res.status(200).json(updatedComment);
        }
        else {
            res.status(404).json({ msg: "Comment not found" });
        }
    }
    catch (error) { }
}));
//@route /api/comments/:id
//@method Delete
//Access Private
exports.deleteComment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const comment = yield Comment_1.default.findById(req.params.id).where({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        });
        if (comment && comment.author.toString() === ((_f = req === null || req === void 0 ? void 0 : req.user) === null || _f === void 0 ? void 0 : _f._id.toString())) {
            comment.deleted = true;
            yield comment.save();
            res.status(200).json({ msg: "comment deleted" });
        }
        else {
            res.status(404).json({ msg: "comment not found" });
        }
    }
    catch (error) { }
}));
