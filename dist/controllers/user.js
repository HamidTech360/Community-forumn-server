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
        const user = yield User_1.default.findById(req.params.id).populate("followers");
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, Object.assign({}, req.body));
        res.json({
            status: "success",
            message: "User updated",
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.followUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, {
            $addToSet: { following: [req.params.id] },
        });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $addToSet: { followers: [(_b = req.user) === null || _b === void 0 ? void 0 : _b._id] },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.firstName} ${(_d = req.user) === null || _d === void 0 ? void 0 : _d.lastName} followed you `,
            forItem: "follow",
            itemId: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
            author: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id,
            targetedAudience: [itemAuthor._id],
        });
        res.status(200).json("followed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.usersToFollow = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = yield User_1.default.find().estimatedDocumentCount();
    const numPages = Math.ceil(count / perPage);
    try {
        const users = yield User_1.default.find({
            followers: {
                $nin: (_g = req.user) === null || _g === void 0 ? void 0 : _g._id,
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
    var _h, _j, _k, _l, _m;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_h = req.user) === null || _h === void 0 ? void 0 : _h._id, {
            $pull: { following: { $in: [req.params.id] } },
        });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $pull: { followers: { $in: [req.params.id] } },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_j = req.user) === null || _j === void 0 ? void 0 : _j.firstName} ${(_k = req.user) === null || _k === void 0 ? void 0 : _k.lastName} Unfollowed you `,
            forItem: "follow",
            itemId: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id,
            author: (_m = req.user) === null || _m === void 0 ? void 0 : _m._id,
            targetedAudience: [itemAuthor._id],
        });
        res.status(200).json("unfollowed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.addNotificationPreference = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _o;
    const { option } = req.body;
    console.log(option, req.params.id);
    try {
        const response = yield User_1.default.findByIdAndUpdate((_o = req.user) === null || _o === void 0 ? void 0 : _o._id, {
            $addToSet: { notificationOptions: option }
        });
        res.json({
            message: 'preference updated'
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.removeNotificationPreference = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _p;
    const { option } = req.body;
    try {
        const response = yield User_1.default.findByIdAndUpdate((_p = req.user) === null || _p === void 0 ? void 0 : _p._id, {
            $pull: { notificationOptions: option }
        });
        res.json({
            message: 'preference removed'
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.getUnfollowedUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    try {
        const users = yield User_1.default.find({ followers: {
                $nin: (_q = req.user) === null || _q === void 0 ? void 0 : _q._id
            } }).limit(25);
        res.json({
            message: 'suggested connections fetched',
            connections: users
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
        const posts = yield Post_1.default.find().populate('author');
        for (var i in posts) {
            //@ts-ignore
            frequency[posts[i].author._id] = (frequency[posts[i].author._id] || 0) + 1;
        }
        //@ts-ignore
        const sortedFrequency = Object.entries(frequency).sort(([, a], [, b]) => b - a)
            .reduce((obj, [k, v]) => (Object.assign(Object.assign({}, obj), { [k]: v })), {});
        for (let key in sortedFrequency) {
            const user = posts.find(item => item.author._id.toString() === key);
            //@ts-ignore
            topWriters.push(user === null || user === void 0 ? void 0 : user.author);
        }
        //console.log( sortedFrequency, topWriters);
        res.json({
            message: 'top writers fetched',
            users: topWriters
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
