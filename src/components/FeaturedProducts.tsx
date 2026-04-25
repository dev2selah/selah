import { motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";

const FeaturedProducts = () => {
  const { products, loading } = useProducts();

  const activeProducts = products.filter((p) => p.is_active);

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-sm font-sans text-muted-foreground uppercase tracking-[0.2em] mb-2">
              Coleção
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-foreground">
              Peças Essenciais
            </h2>
          </div>
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
            Nenhum produto disponível.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;