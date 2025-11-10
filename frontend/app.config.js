// Función helper para convertir el Client ID al formato iosUrlScheme
function getIosUrlScheme(clientId) {
  if (!clientId) return "com.googleusercontent.apps.placeholder";

  // Convertir de: "123456-abc.apps.googleusercontent.com"
  // A: "com.googleusercontent.apps.123456-abc"
  const match = clientId.match(/^(.+)\.apps\.googleusercontent\.com$/);
  if (match) {
    return `com.googleusercontent.apps.${match[1]}`;
  }
  return clientId;
}

export default {
  expo: {
    name: "CachiBache",
    slug: "cachi-bache",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "cachibache",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSSpeechRecognitionUsageDescription: "Esta aplicación necesita acceso al reconocimiento de voz para transcribir automáticamente lo que dices.",
        NSMicrophoneUsageDescription: "Esta aplicación necesita acceso al micrófono para permitir dictar la descripción del bache mediante voz.",
        ITSAppUsesNonExemptEncryption: false,
        UIBackgroundModes: ["remote-notification"]
      },
      bundleIdentifier: "com.anonymous.cachibache"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#f8f9fa"
      },
      package: "com.anonymous.cachibache",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO"
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
        }
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      useNextNotificationsApi: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#f8f9fa"
        }
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Esta aplicación necesita acceso a tu ubicación para mostrar baches cercanos y permitir reportar nuevos baches."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Esta aplicación necesita acceso a tus fotos para permitir adjuntar imágenes a los reportes de baches.",
          cameraPermission: "Esta aplicación necesita acceso a tu cámara para permitir tomar fotos de los baches directamente."
        }
      ],
      [
        "expo-speech-recognition",
        {
          microphonePermission: "Esta aplicación necesita acceso al micrófono para permitir dictar la descripción del bache mediante voz.",
          speechRecognitionPermission: "Esta aplicación necesita acceso al reconocimiento de voz para transcribir automáticamente lo que dices."
        }
      ],
      [
        "expo-notifications",
        {
          icon: "./assets/images/notificacion.png",
          color: "#1976d2",
          defaultChannel: "default"
        }
      ],
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: getIosUrlScheme(process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID)
        }
      ],
      "expo-font",
      "expo-web-browser"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: "b8d2ef51-cee3-41a9-a63d-c5cedec29dbf"
      },
      // Variables de entorno accesibles en la app
      API_URL: process.env.EXPO_PUBLIC_API_URL,
      CLOUDINARY_CLOUD_NAME: process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
      GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID
    }
  }
};
