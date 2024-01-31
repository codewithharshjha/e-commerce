const express = require("express");
// const { processPayment, sendStripeApikey } = require("../controller/paymentOrder");
const {  isAuthenicatedUser } = require("../middleware/auth");
const { processPayment, sendStripeApiKey } = require("../controller/paymentOrder");
const router = express.Router();
// router.route("/payment/process").post(isAuthenicatedUser,processPayment)
// router.route("/stripeapikey").get(isAuthenicatedUser,sendStripeApikey)
router.route("/payment/process").post(isAuthenicatedUser,processPayment)
router.route("/stripeapikey").get(isAuthenicatedUser,sendStripeApiKey)
module.exports = router;
