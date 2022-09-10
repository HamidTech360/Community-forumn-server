import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import expressAsyncHandler from "express-async-handler";
import User, { IUserSchema } from "../models/User";
import { setTokenCookie } from "../utils/auth-cookie";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { SendMail } from "../utils/mail";
import { SignUpMailTemplate, forgotPasswordEmailTemplate } from "../templates/mail";
import { AnyKeys, AnyObject } from "mongoose";
import { Token } from "../models/tokens";
import bcrypt from 'bcryptjs'
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
    else if (user.status === "pending") {
      console.log(user.status);
      return res
        .status(401)
        .json({ message: "Please activate your account first" });
    }
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
        username:firstName
      });

      await user.save();
      const accessToken = generateAccessToken({ sub: user._id });
      //send mail

      SendMail({
        targetEmail:[{
          email,
          name:firstName
        }],
        subject:'Welcome to Settlin',
        htmlContent:SignUpMailTemplate(`${process.env.CLIENT_BASE_URL}/comfirm/${token}`)
      })

      res.status(201).json({
        message:'New account created',
        user
      });
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
   
    try {
      const user = await User.findById(id).populate("followers following", "-password");

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
    console.log("db", dbUser);
    console.log("new", newUser);
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


export const updatePasssword = asyncHandler(
  async(req:any, res:Response)=>{
    const {oldPassword, newPassword} = req.body
    try{
      const user = await User.findById(req.user?._id)
      if(!(await user.matchPassword(oldPassword))){
         res.status(401).send('Incorrect password')
         return
      }
     const salt = await bcrypt.genSalt(10);
     const password = await bcrypt.hash(newPassword, salt);

     await User.findByIdAndUpdate(req.user?._id, {password})
     res.json({
      message:'Password updated'
     })

    }catch(err){
      res.status(500).send(err)
    }
  }
)

export const verifyEmail = asyncHandler(
  async(req:any, res:Response)=>{
    const {code} = req.body
    try{
      let user = await User.findOne({confirmationCode:code})
      if(!user) {
        res.status(401).send('User not found, failed to verify user')
        return
      } 

      
      user.status = 'verified'
      await user.save()
      res.json({
        message:'Email verified sucessfully'
      })


    }catch(error){
      res.status(500).send('Failed to verify email')
    }
  }
)

export const ForgotPassword = asyncHandler(
  async(req:Request, res:Response)=>{
    const {email} = req.body
    try{
      let token 
      const user = await User.findOne({email})
      if(!user) {
        res.status(401).send('User with this email does not exist')
        return
      }
      
    const findToken = await Token.findOne({userEmail:email})
    if(!findToken){
      token = Math.floor(Math.random()* (999999-100000) + 1000000)
      await Token.create({
        token,
        userEmail:email
       })
    }else{
      token = findToken.token
    }
     
     SendMail({
      targetEmail:[{
        email
      }],
      subject:'Password Reset',
      htmlContent:forgotPasswordEmailTemplate(`${process.env.CLIENT_BASE_URL}/reset-password?token=${token}&user=${email}`)
    })
     res.json({
      message:'Reset link has been sent to your email'
     })
    }catch(error){
      res.status(500).send('Server error')
    }
  }
)

export const ResetPassword = asyncHandler(
  async(req:Request ,res:Response)=>{
    try{
      const {password, email, token} = req.body
      const verifyToken = await Token.findOne({userEmail:email, token})
      if(!verifyToken){
        res.status(403).send('Unauthorized access')
        return
      }
      const user = await User.findOne({email})
      const salt = await bcrypt.genSalt(10);
 
      const hashedPassword = await bcrypt.hash(password, salt)

     
      console.log(`new password is ${hashedPassword }`)

      await User.findByIdAndUpdate(user._id, {password:hashedPassword})
      res.json({message:'password reset successful'})
      
    }catch(error){
      res.status(500).send('Server error')
    }
  }
)