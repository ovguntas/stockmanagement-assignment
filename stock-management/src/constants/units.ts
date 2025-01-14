export const PRODUCT_UNITS = [
  { value: 'kg', label: 'Kilogram' },
  { value: 'adet', label: 'Adet' },
  { value: 'litre', label: 'Litre' },
  { value: 'şişe', label: 'Şişe' },
] as const;

export type ProductUnit = typeof PRODUCT_UNITS[number]['value']; 