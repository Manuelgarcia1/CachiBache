/**
 * Utilidades para autenticación
 * Funciones puras y reutilizables para lógica de auth
 */

// Tipos para roles de usuario
export type UserRole = 'CIUDADANO' | 'ADMIN';

// Tipos para el usuario desde la API
interface ApiUserData {
  email: string;
  fullName: string;
  emailVerified: boolean;
  role: UserRole;
}

// Tipo interno de usuario
export interface User {
  email?: string;
  name?: string;
  emailVerified?: boolean;
  role?: UserRole;
}

/**
 * Detecta si un token pertenece a un usuario invitado
 */
export const isGuestToken = (token: string | null): boolean => {
  if (!token) return false;
  return token.startsWith("guest-");
};

/**
 * Mapea los datos del usuario desde el formato de la API al formato interno
 */
export const mapApiUserToUser = (apiUser: ApiUserData): User => {
  return {
    email: apiUser.email,
    name: apiUser.fullName,
    emailVerified: apiUser.emailVerified,
    role: apiUser.role,
  };
};

/**
 * Verifica si un error es de autenticación (401)
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes("401");
  }
  return false;
};
