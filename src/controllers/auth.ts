import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User, { IUserSchema } from "../models/User";
import { setTokenCookie } from "../utils/auth-cookie";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { sendMail } from "../lib/mailer";
import { AnyKeys, AnyObject } from "mongoose";
import {
  normalizeFacebookData,
  normalizeGoogleData,
} from "../utils/dataNormalizer";
//@Route /api/login
//@Desc login User
//@Access Public

//@ts-ignore
export const login = asyncHandler(async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    const { email, password, remember } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: `User with email ${email} does not exist`,
        key: "email",
      });
    } else if (!(await user.matchPassword(password))) {
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
      const accessToken = generateAccessToken({ sub: user._id });
      const refreshToken = generateRefreshToken({ sub: user._id });

      if (remember) {
        setTokenCookie(res, refreshToken);
        res.json({ accessToken, refreshToken });
      } else {
        res.json({ accessToken, refreshToken });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong");
  }
});

//@Route /api/register
//@Desc register User
//@Access Public

export const register = asyncHandler(async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      password,
      email,
      otherNames,
      interests,
      address,
      gender,
    } = req.body;

    const token = jwt.sign({ email: email }, process.env.JWT_SECRET!);
    const userExists = await User.findOne({
      email,
    });

    if (!userExists) {
      let user = new User({
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

      await user.save();
      sendMail(
        user.email,
        `<h1>Email Confirmation</h1>,<p>Hi ${
          user.firstName
        }, welcome to Setlinn.  <a href=${
          process.env.NODE_ENV === "production"
            ? `https://settlin.vercel.app/activate/${token}`
            : `http://localhost:3000/activate/${token}`
        }>Please use this link to activate your account.</a></p>`,
        "Activate your account"
      );
      res.status(201).json(user);
    } else {
      res.status(403).json({ error: "User already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error, message: "Something went wrong" });
  }
});

export const getCurrentUser = asyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const id = req.user?._id;
    console.log(id);

    try {
      const user = await User.findById(id).populate("followers following");

      res.json(user);
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

//@Route /api/auth/oauth
//@Desc register User
//@Access Public
type authProvider = "GOOGLE" | "FACEBOOK" | "TWITTER" | string;
//@ts-ignore to check later
export const oauth = asyncHandler(async (req: Request, res: Response) => {
  const provider: authProvider = String(req.query.provider).toUpperCase();
  if (!provider) {
    return res.status(400).json("Provider not set");
  }
  let userData;
  switch (provider) {
    case "GOOGLE":
      console.log(req.body);
      userData = await normalizeGoogleData(req.body);
      break;
    case "FACEBOOK":
      await normalizeFacebookData(req.body);
      break;
    default:
      break;
  }
  const dbUser = await User.findOne({ email: userData?.email }).select(
    "+authProvider"
  );
  let accessToken, refreshToken;
  console.log(userData);
  if (!dbUser) {
    const newUser = new User({
      ...userData,
      images: {
        avatar: userData?.avatar,
      },
    });

    console.log(newUser);
    const savedUser = await newUser.save();
    accessToken = generateAccessToken({ sub: savedUser._id });
    refreshToken = generateRefreshToken({ sub: savedUser._id });

    return res.status(201).json({ accessToken, refreshToken });
  }
  if (dbUser.authProvider !== userData?.authProvider) {
    return res.status(409).json({
      message: "User with this email is associated with a different provider",
    });
  }

  accessToken = generateAccessToken({ sub: dbUser._id });
  refreshToken = generateRefreshToken({ sub: dbUser._id });

  return res.status(200).json({ accessToken, refreshToken });
});
