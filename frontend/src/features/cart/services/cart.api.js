import axios from "axios";

const cartAPIInstance = axios.create({
   baseURL: "/api/cart",
   withCredentials: true,
})


export const addItem = async ({productId,variantId})=>{
   const response = await cartAPIInstance.post(`/add/${productId}/${variantId}`,{
      qauntity: 1
   })

   return response.data;
}