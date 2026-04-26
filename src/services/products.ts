import { supabase } from "@/integrations/supabase/client";

export async function updateProduct(id: string, data: any) {
  const { error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id);

  if (error) console.error(error);
}

export async function toggleProduct(id: string, current: boolean) {
  console.log("clicou toggle:", id, current);

  const { error } = await supabase
    .from("products")
    .update({ is_active: !current } as any)
    .eq("id", id);

  console.log("erro supabase:", error);
}