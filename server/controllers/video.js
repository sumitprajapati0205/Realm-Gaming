import User from "../models/User.js"
import Video from "../models/Video.js"
import { createError } from "../error.js";

export const addVideo = async (req,res,next)=>{
    const newVideo = new Video({userId:req.user.id, ...req.body});
    try{
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
        
    } catch(err){ 
        //console.log(err);
        next(err);
    }
};
export const updateVideo = async (req,res,next)=>{
    try{
        const video = await Video.findById(req.params.id)
        if(!video)  return next(createError(404, "Video not Found!"))
        if(req.user.id === video.userId){
            const updatedVideo = await Video.findByIdAndUpdate(
                req.params.id,
                {
                    $set:req.body
                },
                {
                    new: true
                }
            );
            res.status(200).json(updatedVideo)
        } else{
            return next(createError(403, "You can update only your video!"))
        }
    } catch(err){
        next(err);
    }
};
export const deleteVideo = async (req,res,next)=>{
    try{
        const video = await Video.findById(req.params.id)
        if(!video)  return next(createError(404, "Video not Found!"))
        if(req.user.id === video.userId){
            await Video.findByIdAndDelete(
                req.params.id,
            );
            res.status(200).json("The video has been deleted")
        } else{
            return next(createError(403, "You can delete only your video!"))
        }
    } catch(err){
        next(err)
    }
};
export const getVideo = async (req,res,next)=>{
    try{
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch(err){
        next(err)
    }
};
export const addView = async (req,res,next)=>{
    try{
        await Video.findByIdAndUpdate(req.params.id, {
            $inc:{views:1}
        })
        res.status(200).json("The view has been increased.")
    } catch(err){
        next(err)
    }
};
export const random = async (req,res,next)=>{
    try{
        //aggregate gives a rondom sample , here random 40 samples
        const videos = await Video.aggregate([{$sample:{size:40}}]);
        res.status(200).json(videos)
    } catch(err){
        next(err)
    }
};

export const trend = async (req,res,next)=>{
    try{
        //-1 brings most viewed videos and 1 brings least viewed. 
        const videos = await Video.find().sort({views:-1});
        // console.log(videos);
        res.status(200).json(videos)
    } catch(err){
        next(err)
    }
};

export const history = async (req,res,next)=>{
    try{
        const user = await User.findById(req.user.id);
        const videos = user.watchedVideos;
        const list = [];
        for (let i = 0; i < videos.length; i++) {
            const item = await Video.findById(videos[i]);
            list.push(item);
        }
        res.status(200).json(list);
    } catch(err){
        next(err);
    }
};

export const sub = async (req,res,next)=>{
    try{
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers;
        //promise.all gives every videos of every channel.
        const list = await Promise.all(
            subscribedChannels.map((channelId)=>{
                return Video.find({userId: channelId});
            })
        );
        //sort to see newest video first
        res.status(200).json(list.flat().sort((a,b)=> b.createdAt-a.createdAt));
    } catch(err){
        next(err)
    }
};
export const getByTag = async (req,res,next)=>{
    const tags = req.query.tags.split(",")
    
    try{
        const videos = await Video.find({tags:{$in:tags}}).limit(20);
        res.status(200).json(videos)
    } catch(err){
        next(err)
    }
};
export const search = async (req,res,next)=>{
    const query = req.query.q;
    try{
      //regex used for matching strings in queries
      //options: i means we want to carry out search without considering upper or lower case.
      const videos = await Video.find({
        title: { $regex: query, $options: "i" },
      }).limit(40);
      res.status(200).json(videos);
    } catch(err){
        next(err)
    }
};

export const myVideo = async (req, res, next) => {
  try {
    
    const videos = await Video.find({
        userId: req.user.id
    });
    res.status(200).json(videos.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    console.log(err);
  }
};