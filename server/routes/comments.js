import express from "express";
import { addComment, deleteComment, getComment } from "../controllers/comment.js";
import {verifyToken} from "../verifyToken";

const router = express.Router();

router.post("/", verifyToken, addComment);
router.delete("/:id", verifyToken, deleteComment);
router.get("/:videoId", verifyToken, getComment);

export default router;
 