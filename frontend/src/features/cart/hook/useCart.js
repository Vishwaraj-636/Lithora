import { addItem, getCart, incrementItemQuantity, decrementItemQuantity, removeItem, clearCart } from "../services/cart.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addItem as addItemToCart, setItems, increamentCartItem, decreamentCartItem, removeItemFromCart, clearCartItems } from "../state/cart.slice.js";

export const useCart = () => {
   const dispatch = useDispatch();

   const handleAddItem = useCallback(async ({ productId, variantId }) => {
      const data = await addItem({ productId, variantId });
      // Fetch the updated cart to keep Redux in sync
      const updatedCartData = await getCart();
      dispatch(setItems(updatedCartData.cart.items));

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

   const handleDecreamentItemQuantity = useCallback(async ({ productId, variantId }) => {
      const data = await decrementItemQuantity({ productId, variantId });
      dispatch(decreamentCartItem({ productId, variantId }));
      return data;
   }, [dispatch]);

   const handleRemoveItem = useCallback(async ({ productId, variantId }) => {
      const data = await removeItem({ productId, variantId });
      dispatch(removeItemFromCart({ productId, variantId }));
      return data;
   }, [dispatch]);

   const handleClearCart = useCallback(async () => {
      const data = await clearCart();
      dispatch(clearCartItems());
      return data;
   }, [dispatch]);

   return { handleAddItem, handleGetCart, handleIncrementItemQuantity, handleDecreamentItemQuantity, handleRemoveItem, handleClearCart };
}