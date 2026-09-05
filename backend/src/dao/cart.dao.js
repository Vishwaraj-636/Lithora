import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";


export async function getCartDetails(userId) {
   let cart = await cartModel.aggregate([
      {
         $match: {
            user: new mongoose.Types.ObjectId(userId)
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

   return cart;
}
