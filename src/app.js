// require("dotenv").config();
// const express = require('express');
// const connectDb=require("./config/database"); 
// const cookieParser = require("cookie-parser");
// const app = express();
// const cors=require("cors");
// app.use(cors({
//     origin: true,
//     credentials:true,
// }));

// app.use(express.json()); //it convert json data coming from postman to java script object
// app.use(cookieParser());

// const authRouter=require("./routes/auth");
// const profileRouter = require("./routes/profile");
//  const connectionRouter=require("./routes/requests");
//  const uploadRouter = require("./routes/uploadRouter");
// const userRouter=require("./routes/user"); 

// app.use("/",authRouter);
// app.use("/",profileRouter);
// app.use("/", connectionRouter);
// app.use("/",userRouter);
// app.use("/", uploadRouter);
// // app.get("/",(req,res)=>{
// //    res.send("Backend Running");
// // });
// connectDb().then(()=>{
// console.log(" Database Connection Established");
// app.listen(5000 , ()=>{
//     console.log("Server is successfully running at 5000...");
//  });}).catch((err)=>{
//     console.error(" cannot connect !");
// });


require("dotenv").config();

const express = require("express");
const connectDb = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://devtinderui.netlify.app",
    ],
    credentials: true,
  })
);

/* ================= Middlewares ================= */

app.use(express.json());
app.use(cookieParser());

/* ================= Routes ================= */

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/requests");
const uploadRouter = require("./routes/uploadRouter");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);
app.use("/", uploadRouter);

/* ================= Health Route ================= */

app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

/* ================= Server ================= */

const PORT = process.env.PORT || 5000;


connectDb()
  .then(() => {
    console.log("Database Connection Established");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Cannot connect to database!", err);
  });
