// src/shared/services/users.service.ts

import { apiService } from './api.service';
import { User } from './auth.service'; // Reutilizamos la interfaz User

/**
 * Actualiza la URL del avatar del usuario autenticado.
 * @param avatarUrl La nueva URL de la imagen de Cloudinary.
 */
async function updateUserAvatar(avatarUrl: string): Promise<User> {
  try {
    const updatedUser = await apiService.patch<User>('/users/avatar', { avatarUrl });
    return updatedUser;
  } catch (error) {
    console.error('Error al actualizar el avatar:', error);
    throw error;
  }
}

export const usersService = {
  updateUserAvatar,
};