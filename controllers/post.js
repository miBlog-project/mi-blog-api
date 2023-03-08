import { database } from "../database.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const getAllPosts = (req, res) => {
  const query = req.query.cat ? "SELECT * FROM posts WHERE cat=?" : "SELECT * FROM posts";

  database.query(query, [req.query.cat], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(data);
  });
}

export const getSinglePost = (req, res) => {
  const query = "SELECT `username`, `title`, `desc`, posts.id, posts.img, `image`, `cat`, `date` FROM users JOIN posts ON users.id=posts.userid WHERE posts.id = ?";

  database.query(query, [req.params.id], (err, data) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(200).json(data[0]);
  });
}

export const createPost = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Unauthorized");
  }
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Invalid token");
    }

    const query = "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `userid`) VALUES (?)";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id
    ];

    database.query(query, [values], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.json("Post successfully created");
    });
  });
}

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Unauthorized");
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Invalid token");
    }

    const postId = req.params.id;
    
    const query = "DELETE FROM posts WHERE `id` = ? AND `userid` = ?";

    database.query(query, [postId, userInfo.id], (err, data) => {
      if (err) {
        return res.status(403).json("Unauthorized to delete post");
      }

      return res.status(200).json("Post successfully deleted");
    });
  });
}  

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Unauthorized");
  }
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Invalid token");
    }

    const postId = req.params.id;

    const query = "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=? WHERE `id` = ? AND `userid` = ?";

    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
    ];

    database.query(query, [...values, postId, userInfo.id], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }

      return res.json("Post successfully updated");
    });
  });
}  