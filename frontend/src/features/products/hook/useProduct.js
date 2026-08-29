import { setSellerProducts } from "../state/product.slice";
import { useDispatch } from "react-redux";
import { getProducts, createProduct } from "../sevices/product.api.js";


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

  return { handleCreateProduct, handleGetProduct };
}
