const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Product = require("../models/producetmodels");
const ErrorHandler = require("../utils/errorhandler");
const ApiFeatures = require("../utils/apifeatures");

//createe a producct
exports.createProducts = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  //body mai jo hum id dal rha hai wo id admin ka id hai
  //createproduct kai route mai authorizerole admin diya hai
  const products = await Product.create(req.body);
  res.status(201).json({
    success: true,
    products: products,
  });
});
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  // return next(new ErrorHandler("this is temporsary error",500))
  // yai react alert ko check krnai kai liyai hai
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()

    .filter();

  let products = await apiFeatures.query;
  let filteredProductCount = products.length;
  apiFeatures.pagination(resultPerPage);
  // products = await apiFeatures.query;
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductCount,
  });
});
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("No product found with that id", 404));
  }
  res.status(201).json({
    success: true,
    product: product,
  });
});
//here next work as a callback function

//update product
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    product,
  });
});
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,

    message: "product has been deleted from the list",
  });
});
//in every fnction we are sending that paricular prodcu controller as a function ('theFunc')in asyncErrorhandler

//creaing the Review or update the review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});
// Delete Reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId); //yai productId us paticular product ka id hai;

  if (!product) {
    return next(new ErrorHandler("product id missing", 400));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() == req.query._id.toString()
    //jo reviews hum chatai hai rkna usko reviews mai save kr rhai hai
    //rev._id us paricular prodcut ka particular review ka id hai
  );

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
});
