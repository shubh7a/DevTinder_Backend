const express =require('express');
const profileRouter = express.Router();
const User =require("../models/user");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth}=require("../middlewares/auth");
const {validatEditProfileData}= require("../utils/validation") 
//1. USER PROFILE 
profileRouter.get("/profile/view",userAuth,async (req,res)=>{
   try{
   const user=req.user;
   res.send(user); 
}
catch(err){
   res.status(400).send("ERROR : "+ err.message);
   }
});

//2. USER EDIT

profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validatEditProfileData(req)){
            throw new Error("invalid Edit Request");
        }
       const loggedInUser = req.user;
      // console.log(loggedInUser);
       Object.keys(req.body).forEach((key)=>(
        loggedInUser[key]=req.body[key]
));
console.log(Object.keys(req.body));
     //  console.log(loggedInUser);

     await loggedInUser.save();

// res.send(`${loggedInUser.firstName}, Profile Updated Successfully `);
       
//OR

       res.json({
        message: `${loggedInUser.firstName}, Profile Updated Successfully`,
        data : loggedInUser,
       })
       }
    catch(err){
        res.status(400).send("Error : "+ err.message);
    }
});


module.exports=profileRouter;