import mongoose from "mongoose";
import { config } from "./config/config.js";
import productModel from "./models/product.model.js";

async function runMigration() {
   try {
      await mongoose.connect(config.DB_URL);
      console.log("Connected to DB.");

      const products = await productModel.find({ "variants": { $exists: true, $not: {$size: 0} } });
      
      let count = 0;
      for (const p of products) {
         let modified = false;
         for (let i = 0; i < p.variants.length; i++) {
             if (!p.variants[i].price) {
                 // Initialize price if needed
             }
         }
         if (modified) {
             await p.save();
             count++;
         }
      }
      console.log(`Migration completed. Updated ${count} products.`);
      process.exit(0);
   } catch (err) {
      console.error(err);
      process.exit(1);
   }
}

runMigration();
