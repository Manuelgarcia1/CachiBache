module.exports = {
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
      bundleIdentifier: "com.anonymous.cachibache",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#FF6B35",
      },
      edgeToEdgeEnabled: true,
      package: "com.anonymous.cachibache",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "@react-native-google-signin/google-signin",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#f8f9fa",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Esta aplicación necesita acceso a tu ubicación para mostrar baches cercanos y permitir reportar nuevos baches.",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Esta aplicación necesita acceso a tus fotos para permitir adjuntar imágenes a los reportes de baches.",
          cameraPermission:
            "Esta aplicación necesita acceso a tu cámara para permitir tomar fotos de los baches directamente.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      googleOAuth: {
        webClientId:
          "68835715805-0q4odctdtl3u96tllfasn73ce4qa5rbh.apps.googleusercontent.com",
        androidClientId:
          "68835715805-uluuf27jn3vndv65k5knvnd8go3br103.apps.googleusercontent.com",
        iosClientId:
          "68835715805-uluuf27jn3vndv65k5knvnd8go3br103.apps.googleusercontent.com",
      },
      router: {},
      eas: {
        projectId: "b8d2ef51-cee3-41a9-a63d-c5cedec29dbf",
      },
    },
  },
};
