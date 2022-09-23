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
exports.MarkAsRead = exports.fetchUserNotifications = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Notification_1 = __importDefault(require("../models/Notification"));
exports.fetchUserNotifications = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield Notification_1.default.find({
            targetedAudience: {
                $in: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
            },
        }).sort({ createdAt: -1 });
        const notifications = response.filter((item) => { var _a; return item.author.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString()); });
        res.json({
            message: "notifications fetched",
            notifications,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.MarkAsRead = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const markAsRead = yield Notification_1.default.findByIdAndUpdate(req.query.id, {
            read: true,
        });
        res.json({
            meessage: "Notification mark as read",
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
