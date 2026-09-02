import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

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

   let cart = await cartModel.findOne({ user: user._id }).populate("items.product")

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

   const stock = variantId ? await stockOfVariant(productId, variantId) : null;
   if (variantId && stock === null) {
      return res.status(404).json({
         message: "Product variant not found",
         success: false
      });
   }

   if (Number.isFinite(stock) && cartItem.quantity + 1 > stock) {
      return res.status(400).json({
         message: `Only ${stock} items left in stock. You already have ${cartItem.quantity} items in your cart.`,
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