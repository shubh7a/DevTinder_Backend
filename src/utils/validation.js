const validator = require("validator");

const validateSignUp = (req)=>{
    const {firstName , lastName , emailId , password } = req.body; //object abstraction

    if(!firstName || !lastName){
        throw new Error("Enter valid userName ");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error(" Enter valid email");

    }
    else if(!validator.isStrongPassword(password)){
        throw new Error(" Enter strong password");
    }
};

const validatEditProfileData = (req)=>{
    const allowedEditFields = [  "firstName",
    "lastName",
    "age",
    "gender",
    "photoURL",
    "about",
    ];
    const isEditAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field));

    return isEditAllowed;
    
};
module.exports ={
    validateSignUp,validatEditProfileData,
}