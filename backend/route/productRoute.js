const express=require('express');
const { createProducts,  updateProduct,  getProductDetails, deleteProduct, getAllProducts, createProductReview, getProductReviews, deleteReview } = require('../controller/productcontroller');
const { isAuthenicatedUser, authorizeRoles } = require('../middleware/auth');



const router=express.Router()


//createproduct rout
router.route("/products/new").post( isAuthenicatedUser, authorizeRoles("admin"), createProducts)
//get all product
router.route('/products').get( getAllProducts)
//getproduct details
router.route("/product/:id").get(getProductDetails)
//updated product
router.route("/products/:id").put(isAuthenicatedUser, authorizeRoles("admin"), updateProduct)
//delete products
router.route("/products/:id").delete(isAuthenicatedUser, authorizeRoles("admin"), deleteProduct)
router.route("/reviews").put(isAuthenicatedUser,createProductReview)

router.route("/reviews").get(getProductReviews)
router.route("/reviews").delete(isAuthenicatedUser,deleteReview)
module.exports=router;