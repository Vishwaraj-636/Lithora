import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

const TAX_RATE = 0.18;

/**
 * POST /api/checkout
 *
 * Security contract:
 *  - Accepts NO price, total, or amount from the request body.
 *  - All monetary values are fetched fresh from the product collection.
 *  - The authenticated user's identity (req.user._id) is the only trusted input.
 */
export const checkout = async (req, res) => {
   // 1. Load the user's cart (items only — no prices trusted from here)
   const cart = await cartModel.findOne({ user: req.user._id });

   if (!cart || cart.items.length === 0) {
      return res.status(400).json({
         success: false,
         message: "Your cart is empty."
      });
   }

   // 2. Re-fetch every product from DB to get authoritative live prices
   const productIds = [...new Set(cart.items.map(item => item.product.toString()))];
   const products = await productModel.find({ _id: { $in: productIds } });
   const productMap = Object.fromEntries(products.map(p => [p._id.toString(), p]));

   // 3. Build order line-items using ONLY DB prices — cart snapshot is ignored
   const lineItems = [];
   let subtotal = 0;

   for (const cartItem of cart.items) {
      const product = productMap[cartItem.product.toString()];

      if (!product) {
         return res.status(400).json({
            success: false,
            message: `Product not found: ${cartItem.product}. Please refresh your cart.`
         });
      }

      // Resolve variant if present
      const variant = cartItem.variant
         ? product.variants.id(cartItem.variant)
         : null;

      if (cartItem.variant && !variant) {
         return res.status(400).json({
            success: false,
            message: `Product variant not found. Please refresh your cart.`
         });
      }

      // Live price from DB — never from req.body or cart snapshot
      const livePrice = variant?.price ?? product.price;

      if (!livePrice?.amount) {
         return res.status(500).json({
            success: false,
            message: `Pricing unavailable for "${product.title}". Please try again later.`
         });
      }

      const itemTotal = livePrice.amount * cartItem.quantity;
      subtotal += itemTotal;

      lineItems.push({
         product: product._id,
         title: product.title,
         ...(variant ? { variant: variant._id, attributes: variant.attributes } : {}),
         quantity: cartItem.quantity,
         // priceAtPurchase — records what the user actually paid at order time
         priceAtPurchase: {
            amount: livePrice.amount,
            currency: livePrice.currency ?? "INR"
         },
         itemTotal
      });
   }

   // 4. Server-side tax and final total — never from frontend
   const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
   const finalTotal = parseFloat((subtotal + tax).toFixed(2));
   const currency = lineItems[0]?.priceAtPurchase?.currency ?? "INR";

   // 5. Return authoritative order summary
   //    (Extend here to persist an Order document when you add the Order model)
   return res.status(200).json({
      success: true,
      message: "Checkout summary calculated successfully.",
      order: {
         lineItems,
         subtotal,
         tax,
         finalTotal,
         currency,
         taxRate: TAX_RATE
      }
   });
};
