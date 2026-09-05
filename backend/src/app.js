//packages imports
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

//file imports
import authRouter from "./routes/auth.routes.js";
import { config } from "./config/config.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";

const app = express();
app.set("trust proxy", 1);

//use packages
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(
   cors({
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
   }),
);
passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: `${process.env.BACKEND_URL || ""}/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) => {
         return done(null, profile);
      },
   ),
);

app.get("/", (req, res) => {
   res.status(200).json({
      message: "server is running",
      env: process.env.NODE_ENV,
      frontendUrl: process.env.FRONTEND_URL
   });
});

//setup routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);

export default app;
