"use strict";
//@Route /api/groups
//Method: Post
//@Access: loggedIn
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
exports.inviteToGroup = exports.Invitations = exports.groupMedia = exports.joinGroup = exports.getUserGroups = exports.getGroups = exports.deleteGroup = exports.updateGroup = exports.getGroup = exports.createGroup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Group_1 = __importDefault(require("../models/Group"));
const User_1 = __importDefault(require("../models/User"));
const notification_1 = __importDefault(require("../models/notification"));
const Feed_1 = __importDefault(require("../models/Feed"));
exports.createGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { name, description, privacy, invite, allowedToPost, groupMembers } = req.body;
    console.log((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.location);
    const group = yield Group_1.default.create(Object.assign({ admin: (_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b._id, moderators: [(_c = req.user) === null || _c === void 0 ? void 0 : _c._id], description,
        name,
        invite,
        privacy,
        allowedToPost, groupMembers: [(_d = req.user) === null || _d === void 0 ? void 0 : _d._id, ...groupMembers] }, (((_e = req.ile) === null || _e === void 0 ? void 0 : _e.location) && {
        images: {
            avatar: (_f = req.file) === null || _f === void 0 ? void 0 : _f.location
        }
    })));
    res.status(201).json({ group });
}));
// @Route /api/groups/:id
// @Method: Get
// @Access: public
exports.getGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groupId = req.params.id;
    const group = yield Group_1.default.findById(groupId).populate("admin groupMembers", "firstName lastName images");
    res.status(200).json(group);
}));
// @Route /api/groups/:id
// @Method: Put
// @Access: Private (Group admin/moderator)
exports.updateGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m, _o, _p;
    const groupId = req.params.id;
    const group = yield Group_1.default.findById(groupId);
    console.log((_g = req.file) === null || _g === void 0 ? void 0 : _g.location);
    const updatedGroup = yield Group_1.default.findByIdAndUpdate(req.params.id, Object.assign(Object.assign({}, req.body), (((_h = req.file) === null || _h === void 0 ? void 0 : _h.location) && {
        images: req.query.imageType == "cover" ? {
            avatar: (_j = group.images) === null || _j === void 0 ? void 0 : _j.avatar,
            cover: ((_k = req.file) === null || _k === void 0 ? void 0 : _k.location) || ((_l = group.images) === null || _l === void 0 ? void 0 : _l.cover)
        } : {
            avatar: ((_m = req.file) === null || _m === void 0 ? void 0 : _m.location) || ((_o = group.images) === null || _o === void 0 ? void 0 : _o.avatar),
            cover: (_p = group.images) === null || _p === void 0 ? void 0 : _p.cover
        }
    })), { new: true });
    res.status(200).json(updatedGroup);
}));
// @Route /api/groups/:id
// @Method: Delete
// @Access: Private (Group admin/moderator)
exports.deleteGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _q;
    const groupId = req.params.id;
    const group = yield Group_1.default.findById(groupId);
    if (group.admin.toString() === ((_q = req === null || req === void 0 ? void 0 : req.user) === null || _q === void 0 ? void 0 : _q._id.toString())) {
        group.deleted = true;
        const updated = yield group.save();
        res.status(200).json(updated);
    }
    else {
        res.status(403).json("Unauthorised");
    }
}));
// @Route /api/groups/
// @Method: Get
// @Access: Public
exports.getGroups = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const groups = yield Group_1.default.find({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    }).populate("admin", "-password");
    res.status(200).json(groups);
}));
exports.getUserGroups = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _r;
    const userId = (_r = req.user) === null || _r === void 0 ? void 0 : _r._id;
    //console.log('User is a member of', req.user?._id);
    try {
        const groups = yield Group_1.default.find({
            groupMembers: {
                $in: userId,
            },
        })
            .sort({ createdAt: -1 })
            .populate("admin", "firstNam lastName images");
        console.log(groups);
        res.json({
            status: "success",
            message: "User groups retrieved",
            groups,
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.joinGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _s;
    try {
        yield Group_1.default.findByIdAndUpdate(req.params.id, {
            $addToSet: { groupMembers: (_s = req.user) === null || _s === void 0 ? void 0 : _s._id },
        });
        res.json({
            message: "User joined group",
        });
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.groupMedia = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let videos = [];
        let images = [];
        const groupId = req.params.id;
        const posts = yield Feed_1.default.find({
            // $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
            group: groupId
        }).select('media');
        posts.map(item => {
            if (item.media.length > 0) {
                item.media.map((el) => {
                    const splitName = el.split('.');
                    const extension = splitName[splitName.length - 1];
                    console.log(extension);
                    if (extension == 'mp4' || extension == 'webm') {
                        videos.push(el);
                    }
                    else {
                        images.push(el);
                    }
                });
            }
        });
        res.json({
            message: 'Group media fetched',
            media: req.query.type == "image" ? images : videos
        });
    }
    catch (error) {
        res.status(500).send({ message: 'Server Error', error });
    }
}));
exports.Invitations = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u;
    const id = req.params.id;
    const invites = [];
    //console.log('In here')
    try {
        const group = yield Group_1.default.findById(id);
        const users = yield User_1.default.find({
            $or: [
                {
                    followers: {
                        $in: (_t = req.user) === null || _t === void 0 ? void 0 : _t._id,
                    }
                },
                {
                    following: {
                        $in: (_u = req.user) === null || _u === void 0 ? void 0 : _u._id,
                    }
                }
            ]
        });
        users.map(item => {
            var _a;
            if (!((_a = group.groupMembers) === null || _a === void 0 ? void 0 : _a.includes(item._id))) {
                invites.push(item);
            }
        });
        //console.log(invites)
        res.json({
            message: 'Invitations fetched',
            user: invites,
            sentInvites: group.sentInvites
        });
    }
    catch (error) {
        res.status(500).send({ messge: 'Server Error', error });
    }
}));
exports.inviteToGroup = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _v, _w, _x;
    const { userId, groupName, groupId } = req.body;
    try {
        const notification = yield notification_1.default.create({
            content: `${(_v = req.user) === null || _v === void 0 ? void 0 : _v.firstName} ${(_w = req.user) === null || _w === void 0 ? void 0 : _w.lastName} Invited you to join the group ${groupName}`,
            forItem: "invite",
            itemId: groupId,
            author: (_x = req.user) === null || _x === void 0 ? void 0 : _x._id,
            targetedAudience: [userId],
        });
        yield Group_1.default.findByIdAndUpdate(groupId, {
            $addToSet: { sentInvites: userId }
        });
        res.json({
            message: 'Invitation sent'
        });
    }
    catch (error) {
        res.status(500).send({ messge: 'Server Error', error });
    }
}));
