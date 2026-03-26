import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const AuthModal = () => {
  const { isAuthOpen, setIsAuthOpen, login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Preencha todos os campos.");
      setIsLoading(false);
      return;
    }

    if (mode === "register" && !name) {
      setError("Informe seu nome.");
      setIsLoading(false);
      return;
    }

    const result =
      mode === "login"
        ? await login(email, password)
        : await register(name, email, password);

    if (result.error) {
      setError(
        result.error.includes("Invalid login")
          ? "Email ou senha incorretos."
          : result.error.includes("already registered")
          ? "Este email já está cadastrado."
          : result.error
      );
    } else if (mode === "register") {
      setError("");
      setMode("login");
      setPassword("");
      setError("Conta criada! Verifique seu email.");
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <AnimatePresence>
      {isAuthOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fundo escuro */}
          <div
            onClick={() => {
              setIsAuthOpen(false);
              resetForm();
            }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Card do login */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-sm bg-background rounded-lg shadow-card p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif">
                {mode === "login" ? "Entrar" : "Criar Conta"} 
              </h2>

              <button
                onClick={() => {
                  setIsAuthOpen(false);
                  resetForm();
                }}
                className="text-foreground/50 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                    Nome
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full mt-1.5 px-4 py-3 border border-gray text-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full mt-1.5 px-4 py-3 border border-gray text-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-sans text-muted-foreground uppercase tracking-wider">
                  Senha
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1.5 px-4 py-3 border border-gray text-black rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {error && (
                <p
                  className={`text-xs ${
                    error.includes("Conta criada")
                      ? "text-green-600"
                      : "text-destructive"
                  }`}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading
                  ? "Aguarde..."
                  : mode === "login"
                  ? "Entrar"
                  : "Criar Conta"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  resetForm();
                }}
                className="text-foreground underline underline-offset-4 hover:opacity-70"
              >
                {mode === "login" ? "Criar conta" : "Entrar"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;