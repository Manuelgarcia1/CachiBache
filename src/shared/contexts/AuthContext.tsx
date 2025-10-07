import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useState } from "react";
import { deleteToken, getToken, setToken } from "../utils/secure-store";

// Interfaz que define los datos del usuario autenticado
interface User {
  email?: string;
  name?: string;
}

// Interfaz del contexto: define todos los valores y métodos disponibles para autenticación
interface AuthContextType {
  token: string | null; // Token JWT almacenado
  user: User | null; // Datos del usuario actual
  isLoading: boolean; // Estado de carga durante verificación inicial
  login: (token: string, userData?: User) => Promise<void>; // Método para iniciar sesión
  logout: () => Promise<void>; // Método para cerrar sesión
  checkAuthStatus: () => Promise<void>; // Verifica si hay sesión activa al iniciar
  isGuest: boolean; // Indica si el usuario es invitado (token guest-*)
}

// Creación del contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto de autenticación desde cualquier componente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Provider que envuelve la app y proporciona el contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estados principales de autenticación
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Verifica al iniciar la app si existe una sesión guardada en SecureStore
  const checkAuthStatus = async () => {
    try {
      console.log("🚀 Iniciando app - Verificando estado de autenticación...");
      const storedToken = await getToken();
      if (storedToken) {
        console.log("✅ Usuario ya autenticado encontrado");
        console.log("🔑 Token actual:", storedToken);
        await SplashScreen.hideAsync();
        setTokenState(storedToken);
        // Delay intencional de 1.5s para mostrar ReauthLoadingScreen y evitar transición abrupta
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        console.log(
          "ℹ️ No hay sesión activa - Mostrando pantalla de bienvenida"
        );
      }
    } catch (error) {
      console.error("❌ Error verificando estado de autenticación:", error);
    } finally {
      // Finaliza el estado de carga, permitiendo que app/index.tsx redirija según el token
      setIsLoading(false);
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error("❌ Error durante checkstatus:", error);
      }
    }
  };

  // Gestiona el login: guarda el token en SecureStore y actualiza el estado
  const login = async (newToken: string, userData?: User) => {
    try {
      await setToken(newToken);
      setTokenState(newToken);
      setUser(userData || null);
      // Detecta si es usuario invitado por el prefijo del token
      if (newToken.startsWith("guest-")) {
        setIsGuest(true);
        console.log("👤 Usuario invitado");
      } else {
        setIsGuest(false);
        console.log("👤 Usuario registrado");
      }
      console.log("✅ Login exitoso - Token guardado en SecureStore");
      console.log("🔑 Token generado:", newToken);
    } catch (error) {
      console.error("❌ Error durante login:", error);
    }
  };

  // Cierra sesión: elimina el token de SecureStore y resetea todos los estados
  const logout = async () => {
    try {
      await deleteToken();
      setTokenState(null);
      setUser(null);
      setIsGuest(false);
      console.log("✅ Logout exitoso - Sesión cerrada completamente");
    } catch (error) {
      console.error("❌ Error durante logout:", error);
    }
  };

  // Ejecuta checkAuthStatus al montar el componente (inicio de la app)
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
