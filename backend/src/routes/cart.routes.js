import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateAddToCart, validatedecreamentCartItemQuantity, validateincreamentCartItemQuantity, validateRemoveCartItem } from '../validator/cart.validator.js';
import { addToCart, getCart, increamentCartItemQuantity, decreamentCartItemQuantity, removeCartItem, clearCart, createOrderController, verifyOrderController, getOrderDetailsController } from '../controllers/cart.controller.js';

const router = express.Router();

/**
 * @routes POST /api/cart/add/:productId
 * @routes POST /api/cart/add/:productId/:variantId
 * @desc Add an item to the cart
 * @access Private
 * @argument productId - The ID of the product to add to the cart
 * @argument variantId - The ID of the variant of the product to add to the cart
 * @argument quantity - The quantity of the product to add to the cart (default is 1)
 */

router.post("/add/:productId", authenticateUser, validateAddToCart, addToCart)
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart)


/**
 * @routes GET /api/cart
 * @desc Get the cart of the authenticated user
 * @access Private
 */
router.get("/", authenticateUser, getCart)


/**
 * @routes patch /api/cart/quantity/increament/:productId
 * @desc increament the quantity of an item in the cart by 1
 * @access Private
 * @argument productId - The ID of the product to update in the cart
 */

router.patch("/quantity/increament/:productId", authenticateUser, validateincreamentCartItemQuantity, increamentCartItemQuantity)

/**
 * @routes patch /api/cart/quantity/decreament/:productId
 * @desc decreament the quantity of an item in the cart by 1
 * @access Private
 * @argument productId - The ID of the product to update in the cart
 */

router.patch("/quantity/decreament/:productId", authenticateUser, validatedecreamentCartItemQuantity, decreamentCartItemQuantity)


/**
 * @routes DELETE /api/cart/remove/:productId
 * @desc Remove an item from the cart
 * @access Private
 * @argument productId - The ID of the product to remove from the cart
 */
router.delete("/remove/:productId", authenticateUser, validateRemoveCartItem, removeCartItem)

/**
 * @routes DELETE /api/cart/clear
 * @desc Clear the entire cart
 * @access Private
 */
router.delete("/clear", authenticateUser, clearCart)


/**
 * @routes POST /api/cart/payment/create/order
 * @desc Create a payment order using Razorpay
 * @access Private
 * @argument amount - The amount for the order
 * @argument currency - The currency for the order (default is INR)
 */

router.post("/payment/create/order", authenticateUser, createOrderController)


router.post("/payment/verify/order", authenticateUser, verifyOrderController)

router.get("/payment/order/:orderId", authenticateUser, getOrderDetailsController)

export default router;