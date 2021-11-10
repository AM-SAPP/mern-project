const ErrorHandler = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error";


    // Mongodb casting error

    if(err.name === "CastError"){
        const message = `Resource not found . Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }

    // Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }

    // Wrong json web token terror
    if(err.name === "JsonwebTokenError"){
        const message = `json web token is invalid try again`;
        err = new ErrorHandler(message,400);
    }


    // Json token expire
    if(err.name === "TokenExpiredError"){
        const message = `Json web token is Expired , try again`;
        err = new ErrorHandler(message,400);
    }



    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}