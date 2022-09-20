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
exports.getTopWriters = exports.getUnfollowedUsers = exports.removeNotificationPreference = exports.addNotificationPreference = exports.unFollowUser = exports.usersToFollow = exports.followUser = exports.updateUser = exports.getUserMedia = exports.getUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const Post_1 = __importDefault(require("../models/Post"));
const Gist_1 = __importDefault(require("../models/Gist"));
const Feed_1 = __importDefault(require("../models/Feed"));
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
exports.getUserMedia = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        //@ts-ignore
        let media = [];
        const gists = yield Gist_1.default.find({ author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        const posts = yield Post_1.default.find({ author: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id });
        const feed = yield Feed_1.default.find({ author: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id });
        const userItems = [...gists, ...posts, ...feed];
        userItems.map((item) => {
            var _a;
            if (item.media.length > 0) {
                //@ts-ignore
                (_a = item.media) === null || _a === void 0 ? void 0 : _a.map((el) => {
                    media.push(el);
                });
            }
        });
        res.json({
            message: 'Media list fetched',
            //@ts-ignore
            media
        });
    }
    catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
}));
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    console.log((_d = req.file) === null || _d === void 0 ? void 0 : _d.location);
    try {
        const user = yield User_1.default.findByIdAndUpdate(req.user._id, Object.assign(Object.assign({}, req.body), (((_e = req.file) === null || _e === void 0 ? void 0 : _e.location) && { images: req.query.imageType == "cover" ?
                {
                    cover: req.file.location || ((_g = (_f = req.user) === null || _f === void 0 ? void 0 : _f.images) === null || _g === void 0 ? void 0 : _g.cover),
                    avatar: (_j = (_h = req.user) === null || _h === void 0 ? void 0 : _h.images) === null || _j === void 0 ? void 0 : _j.avatar
                } : {
                avatar: req.file.location || ((_l = (_k = req.user) === null || _k === void 0 ? void 0 : _k.images) === null || _l === void 0 ? void 0 : _l.avatar),
                cover: (_o = (_m = req.user) === null || _m === void 0 ? void 0 : _m.images) === null || _o === void 0 ? void 0 : _o.cover
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
    var _p, _q, _r, _s, _t, _u;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_p = req.user) === null || _p === void 0 ? void 0 : _p._id, {
            $addToSet: { following: [req.params.id] },
        }, { new: true });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $addToSet: { followers: [(_q = req.user) === null || _q === void 0 ? void 0 : _q._id] },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_r = req.user) === null || _r === void 0 ? void 0 : _r.firstName} ${(_s = req.user) === null || _s === void 0 ? void 0 : _s.lastName} followed you `,
            forItem: "follow",
            itemId: (_t = req.user) === null || _t === void 0 ? void 0 : _t._id,
            author: (_u = req.user) === null || _u === void 0 ? void 0 : _u._id,
            targetedAudience: [itemAuthor._id],
        });
        res.status(200).json({ message: 'followed', user: me });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.usersToFollow = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _v;
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = yield User_1.default.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    try {
        const users = yield User_1.default.find({
            followers: {
                $nin: (_v = req.user) === null || _v === void 0 ? void 0 : _v._id,
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
    var _w, _x, _y, _z, _0, _1;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_w = req.user) === null || _w === void 0 ? void 0 : _w._id, {
            $pull: { following: { $in: [req.params.id] } },
        });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $pull: { followers: { $in: [(_x = req.user) === null || _x === void 0 ? void 0 : _x._id] } },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_y = req.user) === null || _y === void 0 ? void 0 : _y.firstName} ${(_z = req.user) === null || _z === void 0 ? void 0 : _z.lastName} Unfollowed you `,
            forItem: "follow",
            itemId: (_0 = req.user) === null || _0 === void 0 ? void 0 : _0._id,
            author: (_1 = req.user) === null || _1 === void 0 ? void 0 : _1._id,
            targetedAudience: [itemAuthor._id],
        });
        res.status(200).json("unfollowed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.addNotificationPreference = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _2;
    const { option } = req.body;
    console.log(option, req.params.id);
    try {
        const response = yield User_1.default.findByIdAndUpdate((_2 = req.user) === null || _2 === void 0 ? void 0 : _2._id, {
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
    var _3;
    const { option } = req.body;
    try {
        const response = yield User_1.default.findByIdAndUpdate((_3 = req.user) === null || _3 === void 0 ? void 0 : _3._id, {
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
    var _4;
    try {
        const users = yield User_1.default.find({
            followers: {
                $nin: (_4 = req.user) === null || _4 === void 0 ? void 0 : _4._id,
            },
        });
        for (var i = users.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = users[i];
            users[i] = users[j];
            users[j] = temp;
        }
        const limitedUsers = users.splice(0, 20);
        res.json({
            message: ` ${limitedUsers.length} suggested connections fetched`,
            connections: limitedUsers,
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
        let posts = yield Post_1.default.find()
            .populate("author", "firstName lastName images followers following");
        posts = posts.filter(item => { var _a, _b, _c; return !((_b = (_a = item.author) === null || _a === void 0 ? void 0 : _a.followers) === null || _b === void 0 ? void 0 : _b.includes((_c = req.user) === null || _c === void 0 ? void 0 : _c._id)); });
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
