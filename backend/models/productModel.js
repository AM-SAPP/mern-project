const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{
        type: String,
        required: [true , "Please Enter product name"]
    },
    description:{
        type: String,
        required: [true, "Please Enter product description"]
    },
    price:{
        type: Number,
        required: [true, "Please Enter Product Price"],
        maxlength: [8,"Price cannot exceed 8 characters"]
    },
    rating:{
        type: Number,
        default: 1,
        max: [5, "Rating cannot be greater than 5"]
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required: [true,"Please Enter product category"]
    },
    stock:{
        type: Number,
        required: [true,"please enter product stock"],
        maxlength: [4,"stock cannot exceed 4 characters"],
        default: 1
    },
    numOfReview:{
        type: Number,
        default: 0
    },
    review:[
        {
            name:{
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Product',productSchema);