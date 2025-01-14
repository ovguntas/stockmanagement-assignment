import axios, { AxiosResponse } from "axios";
import { ProductInput, ProductsResponse } from "../types/product";

const instance = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

const responseBody = async (response: AxiosResponse) => {
  return response.data;
};

const handleError = (error: any) => {
  if (error.code === "ERR_NETWORK") {
    throw new Error("Sunucuya bağlanılamadı. Lütfen sunucunun çalıştığından emin olun.");
  }
  throw error;
};

const request = {
  get: (url: string) => instance.get(url).then(responseBody).catch(handleError),
  post: (url: string, body: object) =>
    instance.post(url, body).then(responseBody).catch(handleError),
  put: (url: string, body: object) =>
    instance.put(url, body).then(responseBody).catch(handleError),
  delete: (url: string) => instance.delete(url).then(responseBody).catch(handleError),
  postFormData: async (url: string, body: any) => {
    return instance
      .post(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(responseBody)
      .catch(handleError);
  },
};

export const ApiRequest = {
  getAllProducts: async (page: number = 1, limit: number = 10, search: string = "") => {
    const response = await request.get(
      `/products?page=${page}&limit=${limit}&search=${search}`
    );
    if (!response) {
      throw new Error("Veri alınamadı");
    }
    return response as ProductsResponse;
  },
  addProduct: (payload: { url: string; body: ProductInput }) =>
    request.post("/add-product", payload.body),
  updateProduct: (id: string, body: ProductInput) =>
    request.put(`/products/${id}`, body),
  deleteProduct: (id: string) =>
    request.delete(`/products/${id}`),
  getStockLogs: () => request.get("/stock-logs"),
  toggleProductStatus: (id: string) =>
    request.put(`/products/${id}/toggle-status`, {}),
  updatePublishStatus: (id: string, status: 'published' | 'draft') =>
    request.put(`/products/${id}/publish-status`, { status }),
};
