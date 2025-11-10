import * as SplashScreen from "expo-splash-screen";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AppState } from "react-native";
import {
  deleteToken,
  getToken,
  setToken,
  deleteRefreshToken,
  setRefreshToken,
} from "../utils/secure-store";
import { authService } from "../services/auth.service";
import {
  User,
  isGuestToken,
  mapApiUserToUser,
  isAuthError,
} from "../utils/auth.utils";
import {
  registerForPushNotifications,
  registerTokenWithBackend,
  unregisterToken,
} from "../services/notifications.service";

// Interfaz del contexto: define todos los valores y métodos disponibles para autenticación
interface AuthContextType {
  token: string | null; // Token JWT almacenado
  user: User | null; // Datos del usuario actual
  isLoading: boolean; // Estado de carga durante verificación inicial
  login: (
    accessToken: string,
    userData?: User,
    refreshToken?: string
  ) => Promise<void>; // Método para iniciar sesión
  logout: () => Promise<void>; // Método para cerrar sesión
  checkAuthStatus: () => Promise<void>; // Verifica si hay sesión activa al iniciar
  refreshUser: () => Promise<void>; // Refresca los datos del usuario desde el servidor
  isGuest: boolean; // Indica si el usuario es invitado (token guest-*)
  isEmailVerified: boolean; // Indica si el usuario verificó su email
  isAdmin: boolean; // Indica si el usuario es administrador (role === 'ADMIN')
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
  const [pushToken, setPushToken] = useState<string | null>(null);

  // Verifica al iniciar la app si existe una sesión guardada en SecureStore
  const checkAuthStatus = async () => {
    try {
      console.log("🚀 Iniciando app - Verificando estado de autenticación...");
      const storedToken = await getToken();

      if (storedToken) {
        console.log("✅ Usuario ya autenticado encontrado");
        console.log("🔑 Token actual:", storedToken);

        setTokenState(storedToken);

        // Detectar si es usuario invitado
        if (isGuestToken(storedToken)) {
          setIsGuest(true);
          console.log("👤 Usuario invitado detectado");
        } else {
          setIsGuest(false);
          console.log("👤 Usuario registrado detectado");

          // Cargar datos del usuario desde el backend
          try {
            console.log("🔄 Cargando datos del usuario desde el backend...");
            const apiUserData = await authService.getCurrentUser();
            const userData = mapApiUserToUser(apiUserData);

            setUser(userData);
            setIsEmailVerified(userData.emailVerified || false);

            console.log("✅ Datos del usuario cargados exitosamente");
            console.log("👤 Usuario:", userData.name);
            console.log("📧 Email:", userData.email);
            console.log("✔️ Email verificado:", userData.emailVerified);
          } catch {
            console.log("⚠️ No se pudieron cargar los datos del usuario");
            // Si el token expiró o es inválido, limpiar la sesión completa
            await deleteToken();
            await deleteRefreshToken();
            setTokenState(null);
            setUser(null);
            setIsGuest(false);
            setIsEmailVerified(false);
            console.log(
              "🔑 Sesión anterior expirada - Limpieza completa realizada"
            );
          }
        }

        await SplashScreen.hideAsync();
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

  // Gestiona el login: guarda ambos tokens en SecureStore y actualiza el estado
  const login = async (
    accessToken: string,
    userData?: User,
    refreshToken?: string
  ) => {
    try {
      // Guardar tokens en SecureStore
      await setToken(accessToken);
      if (refreshToken) {
        await setRefreshToken(refreshToken);
      }

      // Actualizar estado
      setTokenState(accessToken);
      setUser(userData || null);
      setIsEmailVerified(userData?.emailVerified || false);
      setIsGuest(isGuestToken(accessToken));

      // Registrar notificaciones push solo para usuarios registrados (no invitados)
      if (userData && !isGuestToken(accessToken)) {
        try {
          console.log("📲 Registrando notificaciones push...");
          const token = await registerForPushNotifications();
          if (token) {
            await registerTokenWithBackend(token);
            setPushToken(token);
            console.log("✅ Notificaciones push registradas exitosamente");
          }
        } catch (notifError) {
          console.error(
            "⚠️ Error al registrar notificaciones push:",
            notifError
          );
          // No bloqueamos el login si falla el registro de notificaciones
        }
      }
    } catch (err) {
      console.error("❌ Error durante login:", err);
    }
  };

  // Cierra sesión: elimina ambos tokens de SecureStore y resetea todos los estados
  const logout = useCallback(async () => {
    try {
      // Desregistrar notificaciones push antes de cerrar sesión
      if (pushToken) {
        try {
          console.log("📲 Desregistrando notificaciones push...");
          await unregisterToken(pushToken);
          setPushToken(null);
          console.log("✅ Notificaciones push desregistradas");
        } catch (notifError) {
          console.error("⚠️ Error al desregistrar notificaciones:", notifError);
          // Continuamos con el logout aunque falle
        }
      }

      await deleteToken();

      await deleteRefreshToken();
      setTokenState(null);
      setUser(null);
      setIsGuest(false);
      setIsEmailVerified(false);
      console.log("✅ Logout exitoso - Sesión cerrada completamente");
    } catch (err) {
      console.error("❌ Error durante logout:", err);
    }
  }, [pushToken]);

  // Refresca los datos del usuario desde el servidor
  const refreshUser = useCallback(async () => {
    if (!token) {
      console.log("⚠️ No hay token, no se puede refrescar usuario");
      return;
    }

    // No refrescar si es usuario invitado
    if (isGuestToken(token)) {
      console.log("👤 Usuario invitado, no se refresca");
      return;
    }

    try {
      console.log("🔄 Refrescando datos del usuario...");
      const apiUserData = await authService.getCurrentUser();
      const userData = mapApiUserToUser(apiUserData);

      setUser(userData);
      setIsEmailVerified(userData.emailVerified || false);

      console.log("✅ Usuario refrescado exitosamente");
      console.log("📧 Email verificado:", userData.emailVerified);
    } catch (err) {
      console.error("❌ Error refrescando usuario:", err);
      // Si el token expiró, hacer logout
      if (isAuthError(err)) {
        console.log("🔑 Token expirado, cerrando sesión...");
        await logout();
      }
    }
  }, [token, logout]);

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
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
