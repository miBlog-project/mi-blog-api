import { database } from "../database.js";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const updateProfilePic = (req, res) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json("Unauthorized");
  }
    
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, userInfo) => {
    if (err) {
      return res.status(403).json("Invalid token");
    }
  
    const query = "UPDATE users SET `image`=? WHERE `id` = ?";
  
    const value = [req.body.image];
  
    database.query(query, [value, userInfo.id], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      return res.json("Profile image successfully uploaded");
    });
  });
}