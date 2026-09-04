import Razorpay from "razorpay";
import crypto from "node:crypto";
import { config } from "../config/config.js";


const razorpay = new Razorpay({
   key_id: config.RAZORPAY_KEY_ID,
   key_secret: config.RAZORPAY_KEY_SECRET,
});


export const createOrder = async ({ amount, currency = "INR", receipt }) => {
   const numericAmount = Number(amount);

   if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error("Order amount must be greater than zero");
   }

   const options = {
      amount: Math.round(numericAmount * 100),
      currency,
      ...(receipt ? { receipt } : {}),
   };

   const order = await razorpay.orders.create(options);

   return order;
};

export const verifyPaymentSignature = ({ orderId, paymentId, signature }) => {
   const expectedSignature = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
   const expectedBuffer = Buffer.from(expectedSignature);
   const receivedBuffer = Buffer.from(signature);

   return expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
};