const express = require('express');
// creating router
 const authRouter = express.Router();

const {validateSignUp}= require("../utils/validation"); 
 const User =require("../models/user");
 const bcrypt=require("bcryptjs");
 const jwt = require("jsonwebtoken");
  
//1. ADDING NEW USER or SIGNUP
 authRouter.post("/signup", async (req,res)=>{
   try{
//validation of data
    validateSignUp(req);
    const {firstName,lastName,emailId,password}=req.body;
//encrypting password
    const passwordHash = await bcrypt.hash(password,10); 
    
    const user =new User({
       firstName,lastName,emailId,
       password:passwordHash,}
    )
    const savedUser=await user.save();
    // creating JWT (JSON web token)
      const token=await savedUser.getJWT();
//adding token to cookie and sending response
      res.cookie("token",token,{
         httpOnly: true,
   secure: true,
   sameSite: "none",
         expires:new Date(Date.now()+8*3600000),
         });
    res.json({message:"User created successfully", user: savedUser});
 }
 catch(err){
    res.status(400).send("Error :"+ err.message);
 }
 });

//2. LOGIN     
authRouter.post("/login",async (req,res)=>{
   try{
   const {emailId,password}=req.body;
   const user= await User.findOne({emailId:emailId});
   if(!user){
      throw new Error("User not found");
   }
    const isPasswordValid= await user.validatePassword(password);
    if(isPasswordValid){

// creating JWT (JSON web token)
      const token=await user.getJWT();
      
//adding token to cookie and sending response
      res.cookie("token",token,{
         httpOnly: true,
   secure: true,
   sameSite: "none",
         expires:new Date(Date.now()+8*3600000),
         });
      res.send(user.firstName +" "+ user.lastName + " : Loggedin Successfully !!");}
      else{
         throw new Error("Invalid Password");
      }
   }
   catch(err){
      res.status(400).send("ERROR : "+ err.message);
   }
});

// Logout user
authRouter.post("/logout", async (req,res)=>{
   res.cookie("token",null,{
      expires:new Date(Date.now()),
      httpOnly:true,
      secure:true,
      sameSite:"none"
   }).send(user.firstName +" "+ user.lastName + " : Logout Succesfull !!");
});

 module.exports=authRouter;
   



