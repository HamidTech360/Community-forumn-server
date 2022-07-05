import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post";
import Comment from "../models/Comment";
//@Route /api/posts
//@Method POST
//@Access: LoggedIn
export const createPost = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const { postTitle, postBody } = req.body;

    const post = await Post.create({
      postTitle,
      postBody,
      author: req?.user?._id,
    });
    res.status(201).json({ msg: "Post created", post });
  }
);

//@Route /api/posts
//@Method Get
//@Access: Public
export const getPosts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const posts = await Post
    .find({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    })
    .sort({createdAt:-1})
    .populate("author", "-password");
    res.status(200).json({ msg: "Posts retrieved", posts });
  }
);

//@Route /api/posts/:id
//@Method Get
//@Access: Public
export const getPost = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "firstName lastName")
      .where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
    if (post) {
      res.status(200).json({ msg: "Posts retrieved", post });
    } else {
      res.status(404).json({ msg: "Post not found" });
    }
  }
);

//@Route /api/posts/:id
//@Method Delete
//@Access: LoggedIn
export const deletePost = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const postId = req.params.id;
    const post = await Post.findById(postId).where({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (post && post.author.toString() === req?.user?._id.toString()) {
      post.deleted === true;
      await post.save();
      res.status(200).json({ msg: "Post deleted" });
    } else {
      res.status(404).json({ msg: "Post not found" });
    }
  }
);

//@Route /api/posts/:id
//@Method Put
//@Access: LoggedIn
export const updatePost = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const postId = req.params.id;
    const post = await Post.findById(postId).where({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    if (post && post.author.toString() === req?.user?._id.toString()) {
      const postKeys = Object.keys(req.body);
      for (let i = 0; i < postKeys.length; i++) {
        post[postKeys[i]] = req.body[postKeys[i]];
      }
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ msg: "Post not found" });
    }
  }
);

//@Route /api/posts/:id
//@Method Put
//@Access: LoggedIn
export const likePost = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByIdAndUpdate(postId, {
        $addToSet: { likes: [req.user?._id] },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Liked");
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

//@Route /api/posts/:id/like
//@Method Put
//@Access: LoggedIn
export const deleteLike = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    try {
      const postId = req.params.id;
      const post = await Post.findByIdAndUpdate(postId, {
        $pull: { likes: [req.user?._id] },
      }).where({
        $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      });
      res.status(200).json("Unliked");
    } catch (error) {
      res.status(500).json(error);
    }
  }
);
