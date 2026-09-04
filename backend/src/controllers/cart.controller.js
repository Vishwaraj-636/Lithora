import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import mongoose from "mongoose";
import { createOrder } from "../services/payment.service.js";



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

   let cart = await cartModel.aggregate([
      {
         $match: {
            user: new mongoose.Types.ObjectId(user._id)
         }
      },
      { $unwind: { path: '$items' } },
      {
         $lookup: {
            from: 'products',
            let: {
               productId: '$items.product',
               variantId: '$items.variant'
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $eq: ['$_id', '$$productId']
                     }
                  }
               },
               {
                  $set: {
                     selectedVariant: {
                        $arrayElemAt: [
                           {
                              $filter: {
                                 input: '$variants',
                                 as: 'variant',
                                 cond: {
                                    $eq: [
                                       '$$variant._id',
                                       '$$variantId'
                                    ]
                                 }
                              }
                           },
                           0
                        ]
                     }
                  }
               },
               { $project: { variants: 0, __v: 0 } }
            ],
            as: 'product'
         }
      },
      { $unwind: { path: '$product' } },
      {
         $project: {
            _id: 0,
            item: {
               _id: '$items._id',
               quantity: '$items.quantity',
               // Expose live price for display (variant price takes precedence over base product price)
               price: {
                  amount: {
                     $ifNull: [
                        '$product.selectedVariant.price.amount',
                        '$product.price.amount'
                     ]
                  },
                  currency: {
                     $ifNull: [
                        '$product.selectedVariant.price.currency',
                        '$product.price.currency'
                     ]
                  }
               },
               product: '$product',
               variant: '$product.selectedVariant'
            },
            // itemTotal uses live DB price — stale cart snapshot is ignored
            itemTotal: {
               $multiply: [
                  '$items.quantity',
                  {
                     $ifNull: [
                        '$product.selectedVariant.price.amount',
                        '$product.price.amount'
                     ]
                  }
               ]
            },
            currency: {
               $ifNull: [
                  '$product.selectedVariant.price.currency',
                  '$product.price.currency'
               ]
            }
         }
      },
      {
         $group: {
            _id: null,
            items: { $push: '$item' },
            totalPrice: { $sum: '$itemTotal' },
            currencies: { $addToSet: '$currency' }
         }
      },
      {
         $project: {
            _id: 0,
            items: 1,
            totalPrice: 1,
            tax: { $multiply: ['$totalPrice', 0.18] },
            finalTotal: { $add: ['$totalPrice', { $multiply: ['$totalPrice', 0.18] }] },
            currency: {
               $arrayElemAt: ['$currencies', 0]
            }
         }
      }
   ])

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
   const order = await createOrder({ amount: 1000, currency: "INR" })

   return res.status(200).json({
      message: "Order created successfully",
      success: true,
      order
   });
}