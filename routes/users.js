import express from 'express';
import { updateProfilePic } from '../controllers/user.js';

const router = express.Router();

router.post("/", updateProfilePic);

export default router;