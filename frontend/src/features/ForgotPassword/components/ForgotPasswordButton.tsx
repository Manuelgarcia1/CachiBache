import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button } from 'tamagui';

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
    <Button
      size="$4"
      backgroundColor="$yellow8"
      color="$black"
      fontWeight="bold"
      borderRadius="$10"
      pressStyle={{ backgroundColor: "$yellow9" }}
      onPress={onPress}
      disabled={isDisabled}
      opacity={isDisabled ? 0.6 : 1}
      width="100%"
      marginTop="$4"
      icon={loading ? () => <ActivityIndicator size="small" color="#111827" /> : undefined}
    >
      {loading ? "Enviando..." : title}
    </Button>
  );
};