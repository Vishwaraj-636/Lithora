import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
      },
      description: {
         type: String,
         required: true,
      },
      //remove or change it
      // cuz this is a business site and the admin is the one selling
      seller: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      price: {
         type:priceSchema,
         required: true,
      },
      images: [
         {
            url: {
               type: String,
               required: true,
            },
         },
      ],
      variants: [
         {
            images: [
               {
                  url: {
                     type: String,
                     required: true,
                  },
               },
            ],
            stock: {
               type: Number,
               default: 0,
            },
            attributes: {
               type: Map,
               of: String,
            },
            price: {
               type: priceSchema,
            },
         },
      ],
   },
   { timestamps: true },
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;
