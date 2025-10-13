/**
 * Interface que representa el perfil de un usuario de Google OAuth
 * Utilizada tanto en autenticación web como mobile
 */
export interface GoogleProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
}
