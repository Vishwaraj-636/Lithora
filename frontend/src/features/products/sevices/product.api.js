import axios from "axios";

const productAPIInstance = axios.create({
   baseURL: "/api/products",
   withCredentials: true,
});

export async function createProduct(formData) {
   const response = await productAPIInstance.post("/", formData);
   return response.data;
}

export async function getProducts() {
   const response = await productAPIInstance.get("/seller");
   return response.data;
}

export async function getAllProducts() {
   const response = await productAPIInstance.get("/");
   return response.data;
}

export async function getProductById(productId) {
   const response = await productAPIInstance.get(`/detail/${productId}`);
   return response.data;
}


export async function addProductVariant(productId, newProductVariant) {
   const formData = new FormData();
   newProductVariant.images.forEach((image) => {
      formData.append(`images`, image.file);
   })

   formData.append("stock", newProductVariant.stock);
   if (newProductVariant.price?.amount) {
      formData.append("priceAmount", newProductVariant.price.amount);
   }
   formData.append("attributes", JSON.stringify(newProductVariant.attributes));

   const response = await productAPIInstance.post(`/${productId}/variants`, formData);
   return response.data;
}