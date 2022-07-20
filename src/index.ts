import express, { Application, Response } from "express";
import { config } from "dotenv";
import connectDB from "./lib/db";
//import fileUpload from 'express-fileupload'
import cors from "cors";

//route imports
import usersRoute from "./routes/user";
import authRoute from "./routes/auth";
import groupsRoute from "./routes/group";
import postsRoute from "./routes/post";
import gistRoutes from "./routes/gist";
import commentsRoute from "./routes/comment";
import feedRoutes from "./routes/feed";
import LikeRoutes from "./routes/like";
import BookmarkRoutes from "./routes/bookmark";
import searchRoutes from "./routes/search";
import chatRoutes from './routes/chat'

//dotenv config
config();
const app: Application = express();

//connectDB
connectDB();
app.use(cors());
app.use(express.json());
//app.use(fileUpload({
//limits: { fileSize: 50 * 1024 * 1024 },
//}));

app.use("/api/search", searchRoutes);
app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/posts", postsRoute);
app.use("/api/gists", gistRoutes);
app.use("/api/comments", commentsRoute);
app.use("/api/feed", feedRoutes);
app.use("/api/likes", LikeRoutes);
app.use("/api/bookmarks", BookmarkRoutes);
app.use("/api/chats", chatRoutes);

app.get("/", (res: Response) => res.send("Hello"));

app.listen(process.env.PORT, () =>
  console.log(`Express app running on ${process.env.PORT}`)
);
