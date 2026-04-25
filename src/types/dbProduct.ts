export type DbProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  is_active: boolean;
  description: string | null;
  material: string | null;
  color: string | null;
  sizes: string[] | null;
  created_at: string;
  updated_at: string;
};