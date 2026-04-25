import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, ShoppingBag, Shield } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin, setIsAuthOpen, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/colecao"
            className="text-sm font-sans tracking-wide text-foreground/70 hover:text-foreground transition-colors"
          >
            Coleção
          </Link>
          <Link
            to="/sobre"
            className="text-sm font-sans tracking-wide text-foreground/70 hover:text-foreground transition-colors"
          >
            O Projeto
          </Link>
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl tracking-[0.15em] font-serif">SELAH</h1>
        </Link>

        <div className="flex items-center gap-5 ml-auto">
          {isAdmin && (
            <Link
              to="/admin"
              className="text-foreground/70 hover:text-foreground transition-colors"
              title="Painel Admin"
            >
              <Shield size={20} />
            </Link>
          )}

          <div className="relative">
            <div className="flex items-center gap-3">
              <ThemeToggle />
                <button
                  onClick={() =>
                    user ? setUserMenuOpen(!userMenuOpen) : setIsAuthOpen(true)
                  }
                  className="text-foreground/70 hover:text-foreground transition-colors display: flex; align-items: center; justify-content: center"
                  >
                  <User size={20} />
                </button>
            </div>
            
            <AnimatePresence>
              {userMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 7 }}
                  className="absolute right-0 top-8 bg-background shadow-card rounded-md p-4 min-w-[180px] z-50"
                >
                  <p className="text-sm font-medium text-foreground mb-1">
                    {user.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    {user.email}
                  </p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="block text-sm text-foreground/70 hover:text-foreground transition-colors mb-2"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Sair
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative text-foreground/70 hover:text-foreground transition-colors"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-medium tabular-nums w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
