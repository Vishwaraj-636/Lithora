import express from 'express';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateAddToCart,validateincreamentCartItemQuantity } from '../validator/cart.validator.js';
import { addToCart, getCart,increamentCartItemQuantity } from '../controllers/cart.controller.js';

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




export default router;