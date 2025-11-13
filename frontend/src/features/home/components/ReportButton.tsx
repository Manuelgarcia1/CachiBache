// Ubicación: src/features/home/components/ReportButton.tsx

import { useAuth } from "@/src/shared/contexts/AuthContext";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert } from "react-native";
import { Button } from "tamagui";

export function ReportButton() {
  const { isGuest, isEmailVerified, logout } = useAuth();

  const handlePress = () => {
    // Si es invitado
    if (isGuest) {
      Alert.alert(
        "Cuenta limitada",
        "Como invitado puedes ver los baches reportados, pero no podrás reportar baches nuevos. ¿Continuar o crear cuenta?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Ya tengo una cuenta", onPress: () => logout() },
          {
            text: "Crear cuenta",
            onPress: () => router.push("/(auth)/register"),
          },
        ]
      );
      return;
    }

    // Si no ha verificado el email (usuarios registrados con email/password)
    if (!isEmailVerified) {
      Alert.alert(
        "Verifica tu email",
        "Para reportar baches necesitas verificar tu correo electrónico. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.",
        [{ text: "Entendido", style: "default" }]
      );
      return;
    }

    // Usuario autenticado y verificado, proceder con el reporte
    proceedWithReport();
  };

  const proceedWithReport = () => {
    router.push("/(app)/create-report");
  };

  return (
    <Button
      onPress={handlePress}
      backgroundColor="$yellow10"
      color="black"
      icon={<Feather name="camera" size={26} color="black" />}
      size="$6"
      borderRadius="$10"
      fontWeight="bold"
      fontSize="$6"
      // Sombras más pronunciadas para mejor visibilidad
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 6 }}
      shadowOpacity={0.3}
      shadowRadius={8}
      elevation={8} // Para Android
      // Posicionamiento mejorado
      marginHorizontal="$5"
      marginBottom="$3" // Cerca del borde inferior
      paddingVertical="$4"
      pressStyle={{
        backgroundColor: "$yellow9",
        scale: 0.98,
      }}
    >
      Reportar Bache
    </Button>
  );
}
