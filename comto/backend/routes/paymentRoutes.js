const express = require("express");
const { createOrder } = require("../controllers/create-order")
const { verifyPayment } = require("../controllers/verify")
const router = express.Router();



// Create an order
router.post("/create-order",createOrder);
router.post("/:userId/paymentVerification",verifyPayment)

module.exports = {
    router
}
