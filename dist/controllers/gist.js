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
exports.updateGist = exports.deleteGist = exports.fetchSingleGist = exports.fetchAllGist = exports.createGist = void 0;
const notification_1 = __importDefault(require("../models/notification"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Gist_1 = __importDefault(require("../models/Gist"));
//import {validateGist} from '../validators/gist'
exports.createGist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const { title, post, country, categories } = req.body;
        // const error = validateGist(req.body)
        // if(error) {
        //     res.status(400).json(error.details[0].message)
        //     return
        // }
        const gist = yield Gist_1.default.create({
            title,
            post,
            country,
            categories,
            author: (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a._id,
            media: (_b = req === null || req === void 0 ? void 0 : req.files) === null || _b === void 0 ? void 0 : _b.map((file) => file.location),
        });
        const notification = yield notification_1.default.create({
            content: `${(_c = req.user) === null || _c === void 0 ? void 0 : _c.firstName} ${(_d = req.user) === null || _d === void 0 ? void 0 : _d.lastName} started a gist`,
            forItem: "gist",
            itemId: gist._id,
            author: (_e = req.user) === null || _e === void 0 ? void 0 : _e._id,
            targetedAudience: [...(_f = req.user) === null || _f === void 0 ? void 0 : _f.followers],
        });
        res.status(201).json({ message: "Gist created", gist });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: "Something went wrong" });
    }
}));
exports.fetchAllGist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = Number(req.query.perPage) || 25;
        const page = Number(req.query.page) || 0;
        const count = yield Gist_1.default.find().estimatedDocumentCount();
        const numPages = Math.ceil(count / perPage);
        const category = req.query.category;
        const gists = yield Gist_1.default.find(category
            ? { categories: category }
            : {
                $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            })
            .sort({ createdAt: -1 })
            .limit(perPage)
            .skip(page * perPage)
            .populate("author", "firstName lastName images")
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName images" },
        })
            .populate({
            path: "comments",
            populate: {
                path: "replies",
                populate: { path: "author", select: "firstName lastName images" },
                options: { sort: { createdAt: -1 } },
            },
            options: { sort: { createdAt: -1 } },
        });
        res.json({
            status: "success",
            message: "Gists retrieved",
            gists,
            count,
            numPages,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: "Something went wrong" });
    }
}));
exports.fetchSingleGist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gistID = req.params.id;
    try {
        const gist = yield Gist_1.default.findById(gistID)
            .where({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        })
            .populate("author", "firstName lastName images")
            .populate({
            path: "comments",
            populate: { path: "author", select: "firstName lastName images" },
        })
            .populate({
            path: "comments",
            populate: {
                path: "replies",
                populate: { path: "author", select: "firstName lastName images" },
                options: { sort: { createdAt: -1 } },
            },
            options: { sort: { createdAt: -1 } },
        });
        res.json({
            status: "success",
            message: "Gist fetched",
            gist,
        });
    }
    catch (error) {
        res.status(500).json({ error: error, message: "Something went wrong" });
    }
}));
exports.deleteGist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    const gistID = req.params.id;
    try {
        //find gist with gistID and delete
        const gist = yield Gist_1.default.findById(gistID)
            .where({
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        })
            .catch((error) => console.log(error));
        if (gist && gist.author.toString() === ((_g = req === null || req === void 0 ? void 0 : req.user) === null || _g === void 0 ? void 0 : _g._id.toString())) {
            gist.deleted = true;
            yield gist.save();
            res.status(200).json({ msg: "Gist deleted" });
        }
        else {
            res.status(404).json({ msg: "Gist not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: "Something went wrong" });
    }
}));
exports.updateGist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    const gistID = req.params.id;
    const gist = yield Gist_1.default.findById(gistID).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (gist && gist.author.toString() === ((_h = req === null || req === void 0 ? void 0 : req.user) === null || _h === void 0 ? void 0 : _h._id.toString())) {
        const gistKeys = Object.keys(req.body);
        for (let i = 0; i < gistKeys.length; i++) {
            if (gistKeys[i] !== "media") {
                gist[gistKeys[i]] = req.body[gistKeys[i]];
            }
            else {
                gist.media = (_j = req.files) === null || _j === void 0 ? void 0 : _j.map((file) => file.location);
            }
        }
        const updatedGist = yield gist.save();
        res.status(200).json(updatedGist);
    }
    else {
        res.status(404).json({ msg: "Gist not found" });
    }
}));
