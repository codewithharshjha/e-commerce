const express=require("express")
const router=express.Router()
const { isAuthenicatedUser, authorizeRoles } = require('../middleware/auth');
const { newOrder, getSingleOrder, myOrders, geTAllOrders, updateOrders, deleteOrders } = require("../controller/orderControler");

router.route("/order/new").post(isAuthenicatedUser,newOrder)
router.route("/order/:id").get(isAuthenicatedUser ,getSingleOrder)
router.route("/orders/me").get(isAuthenicatedUser,myOrders)
router.route("/admin/orders").get(isAuthenicatedUser,authorizeRoles("admin"),geTAllOrders)
router.route("/admin/order/:id").put(isAuthenicatedUser,authorizeRoles("admin"),updateOrders)
router.route("/admin/order/:id").delete(isAuthenicatedUser,authorizeRoles("admin"),deleteOrders)
module.exports=router