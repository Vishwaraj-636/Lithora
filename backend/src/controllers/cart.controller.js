import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js"
import { config } from "../config/config.js";


export const addToCart = async (req, res) => {

   const { productId, variantId } = req.params;
   const quantity = req.body.quantity ?? 1;

   const product = await productModel.findById(productId);

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false
      });
   }

   const variant = variantId
      ? product.variants.find((item) => item._id.toString() === variantId)
      : null;

   if (variantId && !variant) {
      return res.status(404).json({
         message: "Product variant not found",
         success: false
      });
   }

   const stock = variant ? await stockOfVariant(productId, variantId) : product.stock;

   const cart = (await cartModel.findOne({ user: req.user._id })) ||
      (await cartModel.create({ user: req.user._id, }))

   const isProductInCart = cart.items.some(item =>
      item.product.toString() === productId && (item.variant?.toString() ?? null) === (variantId ?? null)
   );

   if (isProductInCart) {
      const cartItem = cart.items.find(item =>
         item.product.toString() === productId && (item.variant?.toString() ?? null) === (variantId ?? null)
      );
      const quantityInCart = cartItem.quantity;
      if (Number.isFinite(stock) && quantityInCart + quantity > stock) {
         return res.status(400).json({
            message: `Only ${stock} items left in stock. You already have ${quantityInCart} items in your cart.`,
            success: false
         });
      }
      cartItem.quantity += quantity;
      await cart.save();

      return res.status(200).json({
         message: "Cart updated successfully",
         success: true
      });
   }

   if (Number.isFinite(stock) && quantity > stock) {
      return res.status(400).json({
         message: `Only ${stock} items left in stock.`,
         success: false
      });
   }

   cart.items.push({
      product: productId,
      ...(variantId ? { variant: variantId } : {}),
      quantity,
      price: variant?.price ?? product.price
   })

   await cart.save();

   return res.status(200).json({
      message: "Product added to cart successfully",
      success: true
   });
}

export const getCart = async (req, res) => {
   const user = req.user;

   let cart = await getCartDetails(user._id);

   if (!cart) {
      cart = await cartModel.create({ user: user._id });
   }

   return res.status(200).json({
      message: "Cart fetched successfully",
      success: true,
      cart
   });

}

export const increamentCartItemQuantity = async (req, res) => {
   const { productId } = req.params;
   const { variantId } = req.body;

   const product = await productModel.findById(productId);

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false
      });
   }

   const cart = await cartModel.findOne({ user: req.user._id });

   if (!cart) {
      return res.status(404).json({
         message: "Cart not found",
         success: false
      });
   }

   const cartItem = cart.items.find(item =>
      item.product.toString() === productId &&
      (item.variant?.toString() ?? null) === (variantId ?? null)
   );

   if (!cartItem) {
      return res.status(404).json({
         message: "Cart item not found",
         success: false
      });
   }

   // Resolve stock: use variant stock if variantId provided, otherwise base product stock
   let stock;
   if (variantId) {
      stock = await stockOfVariant(productId, variantId);
      if (stock === null) {
         return res.status(404).json({
            message: "Product variant not found",
            success: false
         });
      }
   } else {
      stock = product.stock ?? null;
   }

   if (Number.isFinite(stock) && cartItem.quantity + 1 > stock) {
      return res.status(400).json({
         message: `Only ${stock} items left in stock. You already have ${cartItem.quantity} in your cart.`,
         success: false
      });
   }

   cartItem.quantity += 1;
   await cart.save();

   return res.status(200).json({
      message: "Cart quantity updated successfully",
      success: true,
      item: cartItem
   });
}


export const decreamentCartItemQuantity = async (req, res) => {
   const { productId } = req.params;
   const { variantId } = req.body;

   const product = await productModel.findById(productId);

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false
      });
   }

   const cart = await cartModel.findOne({ user: req.user._id });

   if (!cart) {
      return res.status(404).json({
         message: "Cart not found",
         success: false
      });
   }

   const cartItem = cart.items.find(item =>
      item.product.toString() === productId &&
      (item.variant?.toString() ?? null) === (variantId ?? null)
   );

   if (!cartItem) {
      return res.status(404).json({
         message: "Cart item not found",
         success: false
      });
   }

   const stock = variantId ? await stockOfVariant(productId, variantId) : null;
   if (variantId && stock === null) {
      return res.status(404).json({
         message: "Product variant not found",
         success: false
      });
   }

   if (cartItem.quantity <= 1) {
      return res.status(400).json({
         message: `Cannot decrease quantity below 1.`,
         success: false
      });
   }

   cartItem.quantity -= 1;
   await cart.save();

   return res.status(200).json({
      message: "Cart quantity updated successfully",
      success: true,
      item: cartItem
   });
}

