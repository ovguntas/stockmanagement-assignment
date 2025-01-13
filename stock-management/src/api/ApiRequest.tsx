import axios, { AxiosResponse } from "axios";
import {  ProductInput } from "../types/product";

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
const request = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: object) =>
    instance.post(url, body).then(responseBody),
  put: (url: string, body: object) =>
    instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
  postFormData: async (url: string, body: any) => {
    return instance
      .post(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(responseBody);
  },
};

export const ApiRequest = {
  getAllProducts: async (url: string) => {
    const response = await request.get(url);
    if (!response) {
      throw new Error("Veri alınamadı");
    }
    return response;
  },
  addProduct: (payload: { url: string; body: ProductInput }) =>
    request.post("/add-product", payload.body),
  updateProduct: (id: string, body: ProductInput) =>
    request.put(`/products/${id}`, body),
  deleteProduct: (id: string) =>
    request.delete(`/products/${id}`),
  getStockLogs: () => request.get("/stock-logs"),
};
