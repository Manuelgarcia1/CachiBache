import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {
  registerForPushNotifications,
  registerTokenWithBackend,
  unregisterToken,
  setupNotificationListeners,
  handleNotificationTap,
} from '../services/notifications.service';

/**
 * Hook para manejar notificaciones push en la aplicación
 */
export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  /**
   * Registra el dispositivo para recibir notificaciones push
   */
  const registerPushToken = async () => {
    if (isRegistering) return;

    setIsRegistering(true);
    setError(null);

    try {
      // 1. Obtener permisos y token de Expo
      const token = await registerForPushNotifications();

      if (!token) {
        setError('No se pudo obtener el token de notificaciones');
        setIsRegistering(false);
        return;
      }

      setExpoPushToken(token);

      // 2. Registrar el token con el backend
      await registerTokenWithBackend(token);

      console.log('Notificaciones push configuradas exitosamente');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al configurar notificaciones';
      console.error('Error al configurar notificaciones:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  /**
   * Desregistra el token del backend
   */
  const unregisterPushToken = async () => {
    if (!expoPushToken) return;

    try {
      await unregisterToken(expoPushToken);
      setExpoPushToken(null);
      console.log('Token desregistrado exitosamente');
    } catch (err) {
      console.error('Error al desregistrar token:', err);
    }
  };

  /**
   * Configura los listeners de notificaciones cuando el componente monta
   */
  useEffect(() => {
    const cleanup = setupNotificationListeners(
      // Callback cuando llega una notificación
      (notification) => {
        setNotification(notification);
      },
      // Callback cuando el usuario toca una notificación
      (response) => {
        handleNotificationTap(response);
      },
    );

    // Cleanup cuando el componente se desmonta
    return cleanup;
  }, []);

  return {
    expoPushToken,
    notification,
    error,
    isRegistering,
    registerPushToken,
    unregisterPushToken,
  };
}
