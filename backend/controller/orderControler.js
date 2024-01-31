const Order = require("../models/orderModels");
const Product = require("../models/producetmodels");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//create a new order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true,
    order,
  });
});
//getsingle order

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
    //populate yai krega ki wo order kai information mai sai user ka id ko lega aur uska email and name show kr dega
  );
  if (!order) {
    return next(new ErrorHandler("Orde not found with this ID", 404));
  }
  res.status(200).json({
    succes: true,
    order,
  });
});

//get logged in users Orders
exports.myOrders=catchAsyncErrors(async (req,res,next)=>{
    const orders=await Order.find({user:req.user._id})
    res.status(200).json({
        succes:true,
        orders,
    })
})
//get all order(admin)

exports.geTAllOrders=catchAsyncErrors(async (req,res,next)=>{
  const orders=await Order.find()
  let totalAmount=0
  orders.forEach((order=>{
    totalAmount+=order.totalPrice
  }))
  res.status(200).json({
      succes:true,
      totalAmount,
      orders,

  })
}) 
//update order status(admin)

exports.updateOrders=catchAsyncErrors(async (req,res,next)=>{
  const order=await Order.findById(req.params.id)
  if(!order){
    return next(new ErrorHandler('Order Not Found',404))
  }
  if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler("you have been delivered this order",400))
  }
  if (req.body.status === "Shipped") {
    order.orderItems.forEach(async (o) => {
      await updateStock(o.product, o.quantity);
    });
  }
  order.orderStatus=req.body.status
  if(req.body.status==="Delivered"){
    order.deliveredAt=Date.now()
  }
 await order.save({validateBeforeSave:false})

  res.status(200).json({
      succes:true,
     

  })
})
async function updateStock(id, quantity){
  const product=await Product.findById(id)
  product.stock-=quantity
  await product.save({
    validateBeforeSave:false
  })

}
//delete order --Admin

exports.deleteOrders=catchAsyncErrors(async (req,res,next)=>{
  const order=await Order.findById(req.params.id)
  if (!order) {
    return next(new ErrorHandler("Orde not found with this ID", 404));
  }
  await order.deleteOne()
 
  res.status(200).json({
      succes:true,
    
  })
}) 
