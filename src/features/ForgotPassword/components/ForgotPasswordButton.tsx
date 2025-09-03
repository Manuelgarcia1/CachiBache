import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Stack, Text } from 'tamagui';

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
  return (
    <Button
      size="$4"
      backgroundColor="$green8"
      color="white"
      fontWeight="600"
      borderRadius="$6"
      pressStyle={{ backgroundColor: "$green9" }}
      opacity={disabled || loading ? 0.6 : 1}
      onPress={onPress}
      disabled={disabled || loading}
      width="100%"
      marginVertical="$4"
    >
      <Stack flexDirection="row" alignItems="center" space="$2">
        <Text color="white" fontWeight="600">
          {loading ? "Enviando..." : title}
        </Text>
        {loading && (
          <ActivityIndicator size="small" color="white" />
        )}
      </Stack>
    </Button>
  );
};
