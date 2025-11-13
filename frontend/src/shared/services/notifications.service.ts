import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiService } from './api.service';

/**
 * Configuración de cómo se manejan las notificaciones cuando llegan
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Solicita permisos y obtiene el token de Expo Push Notifications
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    // Solo funcionan en dispositivos físicos
    if (!Device.isDevice) {
      console.warn(
        'Las notificaciones push solo funcionan en dispositivos físicos, no en emuladores',
      );
      return null;
    }

    // Verificar si ya tenemos permisos
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Si no tenemos permisos, solicitarlos
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Si no se concedieron permisos, retornar null
    if (finalStatus !== 'granted') {
      console.warn('No se obtuvieron permisos para notificaciones push');
      return null;
    }

    // Obtener el token de Expo
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: 'b8d2ef51-cee3-41a9-a63d-c5cedec29dbf',
    });

    const token = tokenData.data;

    // Configuración adicional para Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1976d2',
      });
    }

    return token;
  } catch (error) {
    console.error('Error al registrar para notificaciones push:', error);
    return null;
  }
}

/**
 * Registra el token de Expo con el backend
 */
export async function registerTokenWithBackend(token: string): Promise<void> {
  try {
    const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';

    await apiService.post('/notifications/register', {
      token,
      deviceType,
    });
  } catch (error) {
    console.error('Error al registrar token con el backend:', error);
    throw error;
  }
}

/**
 * Desregistra el token del backend (útil en logout)
 */
export async function unregisterToken(token: string): Promise<void> {
  try {
    await apiService.delete('/notifications/unregister', { token });
  } catch (error) {
    console.error('Error al desregistrar token:', error);
    // No lanzamos el error para que no afecte el logout
  }
}

/**
 * Configura los listeners de notificaciones
 * @returns Función de cleanup para remover los listeners
 */
export function setupNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void,
): () => void {
  // Listener para cuando llega una notificación (app en foreground)
  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      onNotificationReceived?.(notification);
    },
  );

  // Listener para cuando el usuario toca una notificación
  const responseListener = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      onNotificationTapped?.(response);
    },
  );

  // Retornar función de cleanup
  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}

/**
 * Maneja la navegación cuando se toca una notificación
 */
export function handleNotificationTap(response: Notifications.NotificationResponse) {
  const data = response.notification.request.content.data;

  // Si hay un reportId en los datos, podemos navegar a ese reporte
  if (data.reportId) {
    // Aquí se puede agregar la lógica de navegación si es necesario
    // Por ejemplo, usando navigation.navigate('ReportDetail', { id: data.reportId })
  }
}
