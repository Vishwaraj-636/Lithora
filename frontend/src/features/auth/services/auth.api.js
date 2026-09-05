import apiClient from "../../../shared/api/apiClient.js";

const authAPI = apiClient;

export async function register({ email, contact, password, fullname, isSeller }) {
   const response = await authAPI.post("/auth/register", {
      email,
      contact,
      password,
      fullname,
      isSeller,
   });
   return response.data;
}

export async function login({ email, password }) {
   const response = await authAPI.post("/auth/login", { email, password });
   return response.data;
}

export async function getMe() {
   const response = await authAPI.get("/auth/me");
   return response.data;
}

export async function logout() {
   const response = await authAPI.post("/auth/logout");
   return response.data;
}
