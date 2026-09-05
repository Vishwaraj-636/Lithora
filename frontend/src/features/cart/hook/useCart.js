import { addItem, getCart, incrementItemQuantity, decrementItemQuantity, removeItem, clearCart, createCartOrder,verifyCartOrder } from "../services/cart.api.js";
import { useDispatch } from "react-redux";
import { useCallback } from "react";
import { addItem as addItemToCart, setItems, increamentCartItem, decreamentCartItem, removeItemFromCart, clearCartItems } from "../state/cart.slice.js";

export const useCart = () => {
   const dispatch = useDispatch();

   const handleAddItem = useCallback(async ({ productId, variantId }) => {
      const data = await addItem({ productId, variantId });
      // Fetch the updated cart to keep Redux in sync
      const updatedCartData = await getCart();
      const cartObj = updatedCartData?.cart?.[0] || { items: [], totalPrice: 0, currency: 'INR' };
      dispatch(setItems(cartObj));

      return data;
   }, [dispatch]);

   const handleGetCart = useCallback(async () => {
      const data = await getCart();
      const cartObj = data?.cart?.[0] || { items: [], totalPrice: 0, currency: 'INR' };
      dispatch(setItems(cartObj));
   }, [dispatch]);

   const handleIncrementItemQuantity = useCallback(async ({ productId, variantId }) => {
      const data = await incrementItemQuantity({ productId, variantId });
      if (data.success) {
         const updatedCartData = await getCart();
         const cartObj = updatedCartData?.cart?.[0] || { items: [], totalPrice: 0, currency: 'INR' };
         dispatch(setItems(cartObj));
      }
      return data;
   }, [dispatch]);

   const handleDecreamentItemQuantity = useCallback(async ({ productId, variantId }) => {
      const data = await decrementItemQuantity({ productId, variantId });
      if (data.success) {
         const updatedCartData = await getCart();
         const cartObj = updatedCartData?.cart?.[0] || { items: [], totalPrice: 0, currency: 'INR' };
         dispatch(setItems(cartObj));
      }
      return data;
   }, [dispatch]);

   const handleRemoveItem = useCallback(async ({ productId, variantId }) => {
      const data = await removeItem({ productId, variantId });
      if (data.success) {
         const updatedCartData = await getCart();
         const cartObj = updatedCartData?.cart?.[0] || { items: [], totalPrice: 0, currency: 'INR' };
         dispatch(setItems(cartObj));
      }
      return data;
   }, [dispatch]);

   const handleClearCart = useCallback(async () => {
      const data = await clearCart();
      if (data.success) {
         dispatch(setItems({ items: [], totalPrice: 0, tax: 0, finalTotal: 0, currency: 'INR' }));
      }
      return data;
   }, [dispatch]);

   const handleCreateCartOrder = useCallback(async () => {
      const data = await createCartOrder();
      return data;
   }, []);

   const handleVerifyCartOrder = useCallback(async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
      const data = await verifyCartOrder({
         razorpay_order_id,
         razorpay_payment_id,
         razorpay_signature
      });
      return data.success;
   }, []);

   return { handleAddItem, handleGetCart, handleIncrementItemQuantity, handleDecreamentItemQuantity, handleRemoveItem, handleClearCart, handleCreateCartOrder, handleVerifyCartOrder };
}