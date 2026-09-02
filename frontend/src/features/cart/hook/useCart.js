import { addItem, getCart,incrementItemQuantity,decrementItemQuantity } from "../services/cart.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addItem as addItemToCart, setItems,increamentCartItem,decreamentCartItem } from "../state/cart.slice.js";

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

   const handleIncrementItemQuantity = useCallback(async ({ productId, variantId }) => {
      const data = await incrementItemQuantity({ productId, variantId });
      dispatch(increamentCartItem({ productId, variantId }));
      return data;
   }, [dispatch]);

   const handleDecreamentItemQuantity = useCallback(async({productId,variantId})=>{
      const data = await decrementItemQuantity({ productId, variantId });
      dispatch(decreamentCartItem({ productId, variantId }));
      return data;
   }, [dispatch]);

   return { handleAddItem, handleGetCart, handleIncrementItemQuantity, handleDecreamentItemQuantity };
}