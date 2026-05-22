
const mongoose=require("mongoose");
const connectDB=async()=>{
    mongoose.connect(process.env.MONGO_URI)
.then(()=>{
   console.log("Database Connected");
})
.catch((err)=>{
   console.log(err);
});
   // await mongoose.connect("mongodb+srv://ss4526995_db_user:kGPTqfsGQUeDiKvN@cluster0.loahn23.mongodb.net/devTinder");
}
module.exports=connectDB;