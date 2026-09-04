import { body, validationResult } from "express-validator";

function validateRequest(req, res, next) {
   const errors = validationResult(req);

   if (!errors.isEmpty()) {
      return res.status(400).json({
         message: "Validation failed",
         errors: errors.array(),
      });
   }
   next();
}

export const createProductValidator = [
   body("title").notEmpty().withMessage("Title is required"),
   body("description").notEmpty().withMessage("Description is required"),
   body("priceAmount")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("Price amount must be a number"),
   body("priceCurrency")
      .optional()
      .isIn(["INR", "USD", "EUR", "GBP"])
      .withMessage("Price currency must be INR, USD, EUR or GBP"),
   validateRequest,
];

export const updateProductValidator = [
   body("title")
      .optional()
      .notEmpty()
      .withMessage("Title cannot be empty"),
   body("description")
      .optional()
      .notEmpty()
      .withMessage("Description cannot be empty"),
   body("priceAmount")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("Price amount must be a number"),
   body("priceCurrency")
      .optional()
      .isIn(["INR", "USD", "EUR", "GBP"])
      .withMessage("Price currency must be INR, USD, EUR or GBP"),
   body("stock")
      .optional({ checkFalsy: true })
      .isNumeric()
      .withMessage("Stock must be a number"),
   validateRequest,
];
