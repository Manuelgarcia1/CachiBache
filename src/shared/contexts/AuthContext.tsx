import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { getToken, setToken, deleteToken } from '../utils/secure-store';

interface User {
  email?: string;
  name?: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  const checkAuthStatus = async () => {
    try {
      console.log('🚀 Iniciando app - Verificando estado de autenticación...');
      const storedToken = await getToken();
      if (storedToken) {
        console.log('✅ Usuario ya autenticado encontrado');
        console.log('🔑 Token actual:', storedToken);
        // Ocultar splash nativo para mostrar nuestro loading
        await SplashScreen.hideAsync();
        // Primero establecer el token
        setTokenState(storedToken);
        // Delay para ver el loading de reautenticación
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else {
        console.log('ℹ️ No hay sesión activa - Mostrando pantalla de bienvenida');
      }
    } catch (error) {
      console.error('❌ Error verificando estado de autenticación:', error);
    } finally {
      setIsLoading(false);
      // Solo ocultar splash si no fue ocultado antes (para usuarios sin token)
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        // Ya fue ocultado
      }
    }
  };

  const login = async (newToken: string, userData?: User) => {
    try {
      await setToken(newToken);
      setTokenState(newToken);
      setUser(userData || null);
      if (newToken.startsWith('guest-')) {
            setIsGuest(true);
            console.log('👤 Usuario invitado');
          } else {
            setIsGuest(false);
            console.log('👤 Usuario registrado');
          }
      console.log('✅ Login exitoso - Token guardado en SecureStore');
      console.log('🔑 Token generado:', newToken);
    } catch (error) {
      console.error('❌ Error durante login:', error);
    }
  };

  const logout = async () => {
    try {
      await deleteToken();
      setTokenState(null);
      setUser(null);
      setIsGuest(false);
      console.log('✅ Logout exitoso - Sesión cerrada completamente');
    } catch (error) {
      console.error('❌ Error durante logout:', error);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value: AuthContextType = {
    token,
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    isGuest,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};