import * as SplashScreen from "expo-splash-screen";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AppState } from "react-native";
import { deleteToken, getToken, setToken } from "../utils/secure-store";
import { authService } from "../services/auth.service";

// Interfaz que define los datos del usuario autenticado
interface User {
  email?: string;
  name?: string;
  emailVerified?: boolean; // Indica si el usuario verificó su email
}

// Interfaz del contexto: define todos los valores y métodos disponibles para autenticación
interface AuthContextType {
  token: string | null; // Token JWT almacenado
  user: User | null; // Datos del usuario actual
  isLoading: boolean; // Estado de carga durante verificación inicial
  login: (token: string, userData?: User) => Promise<void>; // Método para iniciar sesión
  logout: () => Promise<void>; // Método para cerrar sesión
  checkAuthStatus: () => Promise<void>; // Verifica si hay sesión activa al iniciar
  refreshUser: () => Promise<void>; // Refresca los datos del usuario desde el servidor
  isGuest: boolean; // Indica si el usuario es invitado (token guest-*)
  isEmailVerified: boolean; // Indica si el usuario verificó su email
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
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        console.log(
          "ℹ️ No hay sesión activa - Mostrando pantalla de bienvenida"
        );
      }
    } catch (err) {
      console.error("❌ Error verificando estado de autenticación:", err);
    } finally {
      setIsLoading(false);
      try {
        await SplashScreen.hideAsync();
      } catch (err) {
        console.error("❌ Error durante checkstatus:", err);
      }
    }
  };

  // Gestiona el login: guarda el token en SecureStore y actualiza el estado
  const login = async (newToken: string, userData?: User) => {
    try {
      await setToken(newToken);
      setTokenState(newToken);
      setUser(userData || null);

      // Actualizar estado de verificación de email
      setIsEmailVerified(userData?.emailVerified || false);

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
      console.log("📧 Email verificado:", userData?.emailVerified || false);
    } catch (err) {
      console.error("❌ Error durante login:", err);
    }
  };

  // Refresca los datos del usuario desde el servidor
  const refreshUser = useCallback(async () => {
    if (!token) {
      console.log("⚠️ No hay token, no se puede refrescar usuario");
      return;
    }

    try {
      console.log("🔄 Refrescando datos del usuario...");
      const userData = await authService.getCurrentUser();

      setUser({
        email: userData.email,
        name: userData.fullName,
        emailVerified: userData.emailVerified,
      });
      setIsEmailVerified(userData.emailVerified);

      console.log("✅ Usuario refrescado exitosamente");
      console.log("📧 Email verificado:", userData.emailVerified);
    } catch (err) {
      console.error("❌ Error refrescando usuario:", err);
      // Si el token expiró, hacer logout
      if (err instanceof Error && err.message.includes("401")) {
        console.log("🔑 Token expirado, cerrando sesión...");
        await logout();
      }
    }
  }, [token]);

  // Cierra sesión: elimina el token de SecureStore y resetea todos los estados
  const logout = async () => {
    try {
      await deleteToken();
      setTokenState(null);
      setUser(null);
      setIsGuest(false);
      setIsEmailVerified(false);
      console.log("✅ Logout exitoso - Sesión cerrada completamente");
    } catch (err) {
      console.error("❌ Error durante logout:", err);
    }
  };

  // Ejecuta checkAuthStatus al montar el componente (inicio de la app)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listener para refrescar usuario cuando la app vuelve del background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Si la app pasa a estar activa (foreground)
      if (nextAppState === "active" && token) {
        console.log("📱 App volvió a primer plano - Refrescando usuario...");
        refreshUser();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [token, refreshUser]);

  const value: AuthContextType = {
    token,
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
    refreshUser,
    isGuest,
    isEmailVerified,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
