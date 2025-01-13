export interface Product {
    _id: string;
    __v: number;
    name: string;
    quantity: number;
    unit: string;
    tag: string;
    imageUrl?: string;
    price: number;
    isEnabled: boolean;
    status: string;
}

export interface ProductInput {
    name: string;
    quantity: number;
    unit: string;
    tag: string;
    imageUrl?: string;
    price: number;
}
  
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
  
  