import cloudinary from "cloudinary";
import { Request, Response } from "express";
import streamifier from "streamifier";
import Comment from "../models/Comment";
import Post, { IPost } from "../models/Post";
import User from "../models/User";
// Get all posts from database

// 广场上的公共推文
const getPublicPosts = async (req: Request, res: Response) => {
  const posts = await Post.find({ visibility: "public" }).sort({
    createdAt: -1,
  });
  if (posts) {
    res.json(posts);
  } else {
    res.status(404);
    throw new Error("Error while getting posts");
  }
};

// Get posts by user id，点击某用户界面，查看其个人推文；
const getPrivatePosts = async (req: Request, res: Response) => {
  const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
  if (posts) {
    res.json(posts);
  } else {
    res.status(404);
    throw new Error("Error while getting posts");
  }
};

// Get Request to find a post by id
const getPostById = async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).send("Post not found");
  }
};

let streamUpload = (req: any) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.v2.uploader.upload_stream( {
      folder: "photos"
    } ,(error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
};

// A Delete Request which can delete a post
const deletePost = async (req: Request, res: Response) => {
  const postId: string = req.params.id;
  const userId: string = req?.user?._id;
  const post = await Post.findOne({ _id: postId });
  const postUserId: string | any = post?.user;
  try{
    if (postUserId?.toString() === userId?.toString()) {
      const deletePostById = await Post.findByIdAndDelete(postId);
      const deletePostComments = await Comment.deleteMany({ postID: postId });
      if(post?.image) {
        cloudinary.v2.uploader.destroy(post.image);
      }
      res.status(200).json({ message: "Post deleted successfully" });
    }
  }
  catch(err) {
    res.status(500).send({ message: "Something goes wrong" });
  }
};

// A Request which can like a post
const likePost = async (req: Request, res: Response) => {
  try {
    // findOneAndUpdate(query, { $set: { name: 'jason bourne' }}, options, callback)
    const postById = await Post.findByIdAndUpdate(req.body.id, {
      $addToSet: { likes: [req.user._id] },
    });
    return res.json({ message: "Post liked successfully", isLiked: true });
  } catch (err) {
    return err;
  }
};

// A Request which can unlike a post
const unlikePost = async (req: Request, res: Response) => {
  try {
    const postById = await Post.findByIdAndUpdate(req.body.id, {
      $pull: { likes: req.user._id },
    });
    return res.json({ message: "Post unliked successfully", isLiked: false });
  } catch (err) {
    return err;
  }
};

// A Request which can create posts
const addPost = async (req: Request, res: Response) => {
  const post: IPost = new Post({
    user: req.user._id,
    username: req.user.username,
    avatar: req.user.avatar,
    text: req.body.text,
    createdAt: Date.now(),
    visibility: req.body.visibility,
  });
  if(req.file) {
    const result:any = await streamUpload(req);
    post.image = result.secure_url;
  }

  const userById: any = await User.findById(req.user._id);
  const newPost = await post.save();
  userById.posts.push(post);

  if (userById) {
    const pushedPost = await userById.save();
  }

  if (newPost) {
    res.json(newPost);
  } else {
    res.status(404).send("Error while creating post");
  }
};

export {
  addPost,
  getPublicPosts,
  unlikePost,
  likePost,
  getPrivatePosts,
  deletePost,
};