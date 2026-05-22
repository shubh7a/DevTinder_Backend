 const jwt =require("jsonwebtoken");
 const User=require("../models/user")

const cookieParser = require("cookie-parser");

 const userAuth = async(req,res,next)=>{
   try{
      const {token}=req.cookies;
   if(!token){
     return res.status(401).send("Please Login ! ");
   }
const decodedata=await jwt.verify(token,"DEV@Tinder$798");
const {_id}=decodedata;
const user =await User.findById(_id);
if(!user){
   throw new Error("please login again");
}
req.user=user;
      next();
   }
      catch(err){
         res.status(400).send("ERROR : "+ err.message);
      }
   
 };
 module.exports={
    userAuth  ,
 }