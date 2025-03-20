const express = require("express");
const { userAuth } = require("../middelwares/auth");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName: "value1",
        lastName: "value2",
        membershipType: "silver",
      },
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = paymentRouter;
