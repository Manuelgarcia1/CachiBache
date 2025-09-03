import React from 'react';
import { Button, Spinner, Text, XStack } from 'tamagui';

interface RegisterButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}

export function RegisterButton({
  onPress,
  disabled = false,
  loading = false,
  title = 'Crear Cuenta',
}: RegisterButtonProps) {
  return (
    <Button
      size="$4"
      backgroundColor="$blue10"
      borderRadius="$6"
      fontWeight="600"
      width="100%"
      marginVertical="$4"
      pressStyle={{ backgroundColor: "$blue11" }}
      disabled={disabled || loading}
      opacity={disabled || loading ? 0.6 : 1}
      onPress={onPress}
    >
      <XStack alignItems="center" space="$2">
        <Text color="white" fontWeight="600">
          {loading ? 'Creando cuenta...' : title}
        </Text>
        {loading && <Spinner size="small" color="white" />}
      </XStack>
    </Button>
  );
}
