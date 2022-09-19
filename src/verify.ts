import connectDB from "./lib/db";
import User from "./models/User";
import dotenv from "dotenv";
dotenv.config();
connectDB();
const updateUser = async () => {
  await User.updateMany(
    { status: "pending" },
    { $set: { status: "verified" } }
  );
};

updateUser().then(() => console.log("set verified"));
