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
exports.updateUser = exports.getUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
//@route: /api/users
//@method: GET
//@access: public
exports.getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const perPage = Number(req.query.perPage) || 25;
        const count = yield User_1.default.find().estimatedDocumentCount();
        const numPages = count / perPage;
        const users = yield User_1.default.find().sort({ createdAt: -1 }).limit(perPage);
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
