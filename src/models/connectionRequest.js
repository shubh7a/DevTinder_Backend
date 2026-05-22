const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({
    fromUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User", // reference to user model
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    status:{
        type: String,
        required:true,
        enum:{
            values:["accepted","rejected","interested","ignored"],
            message: `{values} not valid status Type`,
        },
    },
},{
    timestamps:true,
});

connectionRequestSchema.index({fromUserId:1,toUserId:1});
connectionRequestSchema.pre("save", function(){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection Request to Yourself");
    }
});


const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;

