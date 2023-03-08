import { database } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const registerUser = (req, res) => {
  // Check if user is already in database
  const query = "SELECT * FROM users WHERE email = ? OR username = ?";

  database.query(query, [req.body.email, req.body.username], (err, data) => {
    if (err) {
      return res.json(err);
    }

    if (data.length) {
      return res.status(409).json("Already registered");
    }

    // Create a new user
    // Encrypt password using bcrypt
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    // Insert new user into database
    const query = "INSERT INTO users(`email`, `username`, `password`) VALUES (?)";
    const values = [req.body.email, req.body.username, hash];

    database.query(query, [values], (err, data) => {
      if (err) {
        return res.json(err);
      }

      return res.status(200).json("User created");
    });
  });
}

export const loginUser = (req, res) => {
  // Check if user is already in database
  const query = "SELECT * FROM users WHERE username = ?";

  database.query(query,[req.body.username], (err, data) => {
    if (err) {
      return res.json(err);
    }

    if (data.length === 0) {
      return res.status(404).json("User not found");
    }

    // Check if password is correct for given username
    const correctPassword = bcrypt.compareSync(req.body.password, data[0].password);

    if(!correctPassword) {
      return res.status(400).json("Invalid login credentials");
    }

    const token = jwt.sign({id: data[0].id}, process.env.JWT_SECRET_KEY);
    const { password, ...otherUserInfo } = data[0];

    res.cookie("access_token", token, {
      httpOnly: true
    }).status(200).json(otherUserInfo);
  });
}

export const logoutUser = (req, res) => {
  // Clear cookie to logout user
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User successfully logged out");
}