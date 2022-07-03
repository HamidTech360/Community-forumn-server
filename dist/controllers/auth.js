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
exports.register = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const auth_cookie_1 = require("../utils/auth-cookie");
const token_1 = require("../utils/token");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mailer_1 = require("../lib/mailer");
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
        //else if (user.status === "pending") {
        //   console.log(user.status);
        //   return res
        //     .status(401)
        //     .json({ message: "Please activate your account first" });
        // }
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
//@ts-ignore
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
            });
            yield user.save();
            (0, mailer_1.sendMail)(user.email, `<h1>Email Confirmation</h1>,<p>Hi ${user.firstName}, welcome to Setlinn.  <a href=${process.env.NODE_ENV === "production"
                ? `https://settlin.vercel.app/activate/${token}`
                : `http://localhost:3000/activate/${token}`}>Please use this link to activate your account.</a></p>`, "Activate your account");
            res.status(201).json(user);
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
