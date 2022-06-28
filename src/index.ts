import express, { Application } from "express";
import { config } from "dotenv";
import connectDB from "./lib/db";

//route imports
import usersRoute from "./routes/user";
import authRoute from "./routes/auth";
import groupsRoute from "./routes/group";
import postsRoute from "./routes/post";
import commentsRoute from "./routes/comment";
//dotenv config
config();
const app: Application = express();

//connectDB
connectDB();

app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/groups", groupsRoute);
app.use("/api/posts", postsRoute);
app.use("/api/comments", commentsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Express app running on ${process.env.PORT}`)
);
