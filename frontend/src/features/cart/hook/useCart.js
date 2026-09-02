import { addItem, getCart } from "../services/cart.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addItem as addItemToCart, setItems } from "../state/cart.slice.js";

export const useCart = () => {
   const dispatch = useDispatch();

   const handleAddItem = useCallback(async ({ productId, variantId }) => {
      const data = await addItem({ productId, variantId });
      // dispatch(addItemToCart(data.item));

      return data;
   }, [dispatch]);

   const handleGetCart = useCallback(async () => {
      const data = await getCart();
      dispatch(setItems(data.cart.items));
   }, [dispatch]);

   return { handleAddItem, handleGetCart };
}