import express, { Application } from "express";
import { config } from "dotenv";
import connectDB from "./lib/db";
import usersRoute from "./routes/user";

import authRoute from "./routes/auth";
import groupsRoute from "./routes/group";
//dotenv config
config();
const app: Application = express();

//connectDB
connectDB().then((conn) => console.log(conn));

app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/groups", groupsRoute);

app.listen(process.env.PORT, () =>
  console.log(`Express app running on ${process.env.PORT}`)
);
