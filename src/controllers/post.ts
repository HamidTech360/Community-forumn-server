import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post";
import Comment from "../models/Comment";
import Notification from "../models/notification";
import { File } from "../types";
import { NumberList } from "aws-sdk/clients/iot";
//@Route /api/posts
//@Method POST
//@Access: LoggedIn
export const createPost = expressAsyncHandler(
  async (req: Request & { user?: Record<string, any> }, res: Response) => {
    const { postTitle, postBody, groupId, category, editorContent } = req.body;
    console.log(req.body, req.files)

    const post = await Post.create({
      postTitle,
      postBody,
      author: req?.user?._id,
      groupId,
      category,
      editorContent,
      media: (req.files as [File])?.map((file: File) => file.location),
    });

    const notification = await Notification.create({
      content: `${req.user?.firstName} ${req.user?.lastName} created a post`,
      forItem: "post",
      itemId: post._id,
      author: req.user?._id,
      targetedAudience: [...req.user?.followers],
    });

    res.status(201).json({ msg: "Post created", post });
  }
);

//@Route /api/posts
//@Method Get
//@Access: Public
export const getPosts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const perPage = Number(req.query.perPage) || 25;
    const category = req.query.category;
    const page = Number(req.query.page) || 0;
    let count: number;
    if (category) {
      count = await Post.countDocuments({
        $and: [
          { category },
          { $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }] },
        ],
      });
    } else {
      count = await Post.find().estimatedDocumentCount();
    }
    const numPages = Math.ceil(count / perPage);
    //console.log(req.query.category);

    const posts = await Post.find(
      category
        ? { category }
        : {
            $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
          }
    )
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage)
      .populate("author", "firstName lastName images")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName images",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName images" },
          options: { sort: { createdAt: -1 } },
        },
        options: { sort: { createdAt: -1 } },
      });

    res.json({
      status: "success",
      message: "User posts retrieved",
      posts,
      count,
      numPages,
    });
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
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName images" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName images" },
          options: { sort: { createdAt: -1 } },
        },
        options: { sort: { createdAt: -1 } },
      })
      // .where({
      //   $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
      // });

    // console.log(post, postId)
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
      post.deleted = true;
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
        if (postKeys[i] !== "media") {
          post[postKeys[i]] = req.body[postKeys[i]];
        } else {
          post.media = (req.files as [File])?.map(
            (file: File) => file.location
          );
        }
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

//@Routes /api/posts/user/:id
//Method get
//@ccess: loggedIn
export const getUserPosts = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const perPage = Number(req.query.perPage) || 25;
    const page = Number(req.query.page) || 0;
    const count = await Post.countDocuments({
      $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
    });
    const numPages = Math.ceil(count / perPage);

    const posts = await Post.find({
      $and: [
        {
          $or: [{ deleted: { $eq: false } }, { deleted: { $eq: null } }],
        },
        {
          $or: [
            { author: req?.user?._id },
            { likes: { $in: req?.user?._id } },
            // {following:{"$in":req?.user?._id}}
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(perPage)
      .skip(page * perPage)
      .populate("author", "firstName lastName images")
      .populate({
        path: "comments",
        populate: { path: "author", select: "firstName lastName images" },
      })
      .populate({
        path: "comments",
        populate: {
          path: "replies",
          populate: { path: "author", select: "firstName lastName images" },
          options: { sort: { createdAt: -1 } },
        },
        options: { sort: { createdAt: -1 } },
      });

    res.json({
      status: "success",
      message: "User posts retrieved",
      posts,
      count,
      numPages,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
