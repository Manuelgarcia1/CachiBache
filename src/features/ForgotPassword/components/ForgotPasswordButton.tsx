import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Button, Text } from 'tamagui'; // CAMBIO: Usamos XStack para alinear

// Define las propiedades que el componente ForgotPasswordButton puede recibir.
interface ForgotPasswordButtonProps {
  onPress: () => void; // Función que se ejecuta al presionar el botón.
  disabled?: boolean; // Indica si el botón debe estar deshabilitado.
  loading?: boolean; // Indica si el botón está en estado de carga.
  title?: string; // Texto a mostrar en el botón.
}

// Componente funcional para el botón de "Olvidé mi Contraseña".
export const ForgotPasswordButton: React.FC<ForgotPasswordButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
  title = 'Enviar Enlace',
}) => {
  // Determina si el botón debe estar deshabilitado (ya sea por `disabled` o `loading`).
  const isDisabled = disabled || loading;

  return (
    // Componente Button de Tamagui con estilos personalizados.
    <Button
      size="$4"
      backgroundColor="$yellow8" // Amarillo principal
      color="$black" // Texto oscuro para contraste
      fontWeight="bold"
      borderRadius="$10" // Bordes más redondeados
      pressStyle={{ backgroundColor: "$yellow9" }} // Estilo al presionar.
      onPress={onPress} // Asigna la función onPress.
      disabled={isDisabled} // Deshabilita el botón si `isDisabled` es true.
      opacity={isDisabled ? 0.6 : 1} // Reduce la opacidad si está deshabilitado.
      width="100%"
      marginVertical="$4" // Espacio vertical.
      // Muestra un ActivityIndicator si está cargando, de lo contrario no muestra icono.
      icon={loading ? () => <ActivityIndicator size="small" color="#111827" /> : undefined}
    >
      {/* Texto del botón, cambia a "Enviando..." si está cargando. */}
      <Text color="$black" fontWeight="bold" fontSize="$4">
        {loading ? "Enviando..." : title}
      </Text>
    </Button>
  );
};
