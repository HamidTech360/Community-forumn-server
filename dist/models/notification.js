"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    forItem: {
        type: String,
        required: true
    },
    itemId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true
    },
    targetedAudience: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User"
    },
    read: {
        type: Boolean
    }
}, { timestamps: true });
const Notification = mongoose_1.models.notification || (0, mongoose_1.model)('notification', notificationSchema);
exports.default = Notification;
