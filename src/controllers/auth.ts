import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import { setTokenCookie } from "../utils/auth-cookie";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

//@Route /api/login
//@Desc login User
//@Access Public

//@ts-ignore
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

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
