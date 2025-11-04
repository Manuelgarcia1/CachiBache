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
      size="$4"
      onPress={onPress}
      disabled={disabled || loading}
      backgroundColor="$yellow8"
      color="$black"
      fontWeight="bold"
      borderRadius="$10"
      marginTop="$4"
      pressStyle={{ backgroundColor: "$yellow9" }}
      opacity={disabled ? 0.6 : 1}
      icon={loading ? <Spinner color="$black" size="small" /> : undefined}
      width="100%"
    >
      {loading ? "Actualizando..." : "Cambiar Contraseña"}
    </Button>
  );
};
