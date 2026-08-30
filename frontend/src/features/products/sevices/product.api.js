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
