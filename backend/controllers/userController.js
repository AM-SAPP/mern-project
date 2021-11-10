const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js');
const crypto = require("crypto");


// Register a User

exports.registerUser = catchAsyncErrors( async (req,res)=>{
    const {name , email , password}  = req.body;

    const user = await User.create({
        name, email , password,
        avatar:{
            public_id: "this is sample id",
            url: "sampleImgUrl"
        }
    });

    sendToken(user,201,res);

});


exports.loginUser = catchAsyncErrors( async (req,res,next)=>{
    const {email,password} = req.body;

    // check if user has given email or password

    if(!email){
        return next(new ErrorHandler("Please enter email",400));
    }

    if(!password){
        return next(new ErrorHandler("Please Enter password",400));
    }

    // here we have to use select("+password") because we have not selected password in our Schema;

    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }
    
    const isPasswordMatched = user.comparePassword(password);
    
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",401));
    }

    sendToken(user,200,res);

});


// Logout

exports.logoutUser = catchAsyncErrors( async (req,res)=>{
    
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged Out"
    });
});



// Forgot Password


exports.forgotPassword = catchAsyncErrors( async (req,res,next)=>{
    const user = await User.findOne({email : req.body.email});
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    // Get ResetPassword Token

    const resetToken = user.getResetPasswordToken();


    // We are saving the user because when we call getResetPasswordToken function user get resetPassword and resetExpire field , so we need to save it

    await user.save({validateBeforeSave : false});


    const resetPasswordUrl = `${req.protocol}://${req.hostname}:4000/api/v1/password/reset/${resetToken}`;

    const message =  `Your password resetTokenUri is :- ${resetPasswordUrl} \n \n if you have not requested this email please ignore it`;

    try{
        // console.log("started sending");

        await sendEmail({
            email: user.email,
            subject : `Ecommerce password Recovery`,
            message
        });

        // console.log("send");


        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    }
    catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});

        return next(new ErrorHandler(error.message,500));

    }
    
});


exports.resetPassword = catchAsyncErrors( async (req,res,next)=>{

    // creating token hash;
    const resetPasswordToken =  crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({ resetPasswordToken , resetPasswordExpire : {$gt : Date.now()}});

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid and has been expired",400));
    }

    if(req.body.password != req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400));
    }

    // We do not need to encrypt it here because we used a pre in userModel which check for the given condition;

    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200,res);
    
})
