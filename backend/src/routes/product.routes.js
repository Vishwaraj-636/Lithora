import express from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import multer from "multer";
import {
   createProduct,
   getAllProduct,
   getSellerProduct,
   getProductDetails,
   addProductVariant,
   updateProduct,
   updateProductVariant,
} from "../controllers/product.controller.js";
import { createProductValidator, updateProductValidator } from "../validator/product.validator.js";


const upload = multer({
   storage: multer.memoryStorage(),
   limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
   },
});

const router = express.Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)
 */
router.post(
   "/",
   authenticateSeller,
   upload.array("images", 7),
   createProductValidator,
   createProduct,
);

/**
 * @routes GET /api/products/seller
 * @desc Get all products for the authenticated seller
 * @access Private (Seller only)
 */
router.get("/seller", authenticateSeller, getSellerProduct);

/**
 * @routes GET /api/products
 * @desc Get all products
 * @access Public
 */
router.get("/", getAllProduct);

/**
 * @routes GET /api/products/:productId
 * @desc Get product details by product ID
 * @access Public
 */
router.get("/detail/:productId", getProductDetails);


/**
 * @routes GET /api/products/:productId/variants
 * @desc Get product variants by product ID
 * @access Public
 */
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant);

/**
 * @route PATCH /api/products/:productId
 * @desc Update base product (title, description, price, stock)
 * @access Private (Seller only)
 */
router.patch("/:productId", authenticateSeller, updateProductValidator, updateProduct);

/**
 * @route PATCH /api/products/:productId/variants/:variantId
 * @desc Update a product variant's stock and/or price
 * @access Private (Seller only)
 */
router.patch("/:productId/variants/:variantId", authenticateSeller, updateProductVariant);



export default router;

