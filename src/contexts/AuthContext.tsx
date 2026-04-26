import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "selah.contatooficial@gmail.com";

interface AuthContextType {
  user: any;
  isAdmin: boolean;
  loading: boolean;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const loadUser = async () => {
      // tenta pegar do localStorage primeiro
      const saved = localStorage.getItem("user");

      if (saved) {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        setIsAdmin(parsed?.email === ADMIN_EMAIL);
      }

      // depois sincroniza com Supabase
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(currentUser.email === ADMIN_EMAIL);

        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem("user");
      }

      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;

        if (currentUser) {
          setUser(currentUser);
          setIsAdmin(currentUser.email === ADMIN_EMAIL);
          localStorage.setItem("user", JSON.stringify(currentUser));
        } else {
          setUser(null);
          setIsAdmin(false);
          localStorage.removeItem("user");
        }

        setLoading(false);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if(!error){
      setIsAuthOpen(false);
    }

    return { data, error: error?.message };
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          emailRedirectTo: "https://selah-bice.vercel.app/auth/callback",
          name,
        },
      },
    });

    return { data, error: error?.message };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        isAuthOpen,
        setIsAuthOpen,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};