export const removeCartItem = async (req, res) => {
   const { productId } = req.params;
   const { variantId } = req.body;

   const product = await productModel.findById(productId);

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false
      });
   }

   const cart = await cartModel.findOne({ user: req.user._id });

   if (!cart) {
      return res.status(404).json({
         message: "Cart not found",
         success: false
      });
   }

   const cartItem = cart.items.find(item =>
      item.product.toString() === productId &&
      (item.variant?.toString() ?? null) === (variantId ?? null)
   );

   if (!cartItem) {
      return res.status(404).json({
         message: "Cart item not found",
         success: false
      });
   }

   cart.items = cart.items.filter(item =>
      !(item.product.toString() === productId &&
         (item.variant?.toString() ?? null) === (variantId ?? null))
   );
   await cart.save();

   return res.status(200).json({
      message: "Cart item removed successfully",
      success: true
   });
}

export const clearCart = async (req, res) => {
   const cart = await cartModel.findOne({ user: req.user._id });

   if (!cart) {
      return res.status(404).json({
         message: "Cart not found",
         success: false
      });
   }

   cart.items = [];
   await cart.save();

   return res.status(200).json({
      message: "Cart cleared successfully",
      success: true
   });
}

export const createOrderController = async (req, res) => {
   const [cart] = await getCartDetails(req.user._id);

   if (!cart || !Number.isFinite(cart.finalTotal) || cart.finalTotal <= 0) {
      return res.status(400).json({
         message: "Cart is empty",
         success: false
      });
   }

   const order = await createOrder({ amount: cart.finalTotal, currency: cart.currency })

   const payment = await paymentModel.create({
      user: req.user._id,
      razorpay: {
         orderId: order.id
      },
      price: {
         amount: cart.finalTotal,
         currency: cart.currency
      },
      orderItems: cart.items.map(item => ({
         title: item.product.title,
         productId: item.product._id,
         variantId: item.variant,
         quantity: item.quantity,
         images: item.variant?.images || item.product.images,
         description: item.product.description,
         price: {
            amount: item.variant?.price?.amount || item.product.price.amount,
            currency: item.variant?.price?.currency || item.product.price.currency
         }
      }))
   })

   return res.status(200).json({
      message: "Order created successfully",
      success: true,
      order
   });
}


export const verifyOrderController = async (req, res) => {
   const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
   } = req.body;

   const payment = await paymentModel.findOne({
      "razorpay.orderId": razorpay_order_id,
      status: "pending"
   });

   if (!payment) {
      return res.status(404).json({
         message: "Payment not found",
         success: false
      });
   }

   const isPaymentValid = validatePaymentVerification({
      "order_id": razorpay_order_id,
      "payment_id": razorpay_payment_id
   }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

   if (!isPaymentValid) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({
         message: "Payment verification failed",
         success: false
      });
   }

   payment.status = "completed";
   payment.razorpay.paymentId = razorpay_payment_id;
   payment.razorpay.signature = razorpay_signature;
   await payment.save();

   // Clear the user's cart upon successful payment
   const cart = await cartModel.findOne({ user: req.user._id });
   if (cart) {
      cart.items = [];
      await cart.save();
   }

   return res.status(200).json({
      message: "Payment verified successfully",
      success: true,
      payment
   });
}

export const getOrderDetailsController = async (req, res) => {
   const { orderId } = req.params;

   const payment = await paymentModel.findOne({
      "razorpay.orderId": orderId,
      user: req.user._id
   });

   if (!payment) {
      return res.status(404).json({
         message: "Order not found",
         success: false
      });
   }

   return res.status(200).json({
      message: "Order details fetched successfully",
      success: true,
      order: payment
   });
}