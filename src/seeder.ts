import mongoose from "mongoose";
import dotenv from "dotenv";

import users from "./data/users";
import posts from "./data/posts";
import User from "./models/User";
import Post from "./models/Post";
import connectDB from "./lib/db";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const samplePosts = posts.map((post) => {
      return { ...post, author: adminUser };
    });

    await Post.insertMany(samplePosts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
