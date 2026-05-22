const express = require("express");
const userRouter=express.Router();
const {userAuth}=require("../middlewares/auth"); 
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const USER_SAFE_DATA = "firstName lastName photoURL age gender about skills ";

// Getting all pending connection request for logged in user
userRouter.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const loggedInUser =req.user;
        const connectionRequests=await ConnectionRequestModel.find({
            toUserId:loggedInUser,
            status:"interested",
        }).populate("fromUserId" ,USER_SAFE_DATA);
        res.json({
            message:"Data Fetched Successfully ",
            data:connectionRequests,
        });
    }catch(err){
        res.status(400).send("Error : "+ err.message);
    }
});

//Getting all connections loggedIn user
userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser =req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            $or:[
                {toUserId:loggedInUser._id ,status:"accepted"},
                {fromUserId:loggedInUser._id , status:"accepted"},
            ],
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA);
        const data =connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
        }
        return row.fromUserId;
    });
        res.json({data});
    }catch(err){
        res.status(400).send("Error : "+ err.message);
    }
});

// Feed API for loggedIn user
userRouter.get("/feed",userAuth,async(req,res)=>{
    try{
        //user should all cards except :-
        // his own card
        // his oonections
        // ignored people
        // sent connnections
        const loggedInUser = req.user;
// limiting users per page in feed 
        const page= parseInt(req.query.page) || 1;
        let limit=parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit ;
        const skip= (page - 1)*limit ;
// find all connection requests (sent + recieved)
        const connectionRequests =await ConnectionRequestModel.find({
            $or:[
                {fromUserId:loggedInUser._id },
                { toUserId : loggedInUser._id }
            ]
        }).select("fromUserId toUserId");    //.populate("fromUserId","firstName").populate("toUserId","firstName");
    
        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(
            (req)=>{
            hideUsersFromFeed.add(req.fromUserId._id.toString());
            hideUsersFromFeed.add(req.toUserId._id.toString());
        }
    );

    //finding Users for feed
    const users = await User.find({
        $and:[
            {_id:{$nin :Array.from(hideUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
        ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);
    res.send({data:users});
    }catch(err){
        res.status(400).send("Error : "  + err.message);
    }
});
module.exports=userRouter;