const Payment = require("../model/Payment");

const savePayment = async (paymentDetails) => {
    try {
  const {
    userId,
    amount,
    currency,
    paymentId,
    orderId,
    status,
    method,
    email
  } = paymentDetails;

  const payment = new Payment({
    userId,
    amount,
    currency,
    paymentId,
    orderId,
    status,
    method,
    email
  });

  return await payment.save();
} catch (err) {
     console.log("some error occured",err)

    return res.status(500).json({ err: "Failed to create order" });
}
 
};

module.exports = {
    savePayment
}
