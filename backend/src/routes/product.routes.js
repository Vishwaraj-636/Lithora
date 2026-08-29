import express from 'express';
import { authenticateSeller } from '../middleware/auth.middleware.js';
import multer from 'multer';
import { createProduct, getSellerProduct } from '../controllers/product.controller.js';
import { createProductValidator } from '../validator/product.validator.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});


const router = express.Router();

/**
 * @route POST /api/products
 * @desc Create a new product
 * @access Private (Seller only)
 */
router.post('/', authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

/**
 * @routes GET /api/products/seller
 * @desc Get all products for the authenticated seller
 * @access Private (Seller only)
 */
router.get('/seller', authenticateSeller, getSellerProduct)




export default router;