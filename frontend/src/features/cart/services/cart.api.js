import axios from "axios";

const cartAPIInstance = axios.create({
   baseURL: "/api/cart",
   withCredentials: true,
})


export const addItem = async ({ productId, variantId }) => {
   const path = variantId ? `/add/${productId}/${variantId}` : `/add/${productId}`;
   const response = await cartAPIInstance.post(path, {
      quantity: 1
   });

   return response.data;
}


export const getCart = async () => {
   const response = await cartAPIInstance.get("/", { withCredentials: true });
   return response.data;
}


export const incrementItemQuantity = async ({ productId, variantId }) => {
   const response = await cartAPIInstance.patch(`/quantity/increament/${productId}`, {
      variantId: variantId || null
   });
   return response.data;
}

export const decrementItemQuantity = async ({ productId, variantId }) => {
   const response = await cartAPIInstance.patch(`/quantity/decreament/${productId}`, {
      variantId: variantId || null
   })
   return response.data;
}

export const removeItem = async ({ productId, variantId }) => {
   const response = await cartAPIInstance.delete(`/remove/${productId}`, {
      data: { variantId: variantId || null }
   });
   return response.data;
}

export const clearCart = async () => {
   const response = await cartAPIInstance.delete("/clear");
   return response.data;
}