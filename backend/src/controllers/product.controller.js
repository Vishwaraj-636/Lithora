import { json } from "express";
import productModel from "../models/product.model.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
   const { title, description, priceAmount, priceCurrency } = req.body;
   const seller = req.user;

   const images = await Promise.all(
      req.files.map(async (file) => {
         return await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
         });
      }),
   );

   const product = await productModel.create({
      title,
      description,
      price: {
         amount: priceAmount,
         currency: priceCurrency || "INR",
      },
      // image:images[0].url,
      images,
      seller: seller._id,
   });

   res.status(201).json({
      message: "Product created successfully",
      success: true,
      product,
   });
}

export async function getSellerProduct(req, res) {
   const seller = req.user;

   const products = await productModel.find({ seller: seller._id });

   res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
   });
}

export async function getAllProduct(req, res) {
   const products = await productModel.find();

   return res.status(200).json({
      message: "Products fetched successfully",
      success: true,
      products,
   });
}

export async function getProductDetails(req, res) {
   const { productId } = req.params;

   const product = await productModel.findById(productId);

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false,
      });
   }

   return res.status(200).json({
      message: "Product fetched successfully",
      success: true,
      product,
   });
}

export async function addProductVariant(req, res) {


   const productId = req.params.productId
   const product = await productModel.findOne({
      _id: productId,
      seller: req.user._id,
   })

   if (!product) {
      return res.status(404).json({
         message: "Product not found",
         success: false,
      });
   }


   const files = req.files || [];
   let images = [];

   if (files.length > 0) {
      images = await Promise.all(files.map(async (file) => {
         const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
         });
         return { url: image.url };
      }));
   }

   const priceAmount = req.body.priceAmount;
   const stock = Number(req.body.stock) || 0;
   const attributes = JSON.parse(req.body.attributes || "{}");

   const newVariant = {
      images,
      stock,
      attributes,
   };

   product.variants.push(newVariant);
   await product.save();

   return res.status(201).json({
      message: "Variant added successfully",
      success: true,
      variant: product.variants[product.variants.length - 1],
   });
}
