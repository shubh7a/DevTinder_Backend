const express =require("express");
const connectionRouter=express.Router();

const {userAuth}=require("../middlewares/auth"); 
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
// SENING CONNECTION REQUEST
  
 connectionRouter.post("/request/send/:status/:toUserId",
   userAuth,async(req,res)=>{
try{   
      const fromUserId =req.user._id;
      const toUserId=req.params.toUserId;
      const status=req.params.status;
        const allowedStatus = ["ignored","interested"];
       if(!allowedStatus.includes(status)){
         return res.status(400).json({message:"Invalid status type : "+ status});
      }
      const toUser = await User.findById(toUserId);
      if(!toUser){
         return res.status(400).json({message:"User not found "});
      }
      const existingConnectionRequest= await ConnectionRequestModel.findOne({
         $or:[
            {fromUserId,toUserId},
            {fromUserId:toUserId,toUserId:fromUserId },
         ],
      });
      if(existingConnectionRequest){
         return res.status(400).send({
            message:"Connection Request already exits" });
      }
      const connectionRequest=new ConnectionRequestModel({
         fromUserId,
         toUserId,
         status,
      });
      const data=await connectionRequest.save();
      res.json({
         //message:"Connection Request sent successfully",
         message: req.user.firstName +" sent connection request to "+ toUser.firstName,
         data,
      });
}catch(err){
   res.status(400).send("Error : "+ err.message);
}
});

connectionRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
   try{
      const loggedInUser = req.user;
      const {status,requestId}=req.params;
      const allowedStatus=["accepted","rejected"];
      if(!allowedStatus.includes(status)){
         return res.status(400).json({message:"Invalid Status Type : "+ status});
}
const connectionRequest=await ConnectionRequestModel.findOne({
   _id:requestId,
   toUserId:loggedInUser._id,
   status:"interested",
})
if(!connectionRequest){
   return res.status(400).json({message:"Connection Request not found"});
}
connectionRequest.status=status;
const data=await connectionRequest.save();
res.json({
   message:"Connection Request of "+ " is " + status +" successfully",
   data,
});
   }catch(err){
      res.status(400).send("Error : "+ err.message);
   }
});

module.exports=connectionRouter;