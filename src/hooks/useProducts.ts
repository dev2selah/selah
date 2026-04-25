import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DbProduct } from "@/types/dbProduct";

export function useProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .returns<DbProduct[]>();

    if (error) {
      console.error(error);
      setProducts([]);
      setLoading(false);
      return;
    }

    setProducts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    refetch: fetchProducts,
  };
}