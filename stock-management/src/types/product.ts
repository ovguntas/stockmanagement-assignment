export interface Product {
    _id: string;
    __v:any;
    name: string;
    quantity: number;
    unit: string;
    tag: 'kırtasiye' | 'temizlik' | 'diğer';
    imageUrl ?: string;
  }
export interface ProductInput {
    name: string;
    quantity: number;
    unit: string;
    tag: 'kırtasiye' | 'temizlik' | 'diğer';
    imageUrl ?: string;
  }
  
  