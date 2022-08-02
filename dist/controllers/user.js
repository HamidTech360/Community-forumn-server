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
exports.unFollowUser = exports.followUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
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
            forItem: 'follow',
            itemId: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
            author: (_f = req.user) === null || _f === void 0 ? void 0 : _f._id,
            targetedAudience: [itemAuthor._id]
        });
        res.status(200).json("followed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.unFollowUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l;
    try {
        const me = yield User_1.default.findByIdAndUpdate((_g = req.user) === null || _g === void 0 ? void 0 : _g._id, {
            $pull: { following: { $in: [req.params.id] } },
        });
        const them = yield User_1.default.findByIdAndUpdate(req.params.id, {
            $pull: { followers: { $in: [req.params.id] } },
        });
        const itemAuthor = yield User_1.default.findById(req.params.id);
        const notification = yield notification_1.default.create({
            content: `${(_h = req.user) === null || _h === void 0 ? void 0 : _h.firstName} ${(_j = req.user) === null || _j === void 0 ? void 0 : _j.lastName} Unfollowed you `,
            forItem: 'follow',
            itemId: (_k = req.user) === null || _k === void 0 ? void 0 : _k._id,
            author: (_l = req.user) === null || _l === void 0 ? void 0 : _l._id,
            targetedAudience: [itemAuthor._id]
        });
        res.status(200).json("unfollowed");
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
