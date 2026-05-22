 const mongoose =require("mongoose");
const validator=require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        require:true,
        minLength:4,
        maxLength:50,
    },
    lastName: {
        type: String,
        require:true,
        minLength:4,
        maxLength:50,
    },
    emailId:{
        type:String,
        lowercase:true,
        require:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not An Vald email : "+ value);
            }
        },
    },
    password:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                 throw new Error("enter strong password : "+ value);
            }
        }
    },
    age:{
        type:Number,
        min:18,
    },
    gender :{
        type:String,
        enum:{
            values:["Male"  ,"Female", " other"],
            message:`{values} not Valid Gender Type`,
        },
        // validate(value){
        //   if(!["Male","Female","Other"].includes(value)){
        //     throw new Error(" Gender data is not valid");
        //   }
        // },
    },
    about:{
        type:String,
        default:"this is Shubham singh",
    },
    skills:{
        type:[String],
    },
    photoURL:{
        type:String,
        default:"https://img.magnific.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg?w=2000",
            validate(value){  
                if(!validator.isURL(value)){
                    throw new Error("Not a valid URL : "+ value);
                }
    }
 },
 resetPasswordToken: {
    type: String,
},

resetPasswordExpires: {
    type: Date,
},

}
, {
        timestamps:true,
    }
);

// userSchema.index({firstName:1,gender:1});
// // ✅ STEP 1: hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.getJWT=async function(){
    const user=this;
    const token = await jwt.sign({_id:user._id},"DEV@Tinder$798",{expiresIn:"8h",});
    return token;
};

userSchema.methods.validatePassword= async function(inputPassword){
    const user =this;
    const passwordHash=user.password;
    const isPasswordValid = await bcrypt.compare(inputPassword,passwordHash); //compare(password_Input_By_User,actual_password_Of)
    return isPasswordValid;
};

 //mongoose.model( modelname , modelSchema);
 const User= mongoose.model("User",userSchema);

 module.exports=User;