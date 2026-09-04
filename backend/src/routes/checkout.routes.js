import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { checkout } from "../controllers/checkout.controller.js";

const router = express.Router();

/**
 * @route  POST /api/checkout
 * @desc   Calculate authoritative order totals from the DB and return a checkout summary.
 *         The request body is intentionally ignored for all monetary values.
 *         Only the authenticated user's identity (req.user._id) is used.
 * @access Private
 */
router.post("/", authenticateUser, checkout);

export default router;
