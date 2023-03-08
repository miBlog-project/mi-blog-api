import express from 'express';
import { getAllPosts, getSinglePost, createPost, deletePost, updatePost } from '../controllers/post.js';

const router = express.Router();

router.get("/", getAllPosts);
router.get("/:id", getSinglePost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

export default router;