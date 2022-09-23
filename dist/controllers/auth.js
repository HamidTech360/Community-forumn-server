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
exports.ResetPassword = exports.ForgotPassword = exports.verifyEmail = exports.updatePasssword = exports.oauth = exports.getCurrentUser = exports.register = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const auth_cookie_1 = require("../utils/auth-cookie");
const token_1 = require("../utils/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = require("../utils/mail");
const mail_2 = require("../templates/mail");
const Tokens_1 = require("../models/Tokens");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dataNormalizer_1 = require("../utils/dataNormalizer");
//@Route /api/login
//@Desc login User
//@Access Public
//@ts-ignore
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email, password, remember } = req.body;
        const user = yield User_1.default.findOne({
            email,
        });
        if (!user) {
            return res.status(400).json({
                message: `User with email ${email} does not exist`,
                key: "email",
            });
        }
        else if (!(yield user.matchPassword(password))) {
            return res
                .status(400)
                .json({ message: "Password is incorrect", key: "password" });
        }
        else if (user.status === "pending") {
            console.log(user.status);
            return res
                .status(401)
                .json({ message: "Please activate your account first" });
        }
        else {
            const accessToken = (0, token_1.generateAccessToken)({ sub: user._id });
            const refreshToken = (0, token_1.generateRefreshToken)({ sub: user._id });
            if (remember) {
                (0, auth_cookie_1.setTokenCookie)(res, refreshToken);
                res.json({ accessToken, refreshToken });
            }
            else {
                res.json({ accessToken, refreshToken });
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json("Something went wrong");
    }
}));
//@Route /api/register
//@Desc register User
//@Access Public
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, password, email, otherNames, interests, address, gender, } = req.body;
        const token = jsonwebtoken_1.default.sign({ email: email }, process.env.JWT_SECRET);
        const userExists = yield User_1.default.findOne({
            email,
        });
        if (!userExists) {
            let user = new User_1.default({
                firstName,
                lastName,
                password,
                email,
                otherNames,
                address,
                interests,
                gender,
                confirmationCode: token,
                username: firstName,
            });
            yield user.save();
            const accessToken = (0, token_1.generateAccessToken)({ sub: user._id });
            //send mail
            (0, mail_1.SendMail)({
                targetEmail: [
                    {
                        email,
                        name: firstName,
                    },
                ],
                subject: "Welcome to Settlin",
                htmlContent: (0, mail_2.SignUpMailTemplate)(`${process.env.CLIENT_BASE_URL}/comfirm/${token}`),
            });
            res.status(201).json({
                message: "New account created",
                user,
            });
        }
        else {
            res.status(403).json({ error: "User already exists" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: error, message: "Something went wrong" });
    }
}));
exports.getCurrentUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    try {
        const user = yield User_1.default.findById(id).populate("followers following", "-password");
        res.json(user);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
//@ts-ignore to check later
exports.oauth = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = String(req.query.provider).toUpperCase();
    if (!provider) {
        return res.status(400).json("Provider not set");
    }
    let userData;
    switch (provider) {
        case "GOOGLE":
            userData = yield (0, dataNormalizer_1.normalizeGoogleData)(req.body);
            break;
        case "FACEBOOK":
            yield (0, dataNormalizer_1.normalizeFacebookData)(req.body);
            break;
        default:
            break;
    }
    const dbUser = yield User_1.default.findOne({ email: userData === null || userData === void 0 ? void 0 : userData.email }).select("+authProvider");
    let accessToken, refreshToken;
    console.log(userData);
    if (!dbUser) {
        const newUser = new User_1.default(Object.assign(Object.assign({}, userData), { images: {
                avatar: userData === null || userData === void 0 ? void 0 : userData.avatar,
            } }));
        console.log("db", dbUser);
        console.log("new", newUser);
        const savedUser = yield newUser.save();
        accessToken = (0, token_1.generateAccessToken)({ sub: savedUser._id });
        refreshToken = (0, token_1.generateRefreshToken)({ sub: savedUser._id });
        return res.status(201).json({ accessToken, refreshToken });
    }
    if (dbUser.authProvider !== (userData === null || userData === void 0 ? void 0 : userData.authProvider)) {
        return res.status(409).json({
            message: "User with this email is associated with a different provider",
        });
    }
    accessToken = (0, token_1.generateAccessToken)({ sub: dbUser._id });
    refreshToken = (0, token_1.generateRefreshToken)({ sub: dbUser._id });
    return res.status(200).json({ accessToken, refreshToken });
}));
exports.updatePasssword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = yield User_1.default.findById((_b = req.user) === null || _b === void 0 ? void 0 : _b._id);
        if (!(yield user.matchPassword(oldPassword))) {
            res.status(401).send("Incorrect password");
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const password = yield bcryptjs_1.default.hash(newPassword, salt);
        yield User_1.default.findByIdAndUpdate((_c = req.user) === null || _c === void 0 ? void 0 : _c._id, { password });
        res.json({
            message: "Password updated",
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
exports.verifyEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.body;
    try {
        let user = yield User_1.default.findOne({ confirmationCode: code });
        if (!user) {
            res.status(401).send("User not found, failed to verify user");
            return;
        }
        user.status = "verified";
        yield user.save();
        res.json({
            message: "Email verified sucessfully",
        });
    }
    catch (error) {
        res.status(500).send("Failed to verify email");
    }
}));
exports.ForgotPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        let token;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).send("User with this email does not exist");
            return;
        }
        const findToken = yield Tokens_1.Token.findOne({ userEmail: email });
        if (!findToken) {
            token = Math.floor(Math.random() * (999999 - 100000) + 1000000);
            yield Tokens_1.Token.create({
                token,
                userEmail: email,
            });
        }
        else {
            token = findToken.token;
        }
        (0, mail_1.SendMail)({
            targetEmail: [
                {
                    email,
                },
            ],
            subject: "Password Reset",
            htmlContent: (0, mail_2.forgotPasswordEmailTemplate)(`${process.env.CLIENT_BASE_URL}/reset-password?token=${token}&user=${email}`),
        });
        res.json({
            message: "Reset link has been sent to your email",
        });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
exports.ResetPassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, email, token } = req.body;
        const verifyToken = yield Tokens_1.Token.findOne({ userEmail: email, token });
        if (!verifyToken) {
            res.status(403).send("Unauthorized access");
            return;
        }
        const user = yield User_1.default.findOne({ email });
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        console.log(`new password is ${hashedPassword}`);
        yield User_1.default.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.json({ message: "password reset successful" });
    }
    catch (error) {
        res.status(500).send("Server error");
    }
}));
