import { config } from "dotenv";
import connectDB from "./lib/db";

//Configure env vars
config();

//Connect App to Mongo database
connectDB();
