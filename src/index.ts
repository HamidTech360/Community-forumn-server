import express, { Application } from "express";
import { config } from "dotenv";
import usersRoute from "./routes/user";
import connectDB from "./lib/db";
import authRoute from "./routes/auth";
//dotenv config
config();
const app: Application = express();

//connectDB
connectDB();

app.use(express.json());

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);

app.listen(process.env.PORT, () =>
  console.log(`Express app running on ${process.env.PORT}`)
);
