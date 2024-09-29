import mongoose from "mongoose";
import User from "../models/User.js";
//used to hash(to convert into unintelligible set of numbers and letters) a password set by user
import bcrypt from "bcryptjs";
import { createError } from "../error.js";
//give user a token key so that they have authorization to make changes in their account
import jwt from "jsonwebtoken";

export const signup = async(req,res,next)=>{
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return next(createError(422, "please add all the fields"));
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return next(createError(422, "User already exists with the email"));
    }
  });
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({...req.body, password:hash});
        await newUser.save();
        res.status(200).send("User has been created");
    }catch(err){
        next(err); 
    }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong Credentials"));

    //process.env.JWT it is a secret key. When you receive a JWT from the client, you can verify that JWT with this that secret key stored on the server.
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    //to separate password
    const { password, ...others } = user._doc;

    //to send token to user we use cookies
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async(req,res,next)=>{
  try {
    const user = await User.findOne({email:req.body.email});
    if(user){
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    }
    else{
      const newUser = new User({
        ...req.body,
        fromGoogle:true,
      })
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (err) {
      next(err);
  }
}