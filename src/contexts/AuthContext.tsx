// src/contexts/AuthContext.tsx
// Contexto de autenticação com persistência de sessão e limpeza no logout

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearAllOfflineData } from "../services/offlineStorage";

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoadingAuth: boolean;
  login(user: User, token: string): Promise<void>;
  logout(): Promise<void>;
}

// ─── CONTEXTO ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Restaura sessão ao iniciar o app
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("@TerraManager:token");
        const storedUser = await AsyncStorage.getItem("@TerraManager:user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.warn("Erro ao restaurar sessão:", err);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  // Salva sessão e navega para o app
  const login = async (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    await AsyncStorage.setItem("@TerraManager:token", accessToken);
    await AsyncStorage.setItem(
      "@TerraManager:user",
      JSON.stringify(userData)
    );
  };

  // Limpa sessão e dados offline
  const logout = async () => {
    await AsyncStorage.removeItem("@TerraManager:token");
    await AsyncStorage.removeItem("@TerraManager:user");
    await clearAllOfflineData();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoadingAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextData {
  return useContext(AuthContext);
}
