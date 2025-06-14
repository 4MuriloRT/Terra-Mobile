import React, { createContext, useState, useContext, ReactNode } from 'react';
// Lembre-se de instalar: npx expo install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define o formato do objeto de usuário e do contexto
interface User {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextData {
  user: User | null;
  login(user: User, token: string): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Cria o componente Provedor
export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Função para fazer login
  const login = async (userData: User, token: string) => {
    setUser(userData);
    // Salva o token no armazenamento seguro para login persistente
    await AsyncStorage.setItem('@TerraManager:token', token);
    await AsyncStorage.setItem('@TerraManager:user', JSON.stringify(userData));
  };

  // Função para fazer logout
  const logout = async () => {
    await AsyncStorage.removeItem('@TerraManager:token');
    await AsyncStorage.removeItem('@TerraManager:user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  return context;
}