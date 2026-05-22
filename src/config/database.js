
const mongoose=require("mongoose");
const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://ss4526995_db_user:kGPTqfsGQUeDiKvN@cluster0.loahn23.mongodb.net/devTinder");
}
module.exports=connectDB;