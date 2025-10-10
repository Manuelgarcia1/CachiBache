import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Text, XStack } from 'tamagui'; // CAMBIO: Usamos XStack para alinear

interface ForgotPasswordButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export const ForgotPasswordButton: React.FC<ForgotPasswordButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  title = 'Enviar Enlace',
}) => {
  const isDisabled = disabled || loading;

  return (
    // --- CAMBIOS DE ESTILO AQUÍ ---
    <Button
      size="$4"
      backgroundColor="$yellow8" // Amarillo principal
      color="$black" // Texto oscuro para contraste
      fontWeight="bold"
      borderRadius="$10" // Bordes más redondeados
      pressStyle={{ backgroundColor: "$yellow9" }}
      onPress={onPress}
      disabled={isDisabled}
      opacity={isDisabled ? 0.6 : 1}
      width="100%"
      marginVertical="$4" // Espacio vertical
      icon={loading ? () => <ActivityIndicator size="small" color="#111827" /> : undefined}
    >
      <Text color="$black" fontWeight="bold" fontSize="$4">
        {loading ? "Enviando..." : title}
      </Text>
    </Button>
  );
};