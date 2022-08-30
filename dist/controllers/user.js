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
exports.getTopWriters = exports.getUnfollowedUsers = exports.removeNotificationPreference = exports.addNotificationPreference = exports.unFollowUser = exports.usersToFollow = exports.followUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const notification_1 = __importDefault(require("../models/notification"));
//@route: /api/users
//@method: GET
//@access: public
exports.getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = Number(req.query.perPage) || 25;
        const page = Number(req.query.page) || 0;
        const count = yield User_1.default.find().estimatedDocumentCount();
        const numPages = Math.ceil(count / perPage);
        const users = yield User_1.default.find()
            .sort({ createdAt: -1 })
            .limit(perPage)
            .skip(page * perPage);
        res.status(200).json({ users, count, numPages });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
//@route: ./api/users/:id
//@method: GET
//@access public
exports.getUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id).populate("followers following", "firstName lastName images");
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    console.log((_a = req.file) === null || _a === void 0 ? void 0 : _a.location);
    try {
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), (((_b = req.file) === null || _b === void 0 ? void 0 : _b.location) && { images: req.query.imageType == "cover" ?
                {
                    cover: req.file.location || ((_d = (_c = req.user) === null || _c === void 0 ? void 0 : _c.images) === null || _d === void 0 ? void 0 : _d.cover),
                    avatar: (_f = (_e = req.user) === null || _e === void 0 ? void 0 : _e.images) === null || _f === void 0 ? void 0 : _f.avatar
                } : {
                avatar: req.file.location || ((_h = (_g = req.user) === null || _g === void 0 ? void 0 : _g.images) === null || _h === void 0 ? void 0 : _h.avatar),
                cover: (_k = (_j = req.user) === null || _j === void 0 ? void 0 : _j.images) === null || _k === void 0 ? void 0 : _k.cover
            }
        })), { new: true });
        res.json({
            status: "success",
            message: "User updated",
            user,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.followUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l, _m, _o, _p, _q, _r;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_l = req.user) === null || _l === void 0 ? void 0 : _l._id, {
            $addToSet: { following: [req.params.id] },
        });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $addToSet: { followers: [(_m = req.user) === null || _m === void 0 ? void 0 : _m._id] },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_o = req.user) === null || _o === void 0 ? void 0 : _o.firstName} ${(_p = req.user) === null || _p === void 0 ? void 0 : _p.lastName} followed you `,
            forItem: "follow",
            itemId: (_q = req.user) === null || _q === void 0 ? void 0 : _q._id,
            author: (_r = req.user) === null || _r === void 0 ? void 0 : _r._id,
            targetedAudience: [itemAuthor._id],
        });
        res.status(200).json("followed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.usersToFollow = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = yield User_1.default.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    try {
        const users = yield User_1.default.find({
            followers: {
                $nin: (_s = req.user) === null || _s === void 0 ? void 0 : _s._id,
            },
        }).limit(25);
        res.json({
            message: "suggested connections fetched",
            connections: users,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.unFollowUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u, _v, _w, _x;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_t = req.user) === null || _t === void 0 ? void 0 : _t._id, {
            $pull: { following: { $in: [req.params.id] } },
        });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $pull: { followers: { $in: [req.params.id] } },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_u = req.user) === null || _u === void 0 ? void 0 : _u.firstName} ${(_v = req.user) === null || _v === void 0 ? void 0 : _v.lastName} Unfollowed you `,
            forItem: "follow",
            itemId: (_w = req.user) === null || _w === void 0 ? void 0 : _w._id,
            author: (_x = req.user) === null || _x === void 0 ? void 0 : _x._id,
            targetedAudience: [itemAuthor._id],
        });
        res.status(200).json("unfollowed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.addNotificationPreference = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _y;
    const { option } = req.body;
    console.log(option, req.params.id);
    try {
        const response = yield User_1.default.findByIdAndUpdate((_y = req.user) === null || _y === void 0 ? void 0 : _y._id, {
            $addToSet: { notificationOptions: option },
        });
        res.json({
            message: "preference updated",
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.removeNotificationPreference = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _z;
    const { option } = req.body;
    try {
        const response = yield User_1.default.findByIdAndUpdate((_z = req.user) === null || _z === void 0 ? void 0 : _z._id, {
            $pull: { notificationOptions: option },
        });
        res.json({
            message: "preference removed",
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.getUnfollowedUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _0;
    try {
        const users = yield User_1.default.find({
            followers: {
                $nin: (_0 = req.user) === null || _0 === void 0 ? void 0 : _0._id,
            },
        }).limit(25);
        for (var i = users.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = users[i];
            users[i] = users[j];
            users[j] = temp;
        }
        res.json({
            message: "suggested connections fetched",
            connections: users,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.getTopWriters = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let frequency = {};
    let topWriters = [];
    try {
        const posts = yield Post_1.default.find().populate("author", "firstName lastName images");
        for (var i in posts) {
            //@ts-ignore
            frequency[posts[i].author._id] =
                //@ts-ignore
                (frequency[posts[i].author._id] || 0) + 1;
        }
        const sortedFrequency = Object.entries(frequency)
            //@ts-ignore
            .sort(([, a], [, b]) => b - a)
            .reduce((obj, [k, v]) => (Object.assign(Object.assign({}, obj), { [k]: v })), {});
        for (let key in sortedFrequency) {
            const user = posts.find((item) => item.author._id.toString() === key);
            //@ts-ignore
            topWriters.push(user === null || user === void 0 ? void 0 : user.author);
        }
        //console.log( sortedFrequency, topWriters);
        res.json({
            message: "top writers fetched",
            users: topWriters,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
