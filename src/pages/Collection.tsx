import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

const Collection = () => {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");

  const activeProducts = (products ?? [])
    .filter((p) => p.is_active)
    .filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="text-sm font-sans text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Todas as Peças
          </p>

          <h1 className="text-3xl md:text-4xl font-serif text-foreground">
            Coleção Selah
          </h1>

          <br />

          <input
            type="text"
            placeholder="Buscar peças..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-5 py-3 mb-8 bg-secondary border border-border text-foreground rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-lg bg-secondary" />
                <div className="mt-3 h-5 bg-secondary rounded w-3/4" />
                <div className="mt-2 h-4 bg-secondary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : activeProducts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum produto encontrado.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;