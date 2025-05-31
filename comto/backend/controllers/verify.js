const  crypto =  require("crypto");


const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const userId = req.params.userId; // Extract userId from URL


  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Payment verified successfully
 //   res.json({ success: true, message: "Payment verified successfully" });
    return res.redirect(`${process.env.REACT_API_URL}/payment-success?order_id=${razorpay_order_id}&payment_id=${razorpay_payment_id}&userId=${userId}`);

  } else {
  //  res.status(400).json({ success: false, message: "Invalid signature" });
   return res.redirect(`${process.env.REACT_API_URL}/payment-failure?userId=${userId}`);
  }
};

module.exports = {
    verifyPayment
}