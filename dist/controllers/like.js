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
exports.unlike = exports.saveLike = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Gist_1 = __importDefault(require("../models/Gist"));
const Post_1 = __importDefault(require("../models/Post"));
const Feed_1 = __importDefault(require("../models/Feed"));
const Notification_1 = __importDefault(require("../models/Notification"));
const Comment_1 = __importDefault(require("../models/Comment"));
exports.saveLike = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    const { id, type } = req.query;
    //console.log(`the post to be liked has the Id ${id}`);
    let itemAuthor;
    try {
        if (type == "post") {
            yield Post_1.default.findByIdAndUpdate(id, {
                $addToSet: { likes: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            itemAuthor = yield Post_1.default.findById(req.query.id);
        }
        else if (type == "gist") {
            yield Gist_1.default.findByIdAndUpdate(id, {
                $addToSet: { likes: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            itemAuthor = yield Gist_1.default.findById(req.query.id);
        }
        else if (type == "feed") {
            yield Feed_1.default.findByIdAndUpdate(id, {
                $addToSet: { likes: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            itemAuthor = yield Feed_1.default.findById(req.query.id);
            res.status(200).json("Liked");
        }
        else if (type == "comment") {
            yield Comment_1.default.findByIdAndUpdate(id, {
                $addToSet: { likes: (_d = req.user) === null || _d === void 0 ? void 0 : _d._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            res.status(200).json("Liked");
        }
        const notification = yield Notification_1.default.create({
            content: `${(_e = req.user) === null || _e === void 0 ? void 0 : _e.firstName} ${(_f = req.user) === null || _f === void 0 ? void 0 : _f.lastName} liked your post `,
            forItem: "like",
            itemId: req.user._id,
            author: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id,
            targetedAudience: [itemAuthor.author],
        });
        res.status(200).json("Liked");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.unlike = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m, _o, _p;
    const { id, type } = req.query;
    //console.log(`the post to be liked has the Id ${id}`);
    let itemAuthor;
    try {
        if (type == "post") {
            yield Post_1.default.findByIdAndUpdate(id, {
                $pull: { likes: (_h = req.user) === null || _h === void 0 ? void 0 : _h._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            itemAuthor = yield Post_1.default.findById(req.query.id);
        }
        else if (type == "gist") {
            yield Gist_1.default.findByIdAndUpdate(id, {
                $pull: { likes: (_j = req.user) === null || _j === void 0 ? void 0 : _j._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            itemAuthor = yield Gist_1.default.findById(req.query.id);
        }
        else if (type == "feed") {
            yield Feed_1.default.findByIdAndUpdate(id, {
                $pull: { likes: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            itemAuthor = yield Feed_1.default.findById(req.query.id);
        }
        else if (type == "comment") {
            yield Comment_1.default.findByIdAndUpdate(id, {
                $pull: { likes: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id },
            }).where({
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            });
            res.status(200).json("Liked");
        }
        const notification = yield Notification_1.default.create({
            content: `${(_m = req.user) === null || _m === void 0 ? void 0 : _m.firstName} ${(_o = req.user) === null || _o === void 0 ? void 0 : _o.lastName} unliked your post `,
            forItem: "like",
            itemId: req.user._id,
            author: (_p = req.user) === null || _p === void 0 ? void 0 : _p._id,
            targetedAudience: [itemAuthor.author],
        });
        res.status(200).json("unliked");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
