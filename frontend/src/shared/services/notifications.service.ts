import { apiService } from './api.service';
import Constants from 'expo-constants';

let Notifications: any;

try {
  Notifications = require('expo-notifications');
} catch (error) {
  console.log('Expo notifications not available');
}

export async function registerForPushNotifications(): Promise<void> {
  if (!Notifications) {
    console.log('Notifications module not available');
    return;
  }

  // Check if running in Expo Go
  if (Constants.appOwnership === 'expo') {
    console.log('Push notifications not supported in Expo Go. Use development build.');
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission denied for notifications');
      return;
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId || 'cf69f336-fe4b-46f2-b9c9-3122a452b604';
    const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    
    await apiService.post('/notifications/register-token', { token });
    console.log('Push token registered successfully:', token);
  } catch (error) {
    console.log('Could not register for push notifications:', error.message);
  }
}