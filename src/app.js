require("dotenv").config();
const express = require('express');
const connectDb=require("./config/database"); 
const cookieParser = require("cookie-parser");
const app = express();
const cors=require("cors");
app.use(cors({
    origin: true,
    credentials:true,
}));

app.use(express.json()); //it convert json data coming from postman to java script object
app.use(cookieParser());

const authRouter=require("./routes/auth");
const profileRouter = require("./routes/profile");
 const connectionRouter=require("./routes/requests");
 const uploadRouter = require("./routes/uploadRouter");
const userRouter=require("./routes/user"); 

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/", connectionRouter);
app.use("/",userRouter);
app.use("/", uploadRouter);

connectDb().then(()=>{
console.log(" Database Connection Established");
app.listen(5000 , ()=>{
    console.log("Server is successfully running at 5000...");
 });}).catch((err)=>{
    console.error(" cannot connect !");
});


 
