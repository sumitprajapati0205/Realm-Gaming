import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
//async function mean that the task is not dependent on other one.
//sync, the execution of each operation is dependent on the completion of the one before it

export const update = async(req,res,next)=>{
    //user.id is id through jwt and params.id is the id using currently.
    if(req.params.id === req.user.id){
        try{
           const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
              $set:req.body,
           },
           //new: true returns the newest version of the user
           {new: true}
           );
           res.status(200).json(updatedUser)
        }catch(err){
           next(err)
        }
    }else{
        return next(createError(403,"You can update only your account"))
    }
}

export const deleteUser = async (req, res, next) => {
    if(req.params.id === req.user.id){
        try{
           await User.findByIdAndDelete(
            req.params.id,
           );
           res.status(200).json("User has been deleted.")
        }catch(err){
           next(err);
        }
    }else{
        return next(createError(403,"You can delete only your account"))
    }
};

export const getUser= async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    }catch(err){
        next(err)
    }
};

export const subscribe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id,{
            $push:{subscribedUsers:req.params.id}
        });
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:1}
        });
        res.status(200).json("Subscription successfull.");

    }catch(err){
        next(err)
    }
};

export const unsubscribe = async (req, res, next) => {
    try{
        await User.findByIdAndUpdate(req.user.id,{
            $pull:{subscribedUsers:req.params.id}
        });
        await User.findByIdAndUpdate(req.params.id,{
            $inc:{subscribers:-1}
        });
        res.status(200).json("Unsubscription successfull.");

    }catch(err){
        next(err)
    }
};

export const watchHistory = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    // console.log(videoId);
    try {
        await User.findByIdAndUpdate(id,{
            $push: {watchedVideos: videoId}
        })
        console.log("Video seen");
        res.status(200).json("Video added to watch history.");
    } catch (err) {
        next(err)
    }
};

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try{
        await Video.findByIdAndUpdate(videoId,{
            //addtoset ensures in likes array id is only one time.
            $addToSet:{likes:id},
            $pull:{dislikes:id}
        })
        res.status(200).json("The video has been liked.");
    }catch(err){
        
        next(err)
    }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try{
        await Video.findByIdAndUpdate(videoId,{
            $addToSet:{dislikes:id},
            $pull:{likes:id}
        })
        res.status(200).json("The video has been disliked.");
    }catch(err){
        next(err)
    }
};


