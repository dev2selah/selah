import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { handlePayment } from "@/services/payment";

const CartSidebar = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-50 shadow-card flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-serif">Seu Carrinho</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-muted-foreground text-sm">
                    Seu carrinho está vazio.
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Explore nossa coleção e encontre sua peça.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.size}`}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-24 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-foreground">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Tamanho: {item.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center bg-[hsl(var(--background-dark))] rounded text-foreground/70 hover:text-foreground transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm tabular-nums w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center bg-[hsl(var(--background-dark))] rounded text-foreground/70 hover:text-foreground transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm tabular-nums font-medium">
                              R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                            </span>
                            <button
                              onClick={() =>
                                removeFromCart(item.product.id, item.size)
                              }
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Subtotal</span>
                  <span className="text-lg font-medium tabular-nums">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <button onClick={handlePayment} className="w-full py-3.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                  Finalizar Compra
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
