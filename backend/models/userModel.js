const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please Enter your name"],
        maxlength: [50 , "Exceed 50 character"],
        min: [2 , "Min 2 characters are required"]
    },
    email:{
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: [validator.isEmail , "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minlength: [8,"Min length should be 8"],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire : Date
});


userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcryptjs.hash(this.password,10);


});


userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE.toString()
    });
}


userSchema.methods.comparePassword = async function(password){
    return await bcryptjs.compare(password,this.password) ; 
}

// Generate resetPassword token;
userSchema.methods.getResetPasswordToken = function(){

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and adding resetPasswordToken to Schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;

};


module.exports = mongoose.model('User',userSchema);