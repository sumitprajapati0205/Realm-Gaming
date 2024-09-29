import express from "express";
import { addVideo, addView, getByTag, getVideo, random, search, sub, trend,deleteVideo, myVideo, history} from "../controllers/video.js";
import {verifyToken} from "../verifyToken.js"

const router = express.Router();

//create a video
//.post request is used to create new data
router.post("/", verifyToken, addVideo);
//You can edit and update a particular account through a PUT request.
router.put("/:id", verifyToken, addVideo);
//You can delete users and data using the DELETE request method.
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/history",verifyToken, history);
router.get("/sub", verifyToken, sub);
router.get("/tags", getByTag);
router.get("/search", search);
router.get("/myVideo",verifyToken, myVideo);


export default router; 
