"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// Define User Interface
interface User {
  id: string;
  role: string;
}

// Define Auth Context Type
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<string>("en"); // ✅ Default to "en" before detecting
  const router = useRouter();
  const pathname = usePathname(); // Get current path

  // ✅ Extract locale safely (e.g., "/en/signin" → "en")
  useEffect(() => {
    if (pathname) {
      const detectedLocale = pathname.split("/")[1] || "en";
      setLocale(detectedLocale);
    }
  }, [pathname]);

  // ✅ Load user from sessionStorage **only on the client**
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // ✅ Handle Login
  const login = (userData: User) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
    setUser(userData);

    // ✅ Redirect based on role
    if (userData.role === "user") {
      router.push(`/${locale}/`);
    } else if (userData.role === "pending") {
      router.push(`/${locale}/pending`);
    }
  };

  // ✅ Handle Logout
  const logout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("user");
    }
    setUser(null);
    router.push(`/${locale}/signin`);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to Use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
