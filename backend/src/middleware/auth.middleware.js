import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

function extractToken(req) {
   // 1. Try Authorization header: "Bearer <token>"
   const authHeader = req.headers["authorization"];
   if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.slice(7);
   }
   // 2. Fallback to cookie (for local dev)
   return req.cookies.token;
}

export const authenticateUser = async (req, res, next) => {
   const token = extractToken(req);

   if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user;
      next();
   } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Unauthorized" });
   }
};

export const authenticateSeller = async (req, res, next) => {
   const token = extractToken(req);

   if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
   }

   try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = await userModel.findById(decoded.id);

      if (!user) {
         return res.status(401).json({ message: "Unauthorized" });
      }
      if (user.role !== "seller") {
         return res.status(403).json({ message: "Forbidden" });
      }
      req.user = user;
      next();
   } catch (err) {
      console.log(err);
      return res.status(401).json({ message: "Unauthorized" });
   }
};
