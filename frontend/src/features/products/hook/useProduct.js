import { setSellerProducts, setProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";
import {
   getProducts,
   createProduct,
   getAllProducts,
   getProductById,
   addProductVariant,
} from "../sevices/product.api.js";

export const useProduct = () => {
   const dispatch = useDispatch();

   async function handleCreateProduct(formData) {
      const data = await createProduct(formData);
      return data.product;
   }

   async function handleGetProduct() {
      const data = await getProducts();
      dispatch(setSellerProducts(data.products));
      return data.products;
   }

   async function handleGetAllProducts() {
      const data = await getAllProducts();
      dispatch(setProducts(data.products));
      return data.products;
   }

   async function handleGetProductById(productId) {
      const data = await getProductById(productId);
      return data.product;
   }

   async function handleAddProductVariant(productId, newProductVariant) {
      const data = await addProductVariant(productId, newProductVariant);
      return data.variant;
   }

   return {
      handleCreateProduct,
      handleGetProduct,
      handleGetAllProducts,
      handleGetProductById,
      handleAddProductVariant,
   };
};
