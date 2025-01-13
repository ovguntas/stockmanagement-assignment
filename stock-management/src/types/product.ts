export interface Product {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    tag: 'kırtasiye' | 'temizlik' | 'diğer';
    imageUrl ?: string;
  }
  
  