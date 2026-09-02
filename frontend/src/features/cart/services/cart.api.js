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