import React from "react";
import { Button, Spinner } from "tamagui";

interface ResetPasswordButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const ResetPasswordButton: React.FC<ResetPasswordButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
}) => {
  return (
    <Button
      onPress={onPress}
      disabled={disabled || loading}
      backgroundColor="#ff6b35"
      color="$white"
      fontSize="$5"
      fontWeight="bold"
      height={50}
      borderRadius="$4"
      marginTop="$4"
      pressStyle={{
        backgroundColor: "#e55a2b",
        opacity: 0.9,
      }}
      opacity={disabled ? 0.5 : 1}
      icon={loading ? <Spinner color="$white" /> : undefined}
    >
      {loading ? "Actualizando..." : "Cambiar Contraseña"}
    </Button>
  );
};
