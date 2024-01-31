const express=require('express')
const {  loginUser, registerUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole, deleteUser } = require('../controller/usercontroler')
const { isAuthenicatedUser, authorizeRoles } = require('../middleware/auth')
const router =express.Router()


//Register  A User
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route('/logout').get(logoutUser)
router.route("/me").get(isAuthenicatedUser ,getUserDetails)
router.route("/password/update").put(isAuthenicatedUser,updatePassword)
router.route("/me/update").put(isAuthenicatedUser,updateProfile)
router.route("/admin/users").get(isAuthenicatedUser,authorizeRoles("admin"),getAllUser)
router.route("/admin/user/:id").get(isAuthenicatedUser,authorizeRoles("admin"),getSingleUser)
router.route("/admin/user/:id").put(isAuthenicatedUser,authorizeRoles("admin"),updateUserRole)
router.route("/admin/user/:id").delete(isAuthenicatedUser,authorizeRoles,deleteUser)
module.exports=router