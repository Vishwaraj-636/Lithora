import apiClient from "../../../shared/api/apiClient.js";

export async function createProduct(formData) {
   const response = await apiClient.post("/products/", formData);
   return response.data;
}

export async function getProducts() {
   const response = await apiClient.get("/products/seller");
   return response.data;
}

export async function getAllProducts() {
   const response = await apiClient.get("/products/");
   return response.data;
}

export async function getProductById(productId) {
   const response = await apiClient.get(`/products/detail/${productId}`);
   return response.data;
}

export async function addProductVariant(productId, newProductVariant) {
   const formData = new FormData();
   newProductVariant.images.forEach((image) => {
      formData.append(`images`, image.file);
   });

   formData.append("stock", newProductVariant.stock);
   if (newProductVariant.price?.amount) {
      formData.append("priceAmount", newProductVariant.price.amount);
   }
   formData.append("attributes", JSON.stringify(newProductVariant.attributes));

   const response = await apiClient.post(`/products/${productId}/variants`, formData);
   return response.data;
}

export async function updateProduct(productId, data) {
   const response = await apiClient.patch(`/products/${productId}`, data);
   return response.data;
}

export async function updateProductVariant(productId, variantId, data) {
   const response = await apiClient.patch(`/products/${productId}/variants/${variantId}`, data);
   return response.data;
}