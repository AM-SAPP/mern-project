const Order = require('../models/orderModel');
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// Create new Order
exports.newOrder = catchAsyncErrors( async (req,res,next)=>{
    const {
        shippingInfo,
        orderedItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderedItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt : Date.now(),
        user : req.user._id
    });

    res.status(201).json({
        success : true,
        order
    });
});


// get Single Order

exports.getSingleOrder  = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email");
    
    if(!order)
    {
        return next(new ErrorHandler("Order not found with this id",404));
    }

    res.status(200).json({
        success : true,
        order
    });

});


// get My Order

exports.getMyOrders  = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find({user : req.user.id}).populate("user","name email");

    res.status(200).json({
        success : true,
        orders
    });
});


// Get All Orders -- Admin
exports.getAllOrders  = catchAsyncErrors(async (req,res,next)=>{
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success : true,
        totalAmount,
        orders
    });
});


// Update Order Status --Admin
exports.updateOrderStatus  = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new ErrorHandler("Your order have already delivered",400));
    }


    order.orderedItems.forEach(async (order) => {
        await updateStock(order.product,order.quantity);
    });

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save({validateBeforeSave : false});

    res.status(200).json({
        success : true
    });
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock -= quantity;

    await product.save({validateBeforeSave : false});

}


// delete Order -- Admin
exports.deleteOrder  = catchAsyncErrors(async (req,res,next)=>{
    const order = await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with this id",404));
    }

    await order.remove();


    res.status(200).json({
        success : true
    });
});