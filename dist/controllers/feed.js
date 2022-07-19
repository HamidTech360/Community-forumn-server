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
exports.fetchFeed = exports.fetchFeeds = exports.saveFeed = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const feed_1 = __importDefault(require("../models/feed"));
exports.saveFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { post, group } = req.body;
    try {
        const feed = yield feed_1.default.create({
            post,
            author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            group,
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
        const feeds = yield feed_1.default.find()
            .sort({ createdAt: -1 })
            .limit(25)
            .populate("author");
        res.json({
            status: "success",
            message: "Feeds fetched",
            feeds,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.fetchFeed = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const feed = yield feed_1.default.findById(id)
        .populate("author", "firstName lastName avatar")
        .populate("group");
    res.status(200).json(feed);
}));
