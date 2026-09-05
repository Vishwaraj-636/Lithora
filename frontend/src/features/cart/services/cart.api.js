import apiClient from "../../../shared/api/apiClient.js";

export const addItem = async ({ productId, variantId }) => {
   const path = variantId ? `/cart/add/${productId}/${variantId}` : `/cart/add/${productId}`;
   const response = await apiClient.post(path, { quantity: 1 });
   return response.data;
};

export const getCart = async () => {
   const response = await apiClient.get("/cart/");
   return response.data;
};

export const incrementItemQuantity = async ({ productId, variantId }) => {
   try {
      const response = await apiClient.patch(`/cart/quantity/increament/${productId}`, {
         variantId: variantId || null,
      });
      return response.data;
   } catch (err) {
      return err?.response?.data ?? { success: false, message: "Failed to update quantity" };
   }
};

export const decrementItemQuantity = async ({ productId, variantId }) => {
   try {
      const response = await apiClient.patch(`/cart/quantity/decreament/${productId}`, {
         variantId: variantId || null,
      });
      return response.data;
   } catch (err) {
      return err?.response?.data ?? { success: false, message: "Failed to update quantity" };
   }
};

export const removeItem = async ({ productId, variantId }) => {
   const response = await apiClient.delete(`/cart/remove/${productId}`, {
      data: { variantId: variantId || null },
   });
   return response.data;
};

export const clearCart = async () => {
   const response = await apiClient.delete("/cart/clear");
   return response.data;
};

export const createCartOrder = async () => {
   const response = await apiClient.post("/cart/payment/create/order");
   return response.data;
};

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
   const response = await apiClient.post("/cart/payment/verify/order", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
   });
   return response.data;
};

export const getOrderDetails = async (orderId) => {
   const response = await apiClient.get(`/cart/payment/order/${orderId}`);
   return response.data;
};