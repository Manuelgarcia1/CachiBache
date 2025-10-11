import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};

export const ENV = {
  API_URL: __DEV__
    ? 'http://10.0.2.2:3000/api'
    : 'https://tu-backend-produccion.com/api',

  GOOGLE_OAUTH: {
    WEB_CLIENT_ID: extra.googleOAuth?.webClientId || '',
    ANDROID_CLIENT_ID: extra.googleOAuth?.androidClientId || '',
    IOS_CLIENT_ID: extra.googleOAuth?.iosClientId || '',
  },
};
