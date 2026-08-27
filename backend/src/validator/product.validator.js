import {body,validationResult} from 'express-validator';

function validateRequest(req,res,next) {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(400).json({
      message:"Validation failed",
      errors:errors.array()
    })
  }
  next();
}

export const createProductValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount").notEmpty().withMessage("Price amount is required").isNumeric().withMessage("Price amount must be a number"),
  body("priceCurrency").optional().isIn(["INR","USD","EUR"]).withMessage("Price currency must be INR, USD or EUR"),
  validateRequest
];