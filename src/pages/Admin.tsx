import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useProducts } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";

import { toggleProduct, updateProduct } from "@/services/products";

const Admin = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { products, loading, refetch } = useProducts();
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    material: "",
    color: "",
    image_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (authLoading) {
    return (
      <div className="pt-28 pb-24 flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  if (!user && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file);
    if (error) {
      console.error("Erro no upload:", error);
      return null;
    };
    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let imageUrl = formData.image_url;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (uploaded) imageUrl = uploaded;
    }

    // editar
    if (editingProduct) {
      const { error } = await supabase
        .from("products")
        .update({
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description || null,
          material: formData.material || null,
          color: formData.color || null,
          image_url: imageUrl || null,
        })
        .eq("id", editingProduct.id);

      if (!error) {
        setEditingProduct(null);
      }

    } 
    // criar
    else {
      const { error } = await supabase.from("products").insert({
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description || null,
        material: formData.material || null,
        color: formData.color || null,
        image_url: imageUrl || null,
      });

      if (!error) {
        setShowForm(false);
      }
    }

    setFormData({
      name: "",
      price: "",
      description: "",
      material: "",
      color: "",
      image_url: "",
    });

    setImageFile(null);
    refetch();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    await supabase.from("products").delete().eq("id", id);
    refetch();
  };

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="text-sm font-sans text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Administração
            </p>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground">
              Gerenciar Produtos
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />
            Novo Produto
          </button>
        </motion.div>

        {/* Add product form */}
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            onSubmit={handleSubmit}
            className="mb-12 p-6 bg-[hsl(var(--background-dark))] rounded-lg space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  Nome *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Camiseta Essencial"
                />
              </div>
              <div>
                <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="149.90"
                />
              </div>
              <div>
                <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  Material
                </label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Algodão Egípcio"
                />
              </div>
              <div>
                <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  Cor
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full mt-1.5 px-4 py-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Azul Marinho"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full mt-1.5 px-4 py-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                placeholder="Uma peça que carrega silêncio e propósito..."
              />
            </div>
            <div>
              <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                Imagem do Produto
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full mt-1.5 px-4 py-3 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar Produto"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Cancelar
              </button>
            </div>
          </motion.form>
        )}

        {/* Products list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">
              Nenhum produto cadastrado ainda.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Clique em "Novo Produto" para adicionar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg"
              >
                <div className="w-16 h-20 rounded overflow-hidden bg-secondary flex-shrink-0">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {product.material} • {product.color}
                  </p>
                </div>
                <span className="tabular-nums font-medium text-foreground whitespace-nowrap">
                  R$ {Number(product.price).toFixed(2).replace(".", ",")}
                </span>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  title="Excluir produto"
                >
                  <Trash2 size={18} />
                </button>
                <button
                  onClick={async () => {
                    await toggleProduct(product.id, product.is_active);
                    refetch();
                  }}
                  className={`p-2 text-sm rounded transition-colors flex-shrink-0 ${
                    product.is_active
                      ? "text-yellow-600 hover:text-yellow-500"
                      : "text-green-600 hover:text-green-500"
                  }`}
                  title={product.is_active ? "Pausar produto" : "Ativar produto"}
                >
                  {product.is_active ? "⏸ Pausar" : "▶ Ativar"}
              </button>
              <button
                type="button"
               onClick={() => {
                setEditingProduct(product);
                setShowForm(true);

                setFormData({
                  name: product.name,
                  price: String(product.price),
                  description: product.description || "",
                  material: product.material || "",
                  color: product.color || "",
                  image_url: product.image_url || "",
                });
              }}
                className="p-2 text-blue-500 hover:text-blue-400"
              >
                ✏️ Editar
              </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
