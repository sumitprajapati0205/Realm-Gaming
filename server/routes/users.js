import express from "express";
import {update, deleteUser , dislike, getUser, like, subscribe, unsubscribe, watchHistory} from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js";

const router = express.Router()

//update user
router.put("/:id", verifyToken,update)

//delete user
router.delete("/:id",verifyToken, deleteUser);

//get a user
router.get("/find/:id", getUser);

//subscribe a user, id is of subscribing channel
router.put("/sub/:id", verifyToken, subscribe);

//unsubscribe a user
router.put("/unsub/:id", verifyToken, unsubscribe);

//watchedVideo
router.put("/history/:videoId", verifyToken, watchHistory);

//like a video
router.put("/like/:videoId",verifyToken, like);

//dislike a video
router.put("/dislike/:videoId",verifyToken, dislike);

export default router;