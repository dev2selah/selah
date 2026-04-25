export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  material?: string;
  color?: string;
  sizes?: string[];
  image_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}