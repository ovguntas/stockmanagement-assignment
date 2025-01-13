import axios, { AxiosResponse } from "axios";
import { Product } from "../types/product";

const instance = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
const responseBody = (response: AxiosResponse) => response.data;
const request = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: object) =>
    instance.post(url, body).then(responseBody),
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
  getAllProducts: (url: string) => request.get(url).then(responseBody),
  addProduct: (payload: { url: string; body: Product }) =>
    request.post("/add", payload.body),
};
