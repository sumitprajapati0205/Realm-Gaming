import express from "express";
import {signup} from "../controllers/auth.js";
import { signin } from "../controllers/auth.js";
import { googleAuth } from "../controllers/auth.js";

const router = express.Router();

//create a user
router.post("/signup", signup);
//sign in
router.post("/signin", signin);
//google authentication
router.post("/google",googleAuth);

export default router;
